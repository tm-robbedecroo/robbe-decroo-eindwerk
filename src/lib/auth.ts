import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { db } from "@/db/client"
import { users } from "@/db/schema"

import { and, eq } from "drizzle-orm"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {

        console.log("email and password", credentials.email, credentials.password)
 
        let user = await db.select().from(users).where(and(eq(users.email, credentials.email as string), eq(users.password, credentials.password as string))).limit(1);
 
        if (!user) throw new Error("Invalid credentials.")
        
        return user[0];
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
})