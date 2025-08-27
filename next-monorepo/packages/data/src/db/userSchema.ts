import { sql } from "drizzle-orm";
import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { injectCreatedAtAndUpdatedAt } from "./utils";

export const usersTable = pgTable("users", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatarUrl: text("avatar_url"),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").unique(),
  deletedAt: timestamp("deleted_at"),
  ...injectCreatedAtAndUpdatedAt(),
});

