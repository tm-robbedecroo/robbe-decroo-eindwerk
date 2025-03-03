CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"price" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
