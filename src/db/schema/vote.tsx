import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { users } from "./user";
import { events } from "./event";
import { activities } from "./activity";

export const votes = pgTable("votes", {
    id: t.uuid("id").primaryKey().defaultRandom(),
    eventId: t.uuid("event_id").notNull().references(() => events.id),
    userId: t.uuid("user_id").notNull().references(() => users.id),
    activityId: t.uuid("activity_id").notNull().references(() => activities.id),
    created_at: t.timestamp("created_at").notNull().defaultNow(),
    updated_at: t.timestamp("updated_at").notNull(),
});