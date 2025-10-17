import db from '@/db';
import { eq } from 'drizzle-orm';
import { User } from './users.model';
import { user } from '@/db/schema';

export const userServices = {
  getAllUsersQuery: () => db.query.user.findMany(),

  getUserByIdQuery: (userId: number) =>
    db.query.user.findFirst({
      where: (user) => eq(user.id, userId),
    }),
  getUserByUsernameQuery: (username: string) =>
    db.query.user.findFirst({
      where: (user) => eq(user.username, username),
    }),
  getUsersRefreshToken: (token: string) =>
    db.query.user.findFirst({
      where: (user) => eq(user.token, token),
    }),
  createUserQuery: async (newUser: User) => {
    const createdUser = await db.insert(user).values(newUser).returning();
    return createdUser[0];
  },
  updateUserQuery: async (userId: number, userToUpdate: Partial<User>) => {
    const updatedUser = await db
      .update(user)
      .set(userToUpdate)
      .where(eq(user.id, userId))
      .returning();
    return updatedUser[0];
  },
};
