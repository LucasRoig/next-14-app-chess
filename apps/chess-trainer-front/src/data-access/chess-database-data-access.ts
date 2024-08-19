import { dbClient, type Game, type LichessSource, queryBuilder } from "@repo/database";

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
      sources: () => ({
        id: true,
        username: true,
        kind: true,
        ...queryBuilder.is(queryBuilder.LichessSource, {
          importBlitz: true,
          importBullet: true,
          importClassical: true,
          importCorrespondence: true,
          importRapid: true,
          importUltraBullet: true,
        })
      }),
      filter_single: {
        id,
      },
    }))
    .run(dbClient).then(r => {
      if (r) {
        return {
          ...r,
          sources: r.sources as Omit<LichessSource, "chessDatabase">[],
        }
      } else {
        return r;
      }
    });
}

export async function addGames(dbId: string, games: Omit<Game, "id">[], sourceId: string | undefined) {
  const promises = games.map((game) => addGame(dbId, game, sourceId));
  const results = await Promise.all(promises);
  return results;
}

export async function addLichessGameSource(dbId: string, source: Omit<LichessSource, "id" | "chessDatabase">) {
  return queryBuilder
    .insert(queryBuilder.LichessSource, {
      ...source,
      chessDatabase: queryBuilder.select(queryBuilder.ChessDatabase, () => ({
        filter_single: {
          id: queryBuilder.uuid(dbId),
        },
      })),
    })
    .run(dbClient);
}

export function addGame(dbId: string, game: Omit<Game, "id" | "chessDatabase" | "gameSource">, sourceId: string | undefined) {
  return queryBuilder
    .insert(queryBuilder.Game, {
      ...game,
      chessDatabase: queryBuilder.select(queryBuilder.ChessDatabase, () => ({
        filter_single: {
          id: queryBuilder.uuid(dbId),
        },
      })),
      gameSource: sourceId
        ? queryBuilder.select(queryBuilder.LichessSource, () => ({
            filter_single: {
              id: queryBuilder.uuid(sourceId),
            },
          }))
        : undefined,
    })
    .run(dbClient);
}
