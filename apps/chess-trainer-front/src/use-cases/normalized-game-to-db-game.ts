import { edgedb, type Game, type GameResult } from "@repo/database";
import { type NormalizedGame, type NormalizedGameWithoutId, type NormalizedFirstPosition, NormalizedGameHelper, type NormalizedPosition } from "../lib/chess/normalized-game";
import { z } from "zod";
import { FenUtils } from "../lib/chess/fen";
import { Color } from "../lib/chess/squares";

function getFromHeaders(game: NormalizedGameWithoutId, key: keyof NormalizedGame["headers"]): string | undefined {
  return game.headers[key];
}

function getFromHeadersOrDefault(
  game: NormalizedGameWithoutId,
  key: keyof NormalizedGame["headers"],
  defaultValue: string,
): string {
  return getFromHeaders(game, key) ?? defaultValue;
}

function parseNumber(str: string | undefined): number | undefined {
  if (str === undefined) {
    return undefined;
  }
  const parsed = Number.parseInt(str);
  if (Number.isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}

function parseResult(game: NormalizedGameWithoutId): GameResult {
  const gameResultSchema = z.enum(["1-0", "0-1", "1/2-1/2", "*"]);
  const result = getFromHeadersOrDefault(game, "Result", "*");
  const parsedResult = gameResultSchema.safeParse(result);
  if (parsedResult.success) {
    return parsedResult.data;
  } else {
    return "*";
  }
}

function parseDate(game: NormalizedGameWithoutId): edgedb.LocalDate | undefined {
  const date = getFromHeaders(game, "Date");
  if (date === undefined) {
    return undefined;
  }
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(date)) {
    const [year, month, day] = date.split(".");
    return new edgedb.LocalDate(Number.parseInt(year!), Number.parseInt(month!), Number.parseInt(day!));
  }
  return undefined;
}

function writePgn(game: NormalizedGameWithoutId): string {
  const sb = new StringBuilder();
  function prependSpace() {
    if (!sb.isEmpty() && sb.lastChar() !== " " && sb.lastChar() !== "\n") {
      sb.append(" ");
    }
  }
  function writeComment(comment: string | undefined) {
    if (comment) {
      prependSpace();
      sb.append(`{${comment}}`);
    }
  }

  function writeHeaders() {
    for (const [key, value] of Object.entries(game.headers)) {
      sb.append(`[${key} "${value}"]\n`);
    }
    if (!Object.keys(game.headers).includes("Result")) {
      sb.append(`[Result "*"]\n`);
    }
  }

  function writeSan(san: string) {
    prependSpace();
    sb.append(san);
  }
  function writeNags(nags: number[]) {
    for (const nag of nags) {
      prependSpace();
      sb.append(`$${nag}`);
    }
  }
  function writeMoveNumber(position: NormalizedPosition) {
    const moveCount = FenUtils.fenToFullMoves(position.fen);
    const color = FenUtils.fenToLastMoveColor(position.fen);
    prependSpace();
    if (color === "white") {
      sb.append(`${moveCount}.`);
    } else if (NormalizedGameHelper.isStartOfLine(game, position) || NormalizedGameHelper.isFirstInMainlineAfterVariation(game, position)) {
      sb.append(`${moveCount - 1}...`);
    }
  }

  function writeMove(position: NormalizedPosition, prevPos: NormalizedFirstPosition | undefined) {
    writeComment(position.commentBefore);
    writeMoveNumber(position);
    writeSan(position.san);
    writeNags(position.nags);
    writeComment(position.comment);

    if (prevPos) {
      for (const variationIndex of prevPos.variationsIndexes.slice(1)) {
        const variation = NormalizedGameHelper.getPositionAt(game, variationIndex) as NormalizedPosition;
        if (variation) {
          writeVariation(variation);
        }
      }
    }

    const nextPos = NormalizedGameHelper.getNextPos(game, position.index);
    if (nextPos) {
      writeMove(nextPos, position);
    }
  }

  function writeVariation(position: NormalizedPosition) {
    prependSpace();
    sb.append("(");
    writeMove(position, undefined);
    prependSpace();
    sb.append(")");
  }

  function writeMoves() {
    const firstPos = NormalizedGameHelper.getFirstPosition(game);
    const secondPos = NormalizedGameHelper.getNextPos(game, firstPos.index);
    if (!secondPos) {
      return;
    }
    writeMove(secondPos, firstPos);
  }

  function writeResult() {
    prependSpace();
    const result = parseResult(game);
    sb.append(result);
  }

  writeHeaders();
  writeComment(game.comment);
  writeMoves();
  writeResult();
  return sb.toString();
}

class StringBuilder {
  private strings: string[] = new Array("");

  constructor(value = "") {
    this.append(value);
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public append(value: any): StringBuilder {
    if (!value) {
      return this;
    }
    if (typeof value === "string") {
      this.strings.push(value);
    } else {
      this.strings.push(value.toString());
    }
    return this;
  }

  public isEmpty(): boolean {
    for (let i = 0; i < this.strings.length; i++) {
      if (this.strings[i]!.length > 0) {
        return false;
      }
    }
    return true;
  }

  public lastChar(): string | null {
    if (this.strings.length === 0) {
      return null;
    }
    return this.strings[this.strings.length - 1]!.slice(-1);
  }

  public toString() {
    return this.strings.join("");
  }
}

export function normalizedGameToDbGameUseCase(
  normalizedGame: NormalizedGameWithoutId,
): Omit<Game, "id"> {

  const pgn = writePgn(normalizedGame);
  console.debug("pgn", pgn);
  const game: Omit<Game, "id"> = {
    result: parseResult(normalizedGame),
    white: getFromHeadersOrDefault(normalizedGame, "White", "?"),
    black: getFromHeaders(normalizedGame, "Black"),
    whiteElo: parseNumber(getFromHeaders(normalizedGame, "WhiteElo")),
    blackElo: parseNumber(getFromHeaders(normalizedGame, "BlackElo")),
    event: getFromHeaders(normalizedGame, "Event"),
    date: parseDate(normalizedGame),
    pgn,
  };
  return game;
}
