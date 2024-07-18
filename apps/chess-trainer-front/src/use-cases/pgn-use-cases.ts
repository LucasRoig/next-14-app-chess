import { Chess } from "chess.js";
import { parse, type ParseTree } from '@mliebelt/pgn-parser'

export function validatePgnUseCase(pgn: string) {
  try {
    const _game = parse(pgn, {startRule: "game"}) as ParseTree;
    return true;
  } catch (_e) {
    return false;
  }
}