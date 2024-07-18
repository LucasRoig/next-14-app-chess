import { dbClient, queryBuilder } from "@repo/database";

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
      }),
      filter_single: {
        id,
      },
    }))
    .run(dbClient);
}
