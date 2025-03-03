import { pgTable } from "drizzle-orm/pg-core";
import * as t from 'drizzle-orm/pg-core';

export const activities = pgTable('activities', {
    id: t.uuid('id').primaryKey().defaultRandom(),
    eventId: t.uuid('event_id').notNull(),
    name: t.text('name').notNull(),
    description: t.text('description'),
    imageUrl: t.text('image_url'),
    price: t.text('price'),
    created_at: t.timestamp("created_at").defaultNow(),
    updated_at: t.timestamp("updated_at"),
})