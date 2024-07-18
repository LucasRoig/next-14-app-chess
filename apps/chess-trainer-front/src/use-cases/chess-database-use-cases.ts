import { createChessDatabase, getAllChessDatabases } from "../data-access/chess-database-data-access";

export function createChessDatabaseUseCase(newDatabase: {
  name: string;
}) {
  return createChessDatabase(newDatabase.name);
}

export function getAllChessDatabasesUseCase() {
  return getAllChessDatabases();
}