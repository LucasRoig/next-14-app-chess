import { dbClient, type Game, queryBuilder } from "@repo/database";

export function createChessDatabase(name: string) {
  return queryBuilder
    .insert(queryBuilder.ChessDatabase, {
      name,
    })
    .run(dbClient);
}

export function getAllChessDatabases() {
  return queryBuilder
    .select(queryBuilder.ChessDatabase, () => ({
      name: true,
      id: true,
    }))
    .run(dbClient);
}

export function getChessDatabaseById(id: string) {
  return queryBuilder
    .select(queryBuilder.ChessDatabase, () => ({
      name: true,
      id: true,
      games: () => ({
        id: true,
        white: true,
        black: true,
        date: true,
        result: true,
        event: true,
        whiteElo: true,
        blackElo: true,
      }),
      filter_single: {
        id,
      },
    }))
    .run(dbClient);
}

export async function addGames(dbId: string, games: Omit<Game, "id">[]) {
  const promises = games.map(game => addGame(dbId, game));
  const results = await Promise.all(promises);
  return results;
}

export function addGame(dbId: string, game: Omit<Game, "id" | "chessDatabase">) {
  return queryBuilder.insert(queryBuilder.Game, {
    ...game,
    chessDatabase: queryBuilder.select(queryBuilder.ChessDatabase, () => ({
      filter_single: {
        id: queryBuilder.uuid(dbId)
      }
    }))
  }).run(dbClient);
}