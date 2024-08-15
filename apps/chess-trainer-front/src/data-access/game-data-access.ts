import { dbClient, queryBuilder } from "@repo/database";

export function findGameById(id: string) {
  return queryBuilder
    .select(queryBuilder.Game, (game) => ({
      id: true,
      pgn: true,
      filter_single: queryBuilder.op(game.id, "=", queryBuilder.uuid(id)),
    }))
    .run(dbClient);
}