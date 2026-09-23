CREATE TYPE "launch_item_type" AS ENUM('tool', 'product');--> statement-breakpoint
CREATE TYPE "launch_status" AS ENUM('scheduled', 'live', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "launches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"tool_id" uuid,
	"product_id" uuid,
	"submitter_id" text NOT NULL,
	"item_type" "launch_item_type" NOT NULL,
	"iso_year" integer NOT NULL,
	"iso_week" integer NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"tier" "tier" DEFAULT 'free'::"tier" NOT NULL,
	"status" "status" DEFAULT 'pending'::"status" NOT NULL,
	"launch_status" "launch_status" DEFAULT 'scheduled'::"launch_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "launch_year" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "launch_week" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "launch_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "launch_year" integer;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "launch_week" integer;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "launch_date" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "launches_year_week_idx" ON "launches" ("iso_year","iso_week");--> statement-breakpoint
CREATE INDEX "launches_year_week_tier_status_idx" ON "launches" ("iso_year","iso_week","tier","status");--> statement-breakpoint
CREATE INDEX "launches_tool_id_idx" ON "launches" ("tool_id");--> statement-breakpoint
CREATE INDEX "launches_product_id_idx" ON "launches" ("product_id");--> statement-breakpoint
CREATE INDEX "launches_submitter_id_idx" ON "launches" ("submitter_id");--> statement-breakpoint
CREATE INDEX "products_status_launch_week_idx" ON "products" ("status","launch_year","launch_week");--> statement-breakpoint
CREATE INDEX "tools_status_launch_week_idx" ON "tools" ("status","launch_year","launch_week");--> statement-breakpoint
ALTER TABLE "launches" ADD CONSTRAINT "launches_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "launches" ADD CONSTRAINT "launches_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "launches" ADD CONSTRAINT "launches_submitter_id_users_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE CASCADE;