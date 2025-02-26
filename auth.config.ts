import { db } from '@/db/client';
import { users } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import type { NextAuthConfig } from 'next-auth';

import Credentials from 'next-auth/providers/credentials';

// Define the structure of our user
export type CustomUser = {
  id: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  // Add any other fields from your users table
}

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials): Promise<CustomUser | null> => {
        const user = await db.select().from(users).where(and(eq(users.email, credentials.email as string), eq(users.password, credentials.password as string))).limit(1);
 
        if (!user || user.length === 0) throw new Error("Invalid credentials.");
        
        // Return all user data except sensitive fields
        const userData = user[0];
        const { password, ...userWithoutPassword } = userData;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user as CustomUser;
      }
      return token;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token.user) {
        session.user = token.user as CustomUser;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;