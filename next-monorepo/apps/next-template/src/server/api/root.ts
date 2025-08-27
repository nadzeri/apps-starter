import { createTRPCRouter } from "./trpc";
import { tempRouter } from "./routers/temp";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  temp: tempRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
