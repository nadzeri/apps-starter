import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "../db/userSchema";

export const userTableSchema = createInsertSchema(usersTable);

export type UserTable = z.infer<typeof userTableSchema>;

export const userSchema = userTableSchema.extend({
  displayName: z.string()
});

export type User = z.infer<typeof userSchema>;
