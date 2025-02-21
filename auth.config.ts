import { db } from '@/db/client';
import { users } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import type { NextAuthConfig } from 'next-auth';

import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
 
        const user = await db.select().from(users).where(and(eq(users.email, credentials.email as string), eq(users.password, credentials.password as string))).limit(1);
 
        if (!user) throw new Error("Invalid credentials.")
        
        return user[0];
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;