
"use server";

import { z } from "zod";
import { publicAction } from "../../lib/safe-actions";
import { createChessDatabaseUseCase } from "../../use-cases/chess-database-use-cases";
import { revalidatePath } from "next/cache";

export const createChessDatabaseAction = publicAction.createServerAction().input(z.object({
  name: z.string().min(1).max(100),
})).handler(async ({input}) => {
  await createChessDatabaseUseCase(input);
  revalidatePath("/")
})