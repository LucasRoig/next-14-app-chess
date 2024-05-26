import { FenUtils } from "./fen";
import { Move } from "./moves";

type NormalizedFirstPosition = {
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

const findParentVariation = (
  game: NormalizedGame,
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
  getFirstPosition(g: NormalizedGame): NormalizedFirstPosition {
    const position = g.positions[0];
    if (position === undefined) {
      throw new Error("This game doesn't have a first position");
    }
    return position;
  },

  positionToUci(position: NormalizedPosition, game: NormalizedGame): string {
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
    let lastMoveColor = FenUtils.fenToLastMoveColor(position.fen);
    if (lastMoveColor === "white" || forceMoveNumber) {
      let separator = lastMoveColor === "white" ? "." : "...";
      let fullMoves = FenUtils.fenToFullMoves(position.fen);
      if (lastMoveColor === "black") {
        fullMoves--;
      }
      uci = fullMoves + separator + uci;
    }
    return uci;
  },

  getNextPos(g: NormalizedGame, currentIndex: number): NormalizedPosition | undefined {
    const nextI = g.positions[currentIndex]?.variationsIndexes[0];
    if (nextI !== undefined) {
      return g.positions[nextI] as NormalizedPosition;
    } else {
      return undefined;
    }
  },

  getPreviousPos(g: NormalizedGame, currentIndex: number): NormalizedPosition | NormalizedFirstPosition | undefined {
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

  getAllMainlinePositions(game: NormalizedGame, start: NormalizedPosition): NormalizedPosition[] {
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

  isMainline(game: NormalizedGame, position: NormalizedPosition | NormalizedFirstPosition): boolean {
    return findParentVariation(game, position) === undefined;
  },

  getPositionAt(game: NormalizedGame, i: number): NormalizedPosition | NormalizedFirstPosition | undefined {
    return game.positions[i];
  },
};
