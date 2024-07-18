"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { publicAction } from "../../lib/safe-actions";
import { createChessDatabaseUseCase } from "../../use-cases/chess-database-use-cases";

export const createChessDatabaseAction = publicAction
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1).max(100),
    }),
  )
  .handler(async ({ input }) => {
    await createChessDatabaseUseCase(input);
    revalidatePath("/");
  });
