import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { userRepo } from "@repo/data/repos";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getUsers: publicProcedure.query(({ ctx }) => {
    return userRepo.getAll({ db: ctx.db });
  }),
  getUserById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return userRepo.getById({ db: ctx.db, id: input });
  }),
});
