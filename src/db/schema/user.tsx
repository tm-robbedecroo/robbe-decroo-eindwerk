import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: t.uuid("id").primaryKey().defaultRandom(),
    firstName: t.varchar("first_name").notNull(),
    lastName: t.varchar("last_name").notNull(),
    email: t.varchar("email").unique().notNull(),
    password: t.varchar("password").notNull(),
    role: t.varchar("role").notNull(),
    created_at: t.timestamp("created_at").notNull().defaultNow(),
    updated_at: t.timestamp("updated_at").notNull().defaultNow(),
});