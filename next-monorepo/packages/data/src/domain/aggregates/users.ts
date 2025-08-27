import { User, userSchema, UserTable } from "../../types/users";

const create = (args: UserTable): User => {
  return userSchema.parse({
    ...args,
    displayName: args.firstName,
  });
};

const update = (args: { existingUser: User; updatedUser: Omit<UserTable, "noiiId"> }): User => {
  const { email, ...updatedUser } = args.updatedUser;

  return userSchema.parse({ ...args.existingUser, ...updatedUser });
};

const updateEmail = (args: { existingUser: User; email: string }): User => {
  return userSchema.parse({ ...args.existingUser, email: args.email });
};

export const userAggregate = {
  create,
  update,
  updateEmail
};
