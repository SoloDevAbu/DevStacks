CREATE TYPE "blog_generation_status" AS ENUM('pending', 'generating', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "blog_status" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image_url" text,
	"verdict_rating" numeric(2,1),
	"verdict_summary" text,
	"pros" text[] DEFAULT '{}'::text[] NOT NULL,
	"cons" text[] DEFAULT '{}'::text[] NOT NULL,
	"faqs" jsonb DEFAULT '[]',
	"reading_time_minutes" integer DEFAULT 5 NOT NULL,
	"item_type" "launch_item_type" NOT NULL,
	"product_id" uuid,
	"tool_id" uuid,
	"submitter_id" text,
	"status" "blog_status" DEFAULT 'scheduled'::"blog_status" NOT NULL,
	"generation_status" "blog_generation_status" DEFAULT 'pending'::"blog_generation_status" NOT NULL,
	"generation_error" text,
	"is_ai_generated" boolean DEFAULT true NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "blogs_slug_idx" ON "blogs" ("slug");--> statement-breakpoint
CREATE INDEX "blogs_status_published_at_idx" ON "blogs" ("status","published_at");--> statement-breakpoint
CREATE INDEX "blogs_product_id_idx" ON "blogs" ("product_id");--> statement-breakpoint
CREATE INDEX "blogs_tool_id_idx" ON "blogs" ("tool_id");--> statement-breakpoint
CREATE INDEX "blogs_submitter_id_idx" ON "blogs" ("submitter_id");--> statement-breakpoint
CREATE INDEX "blogs_generation_status_idx" ON "blogs" ("generation_status");--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_submitter_id_users_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE SET NULL;