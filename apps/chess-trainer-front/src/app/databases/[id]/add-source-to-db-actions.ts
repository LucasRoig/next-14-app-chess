"use server";

import { revalidatePath } from "next/cache";
import { publicAction } from "../../../lib/safe-actions";
import { z } from "zod";
import { addLichessGameSource } from "../../../data-access/chess-database-data-access";

export const addSourceToDbAction = publicAction
  .createServerAction()
  .input(
    z.object({
      dbId: z.string().min(1),
      username: z.string().min(1),
      importBlitz: z.boolean(),
      importBullet: z.boolean(),
      importClassical: z.boolean(),
      importCorrespondence: z.boolean(),
      importRapid: z.boolean(),
      importUltraBullet: z.boolean(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const { dbId, ...source } = input;
      const result = await addLichessGameSource(input.dbId, {
        kind: "Lichess",
        ...source,
      });
      revalidatePath("/");
      return result;
    } catch (e) {
      console.error(e);
      return;
    }
  });
