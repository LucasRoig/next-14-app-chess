import { createServerActionProcedure } from "zsa"
import { rateLimitByKey } from "./limiter";

export const publicAction = createServerActionProcedure()
  .handler(() => {
    rateLimitByKey({
      key: "unauthenticated-global",
      limit: 10,
      window: 10000,
    });
  })