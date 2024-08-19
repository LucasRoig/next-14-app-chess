"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { publicAction } from "../../../lib/safe-actions";
import { parsePgnUseCase } from "../../../use-cases/pgn-use-cases";
import { addGames } from "../../../data-access/chess-database-data-access";
import { normalizedGameToDbGameUseCase } from "../../../use-cases/normalized-game-to-db-game";

export const importPgnAction = publicAction
  .createServerAction()
  .input(
    z.object({
      pgn: z.string().min(1),
      dbId: z.string().min(1),
    }),
  )
  .handler(async ({ input }) => {
    try {

      const pgnGames = parsePgnUseCase(input.pgn);
      console.debug("pgnGames", pgnGames);
      const dbGames = pgnGames.map((pgnGame) => normalizedGameToDbGameUseCase(pgnGame));
      const result = await addGames(input.dbId, dbGames, undefined);
      revalidatePath("/");
      return result;
    } catch (e) {
      console.error(e);
      return;
    }
  });
