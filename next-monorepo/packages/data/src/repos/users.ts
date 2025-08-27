import { and, count, eq, gte, ilike, inArray, lte, sql } from "drizzle-orm";
import { Db } from "../db";
import { usersTable } from "../db/userSchema";
import { userAggregate } from "../domain/aggregates";
import { applyTracing } from "../lib/utils/tracing";
import { User } from "../types/users";

const save = async (args: { db: Db; user: User }): Promise<User> => {
  const { db, user } = args;

  const [newUser] = await db
    .insert(usersTable)
    .values(user)
    .onConflictDoUpdate({
      target: usersTable.id,
      set: user,
    })
    .returning();

  return userAggregate.create(newUser!);
};

const getById = async (args: { db: Db; id: string }): Promise<User | null> => {
  const { db, id } = args;
  const user = await db.query.usersTable.findFirst({
    where: (user, { eq, and, isNull }) => and(eq(user.id, id), isNull(user.deletedAt)),
  });
  if (!user) {
    return null;
  }
  return userAggregate.create(user);
};

const getAll = async (args: { db: Db }): Promise<User[]> => {
  const { db } = args;
  return (await db.query.usersTable.findMany()).map((p) => userAggregate.create(p));
};

const getUserByEmail = async (args: { db: Db; email: string }): Promise<User | null> => {
  const user = await args.db.query.usersTable.findFirst({
    where: eq(usersTable.email, args.email),
  });

  if (!user) {
    return null;
  }

  return userAggregate.create(user!);
};

const searchUser = async (args: { db: Db; searchTerm: string; limit: number; page: number }) => {
  const { db, searchTerm } = args;

  const users = await db.query.usersTable.findMany({
    where: (usersTable, { ilike }) => {
      return ilike(
        sql`REGEXP_REPLACE(${usersTable.firstName}, '\\s+', '', 'g') || REGEXP_REPLACE(${usersTable.lastName}, '\\s+', '', 'g')` as any,
        `%${searchTerm.replace(/\s+/g, "").trim()}%`
      );
    },
    limit: args.limit,
    offset: (args.page - 1) * args.limit,
  });

  if (!users)
    return {
      count: 0,
      users: [],
    };

  const totalCountResult = await db
    .select({ count: count() })
    .from(usersTable)
    .where(ilike(sql`${usersTable.firstName} || ' ' || ${usersTable.lastName}` as any, `%${searchTerm}%`));
  const totalCount = totalCountResult[0]?.count ?? 0;

  const data = users.map((p) => userAggregate.create(p));

  return {
    count: totalCount,
    users: data,
  };
};

const _dangerous_deleteById = async (db: Db, id: string) => {
  await db.delete(usersTable).where(eq(usersTable.id, id));
};

const _dangerous_deleteByFirstAndLastName = async (db: Db, firstName: string, lastName: string) => {
  await db.delete(usersTable).where(and(eq(usersTable.firstName, firstName), eq(usersTable.lastName, lastName)));
};

export const userRepo = applyTracing(
  {
    save,
    getById,
    getAll,
    getUserByEmail,
    searchUser,
    _dangerous_deleteById,
    _dangerous_deleteByFirstAndLastName,
  },
  "userRepo"
);
