import { Chess } from "chess.js";
import { FenUtils } from "./fen";
import type { Move } from "./moves";
import type { Square } from "./squares";
import type { ParseTree } from "@mliebelt/pgn-parser";

const FIRST_POSITION_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

type Headers = Record<keyof NonNullable<ParseTree["tags"]>, string>;

export type NormalizedFirstPosition = {
  index: number;
  variationsIndexes: number[];
  fen: string;
  comment?: string;
};

export type NormalizedPosition = NormalizedFirstPosition & {
  nags: number[];
  commentBefore?: string;
  move: Move;
  san: string;
  parent: number;
};

export type NormalizedGame = {
  headers: Headers;
  id: string;
  comment?: string;
  positions: {
    [key: number]: NormalizedFirstPosition | NormalizedPosition;
  };
};

export type NormalizedGameWithoutId = Omit<NormalizedGame, "id">;

const findParentVariation = (
  game: NormalizedGameWithoutId,
  pos: NormalizedPosition | NormalizedFirstPosition,
):
  | { variationParent: NormalizedPosition | NormalizedFirstPosition; firstVariationPos: NormalizedPosition }
  | undefined => {
  let p: NormalizedPosition | NormalizedFirstPosition | undefined = pos;
  while (p) {
    const parent = NormalizedGameHelper.getPreviousPos(game, p.index);
    if (!parent) {
      return undefined;
    }
    if (parent.variationsIndexes[0] !== p.index) {
      return {
        variationParent: parent,
        firstVariationPos: p as NormalizedPosition,
      };
    }
    p = parent;
  }
  return undefined;
};

export const NormalizedGameHelper = {
  newNormalizedGame(firstPostionFen = FIRST_POSITION_FEN): NormalizedGameWithoutId {
    return {
      headers: {},
      positions: [
        {
          index: 0,
          variationsIndexes: [],
          nags: [],
          fen: firstPostionFen,
          san: "",
        },
      ],
    };
  },
  getFirstPosition(g: NormalizedGameWithoutId): NormalizedFirstPosition {
    const position = g.positions[0];
    if (position === undefined) {
      throw new Error("This game doesn't have a first position");
    }
    return position;
  },

  positionToUci(position: NormalizedPosition, game: NormalizedGameWithoutId): string {
    let uci = position.san;
    let forceMoveNumber = false;
    const parent = NormalizedGameHelper.getPreviousPos(game, position.index);
    //force if first move of variation
    if (parent?.variationsIndexes[0] !== position.index) {
      forceMoveNumber = true;
    }
    //force if first move after variation
    if (parent) {
      //Check that grandparent has variations and that position is in the mainline from grandparent
      const grandparent = NormalizedGameHelper.getPreviousPos(game, parent.index);
      if (
        grandparent &&
        grandparent.variationsIndexes.length > 1 &&
        parent.index === grandparent.variationsIndexes[0] &&
        parent.variationsIndexes[0] === position.index
      ) {
        forceMoveNumber = true;
      }
    }
    //force if first move after comment
    if (
      (parent?.comment && parent?.comment.length > 0) ||
      (position.commentBefore && position.commentBefore.length > 0)
    ) {
      forceMoveNumber = true;
    }
    const lastMoveColor = FenUtils.fenToLastMoveColor(position.fen);
    if (lastMoveColor === "white" || forceMoveNumber) {
      const separator = lastMoveColor === "white" ? "." : "...";
      let fullMoves = FenUtils.fenToFullMoves(position.fen);
      if (lastMoveColor === "black") {
        fullMoves--;
      }
      uci = fullMoves + separator + uci;
    }
    return uci;
  },

  getNextPos(g: NormalizedGameWithoutId, currentIndex: number): NormalizedPosition | undefined {
    const nextI = g.positions[currentIndex]?.variationsIndexes[0];
    if (nextI !== undefined) {
      return g.positions[nextI] as NormalizedPosition;
    } else {
      return undefined;
    }
  },

  getPreviousPos(
    g: NormalizedGameWithoutId,
    currentIndex: number,
  ): NormalizedPosition | NormalizedFirstPosition | undefined {
    if (currentIndex === 0) {
      return undefined;
    }
    const previousI = (g.positions[currentIndex] as NormalizedPosition)?.parent;
    if (previousI !== undefined) {
      return g.positions[previousI];
    } else {
      return undefined;
    }
  },

  getAllMainlinePositions(game: NormalizedGameWithoutId, start: NormalizedPosition): NormalizedPosition[] {
    const result: NormalizedPosition[] = [];
    let current: NormalizedPosition | undefined = start;
    while (current) {
      if (current.index !== 0) {
        result.push(current);
      }
      current = this.getNextPos(game, current.index);
    }
    return result;
  },

  isMainline(game: NormalizedGameWithoutId, position: NormalizedPosition | NormalizedFirstPosition): boolean {
    return findParentVariation(game, position) === undefined;
  },

  getPositionAt(game: NormalizedGameWithoutId, i: number): NormalizedPosition | NormalizedFirstPosition | undefined {
    return game.positions[i];
  },

  isStartOfLine(game: NormalizedGameWithoutId, pos: NormalizedPosition | NormalizedFirstPosition): boolean {
    const parent = NormalizedGameHelper.getPreviousPos(game, pos.index);
    if (parent === undefined) {
      return true;
    }
    if (parent.variationsIndexes.length === 0) {
      return true;
    }
    return parent.variationsIndexes[0] !== pos.index;
  },

  isFirstInMainlineAfterVariation(game: NormalizedGameWithoutId, pos: NormalizedPosition | NormalizedFirstPosition): boolean {
    const parent = NormalizedGameHelper.getPreviousPos(game, pos.index);
    if (parent === undefined) {
      return false;
    }
    const grandparent = NormalizedGameHelper.getPreviousPos(game, parent.index);
    if (grandparent === undefined) {
      return false;
    }
    if (grandparent.variationsIndexes.length <= 1) { 
      return false;
    }
    return grandparent.variationsIndexes[0] === parent.index;
  }
};

export const NormalizedGameMutator = {
  deleteFromPosition(game: NormalizedGameWithoutId, pos: NormalizedPosition): NormalizedGameWithoutId {
    const parent = NormalizedGameHelper.getPreviousPos(game, pos.index);
    function indexesToDelete(pos: NormalizedPosition): number[] {
      if (pos.variationsIndexes.length === 0) {
        return [pos.index];
      }
      let indexes = [pos.index];
      for (const i of pos.variationsIndexes) {
        const child = NormalizedGameHelper.getPositionAt(game, i);
        if (child && child.index > 0) {
          indexes = indexes.concat(indexesToDelete(child as NormalizedPosition));
        }
      }
      return indexes;
    }
    const toDelete = indexesToDelete(pos);
    const newPositions = { ...game.positions };
    for (const i of toDelete) {
      delete newPositions[i];
    }
    if (parent) {
      newPositions[parent.index].variationsIndexes = newPositions[parent.index].variationsIndexes.filter(
        (i) => i !== pos.index,
      );
    }

    return {
      ...game,
      positions: newPositions,
    };
  },

  promoteVariation(
    game: NormalizedGameWithoutId,
    pos: NormalizedPosition,
  ): { hasChanged: false } | { hasChanged: true; game: NormalizedGameWithoutId } {
    const parentVariationWrapper = findParentVariation(game, pos);
    if (parentVariationWrapper === undefined) {
      return { hasChanged: false };
    }
    const { variationParent, firstVariationPos } = parentVariationWrapper;
    const newParent = {
      ...variationParent,
    };
    newParent.variationsIndexes = newParent.variationsIndexes.filter((i) => i !== firstVariationPos.index);
    newParent.variationsIndexes.unshift(firstVariationPos.index);
    return {
      hasChanged: true,
      game: updatePosAtIndex(game, newParent, newParent.index),
    };
  },

  makeMainLine(
    game: NormalizedGameWithoutId,
    position: NormalizedPosition,
  ): { hasChanged: false } | { hasChanged: true; game: NormalizedGameWithoutId } {
    let i = 0;
    while (!NormalizedGameHelper.isMainline(game, position)) {
      const r = this.promoteVariation(game, position);
      if (r.hasChanged) {
        game = r.game;
      }
      i++;
    }
    if (i > 0) {
      return { hasChanged: true, game: game };
    } else {
      return { hasChanged: false };
    }
  },

  deleteVariation(
    game: NormalizedGameWithoutId,
    position: NormalizedPosition,
  ):
    | { hasChanged: false }
    | {
        hasChanged: true;
        game: NormalizedGameWithoutId;
        variationParent: NormalizedPosition | NormalizedFirstPosition;
      } {
    const variationWrapper = findParentVariation(game, position);
    if (variationWrapper === undefined) {
      return { hasChanged: false };
    }
    const { variationParent, firstVariationPos } = variationWrapper;
    const g = this.deleteFromPosition(game, firstVariationPos);
    return { hasChanged: true, game: g, variationParent };
  },

  handleMove(
    game: NormalizedGameWithoutId,
    pos: NormalizedFirstPosition,
    from: Square,
    to: Square,
    san: string,
    fen: string,
  ):
    | { hasChanged: false; posToGo: NormalizedPosition | NormalizedFirstPosition }
    | { hasChanged: true; game: NormalizedGameWithoutId; posToGo: NormalizedPosition | NormalizedFirstPosition } {
    const find = pos.variationsIndexes
      .map((i) => NormalizedGameHelper.getPositionAt(game, i))
      .find((p) => p?.fen === fen);
    if (find) {
      return { hasChanged: false, posToGo: find };
    } else {
      let maxIndex = 0;
      for (const i in game.positions) {
        if (Number.parseInt(i) > maxIndex) {
          maxIndex = Number.parseInt(i);
        }
      }
      const p: NormalizedPosition = {
        index: maxIndex + 1,
        fen,
        move: { from, to },
        variationsIndexes: [],
        san,
        comment: "",
        parent: pos.index,
        commentBefore: "",
        nags: [],
      };
      pos.variationsIndexes.push(p.index);
      const g = updatePosAtIndex(game, pos, pos.index);
      g.positions[p.index] = p;
      return { posToGo: p, hasChanged: true, game: g };
    }
  },

  handleMoveFromSan(
    game: NormalizedGameWithoutId,
    pos: NormalizedFirstPosition,
    san: string,
  ):
    | { hasChanged: false; posToGo: NormalizedPosition | NormalizedFirstPosition }
    | { hasChanged: true; game: NormalizedGameWithoutId; posToGo: NormalizedPosition | NormalizedFirstPosition } {
    const chess = new Chess(pos.fen);
    const move = chess.move(san);
    const newFen = chess.fen();
    return this.handleMove(game, pos, move.from, move.to, san, newFen);
  },

  setCommentAfter(game: NormalizedGameWithoutId, pos: NormalizedPosition, comment: string): NormalizedGameWithoutId {
    const newPos = {
      ...pos,
      comment,
    };
    return updatePosAtIndex(game, newPos, newPos.index);
  },
  setCommentBefore(game: NormalizedGameWithoutId, pos: NormalizedPosition, comment: string): NormalizedGameWithoutId {
    const newPos = {
      ...pos,
      commentBefore: comment,
    };
    return updatePosAtIndex(game, newPos, newPos.index);
  },
};

const updatePosAtIndex = (
  game: NormalizedGameWithoutId,
  pos: NormalizedPosition | NormalizedFirstPosition,
  index: number,
): NormalizedGameWithoutId => {
  const newPositions = { ...game.positions };
  newPositions[index] = pos;
  return {
    ...game,
    positions: newPositions,
  };
};
