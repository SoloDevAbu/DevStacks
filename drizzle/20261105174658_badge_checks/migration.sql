ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "badge_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "badge_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "badge_checked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "badge_check_failures" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "badge_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "badge_url" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "badge_checked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "badge_check_failures" integer DEFAULT 0 NOT NULL;