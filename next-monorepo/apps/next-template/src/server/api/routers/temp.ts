import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tempRouter = createTRPCRouter({
  first: publicProcedure.query(({ ctx }) => {
    return "Hello";
  }),
});
