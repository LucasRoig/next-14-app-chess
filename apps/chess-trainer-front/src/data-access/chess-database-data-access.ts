import { dbClient, queryBuilder } from "@repo/database";

export function createChessDatabase(name: string) {
  return queryBuilder.insert(queryBuilder.ChessDatabase, {
    name,
  }).run(dbClient);
}

export function getAllChessDatabases() {
  return queryBuilder.select(queryBuilder.ChessDatabase, () => ({
    name: true,
    id: true,
  })).run(dbClient);
}