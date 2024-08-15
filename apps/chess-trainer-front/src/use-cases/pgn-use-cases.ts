import { type ParseTree, parse } from "@mliebelt/pgn-parser";
import {
  type NormalizedFirstPosition,
  NormalizedGameHelper,
  NormalizedGameMutator,
  type NormalizedGameWithoutId,
  type NormalizedPosition,
} from "../lib/chess/normalized-game";
import { match, P } from "ts-pattern";

type Tags = NonNullable<ParseTree["tags"]>;
type PgnMove = NonNullable<ParseTree["moves"]>[number];

function getGames(pgn: string) {
  const games = parse(pgn, { startRule: "games" }) as ParseTree[];
  return games;
}

function parseTreeToNormalizedGame(tree: ParseTree): NormalizedGameWithoutId {
  console.debug("parsing a pgn");
  let game = NormalizedGameHelper.newNormalizedGame();
  if (tree.tags) {
    for (const [key, value] of Object.entries(tree.tags)) {
      const k = key as keyof Tags;
      match(k)
        .with(P.union("Date", "EventDate", "UTCDate"), (k) => {
          const v = value as Tags[typeof k];
          if (v.value !== undefined) {
            game.headers[k] = v.value;
          }
        })
        .with("TimeControl", (k) => {
          const v = value as Tags[typeof k];
          if (v.value !== undefined) {
            game.headers[k] = v.value;
          }
        })
        .with(P.union("Time", "UTCTime"), (k) => {
          const v = value as Tags[typeof k];
          if (v.value !== undefined) {
            game.headers[k] = v.value;
          }
        })
        .with("messages", () => {})
        .otherwise((k) => {
          const v = value as Tags[typeof k];
          game.headers[k] = v;
        });
    }
  }
  if (tree.gameComment?.comment !== undefined) {
    game.comment = tree.gameComment.comment;
  }
  function parseLine(line: PgnMove[], pos: NormalizedFirstPosition) {
    console.debug("parsing a line", pos);
    let currentPosition = pos;
    for (const move of line) {
      console.debug("parsing a move", move);
      const san = move.notation.notation;
      const r = NormalizedGameMutator.handleMoveFromSan(game, currentPosition, san);
      if (r.hasChanged) {
        game = r.game;
      }
      const posToGo = r.posToGo as NormalizedPosition;
      posToGo.commentBefore = move.commentMove; 
      posToGo.comment = move.commentAfter;
      posToGo.nags = (move.nag ?? []).map(n => Number.parseInt(n.slice(1)));//first char is $
      for (const line of move.variations) {
        parseLine(line, currentPosition);
      }
      currentPosition = posToGo;
    }
  }
  parseLine(tree.moves, game.positions[0]!);
  return game;
}

export function validatePgnUseCase(pgn: string) {
  try {
    const _games = getGames(pgn);
    console.log("game", _games);
    return true;
  } catch (_e) {
    return false;
  }
}

export function parsePgnUseCase(pgn: string) {
  const games = getGames(pgn);
  const normalizedGames: NormalizedGameWithoutId[] = [];
  for (const game of games) {
    const normalizedGame = parseTreeToNormalizedGame(game);
    normalizedGames.push(normalizedGame);
  }
  console.debug("normalizedGames", normalizedGames);
  return normalizedGames;
}
