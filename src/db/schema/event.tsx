import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const events = pgTable("events", {
    id: t.uuid("id").primaryKey().defaultRandom(),
    companyId: t.uuid("company_id").notNull(),
    name: t.varchar("name").notNull(),
    description: t.varchar("description").notNull(),
    openVotingDate: t.timestamp("open_voting_date").notNull(),
    closeVotingDate: t.timestamp("close_voting_date").notNull(),
    date: t.timestamp("date").notNull(),
    created_at: t.timestamp("created_at").notNull().defaultNow(),
    updated_at: t.timestamp("updated_at").notNull(),
});