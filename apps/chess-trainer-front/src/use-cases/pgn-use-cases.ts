import { type ParseTree, parse } from "@mliebelt/pgn-parser";
import { Chess } from "chess.js";

export function validatePgnUseCase(pgn: string) {
  try {
    const _game = parse(pgn, { startRule: "game" }) as ParseTree;
    return true;
  } catch (_e) {
    return false;
  }
}
