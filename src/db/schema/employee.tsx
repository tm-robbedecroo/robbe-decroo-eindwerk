import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
    userId: t.uuid("user_id"),
    companyId: t.uuid("company_id"),
});