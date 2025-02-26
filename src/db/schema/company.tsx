import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
    id: t.uuid("id").primaryKey().defaultRandom(),
    name: t.text("name").notNull(),
    description: t.text("description"),
    owner: t.text("owner").notNull(),
    imageUrl: t.text("image_url"),
    bannerImageUrl: t.text("banner_image_url"),
    created_at: t.timestamp("created_at").defaultNow(),
    updated_at: t.timestamp("updated_at"),
});