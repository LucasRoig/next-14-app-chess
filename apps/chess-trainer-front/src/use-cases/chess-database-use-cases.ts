import {
  createChessDatabase,
  getAllChessDatabases,
  getChessDatabaseById,
} from "../data-access/chess-database-data-access";

export function createChessDatabaseUseCase(newDatabase: {
  name: string;
}) {
  return createChessDatabase(newDatabase.name);
}

export function getAllChessDatabasesUseCase() {
  return getAllChessDatabases();
}

export async function getChessDatabaseByIdUseCase(id: string) {
  const database = await getChessDatabaseById(id);
  if (!database) {
    throw new Error("Database not found");
  }
  return database;
}
