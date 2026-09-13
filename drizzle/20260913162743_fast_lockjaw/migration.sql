CREATE TABLE "maker_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tool_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"tool_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "images" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "demo_video_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "use_cases" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "images" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "demo_video_url" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "use_cases" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "website_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "twitter_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_key" UNIQUE("username");--> statement-breakpoint
CREATE INDEX "maker_faqs_user_id_idx" ON "maker_faqs" ("user_id");--> statement-breakpoint
CREATE INDEX "maker_faqs_user_sort_idx" ON "maker_faqs" ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX "product_faqs_product_id_idx" ON "product_faqs" ("product_id");--> statement-breakpoint
CREATE INDEX "product_faqs_product_sort_idx" ON "product_faqs" ("product_id","sort_order");--> statement-breakpoint
CREATE INDEX "tool_faqs_tool_id_idx" ON "tool_faqs" ("tool_id");--> statement-breakpoint
CREATE INDEX "tool_faqs_tool_sort_idx" ON "tool_faqs" ("tool_id","sort_order");--> statement-breakpoint
CREATE INDEX "users_country_idx" ON "users" ("country");--> statement-breakpoint
ALTER TABLE "maker_faqs" ADD CONSTRAINT "maker_faqs_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_faqs" ADD CONSTRAINT "product_faqs_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tool_faqs" ADD CONSTRAINT "tool_faqs_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;