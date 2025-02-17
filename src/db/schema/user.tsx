import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: t.uuid().primaryKey().defaultRandom(),
    firstName: t.varchar().notNull(),
    lastName: t.varchar().notNull(),
    email: t.varchar().unique().notNull(),
    password: t.varchar().notNull(),
    role: t.varchar().notNull(),
    created_at: t.timestamp().notNull().defaultNow(),
    updated_at: t.timestamp().notNull().defaultNow(),
});