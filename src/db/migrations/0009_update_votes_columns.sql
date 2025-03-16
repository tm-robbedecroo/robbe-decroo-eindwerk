-- First, drop existing votes table
DROP TABLE IF EXISTS "votes";

-- Recreate votes table with correct column types and foreign keys
CREATE TABLE "votes" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "event_id" uuid NOT NULL REFERENCES "events"("id"),
    "user_id" uuid NOT NULL REFERENCES "users"("id"),
    "activity_id" uuid NOT NULL REFERENCES "activities"("id"),
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp NOT NULL
); 