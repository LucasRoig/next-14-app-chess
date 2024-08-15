import { findGameById } from "../data-access/game-data-access";
import { parsePgnUseCase } from "./pgn-use-cases";

export async function findGameByIdUseCase(id: string) {
  const dbGame = await findGameById(id);
  if (dbGame === null) {
    throw new Error("Game not found");
  }
  const normalizedGame = parsePgnUseCase(dbGame.pgn)[0]!;
  return {
    ...normalizedGame,
    id: dbGame.id
  };
}