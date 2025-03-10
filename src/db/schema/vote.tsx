import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const votes = pgTable("votes", {
    id: t.uuid("id").primaryKey().defaultRandom(),
    eventId: t.varchar("event_id").notNull(),
    userId: t.varchar("user_id").notNull(),
    activityId: t.varchar("activity_id").notNull(),
    created_at: t.timestamp("created_at").notNull().defaultNow(),
    updated_at: t.timestamp("updated_at").notNull(),
});