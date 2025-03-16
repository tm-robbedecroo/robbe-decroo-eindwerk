-- Add selectedActivityId column to events table
ALTER TABLE "events" ADD COLUMN "selected_activity_id" uuid REFERENCES "activities"("id"); 