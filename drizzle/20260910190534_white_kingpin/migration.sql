CREATE TYPE "platform" AS ENUM('Web', 'iOS', 'Android', 'macOS', 'Windows', 'Linux', 'CLI', 'API', 'Extension', 'Plugin', 'Cloud', 'Self-Hosted');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"slug" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_tools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"tool_id" uuid,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "built_with_tools";--> statement-breakpoint
ALTER TABLE "tools" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "platforms" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "platforms" SET DATA TYPE "platform"[] USING "platforms"::"platform"[];--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "platforms" SET DEFAULT '{}'::"platform"[];--> statement-breakpoint
ALTER TABLE "tools" ALTER COLUMN "platforms" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tools" ALTER COLUMN "platforms" SET DATA TYPE "platform"[] USING "platforms"::"platform"[];--> statement-breakpoint
ALTER TABLE "tools" ALTER COLUMN "platforms" SET DEFAULT '{}'::"platform"[];--> statement-breakpoint
CREATE INDEX "product_comments_product_id_idx" ON "product_comments" ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_tools_product_name_idx" ON "product_tools" ("product_id","name");--> statement-breakpoint
CREATE INDEX "product_tools_tool_id_idx" ON "product_tools" ("tool_id");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" ("status");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" ("category_id");--> statement-breakpoint
CREATE INDEX "products_pricing_idx" ON "products" ("pricing");--> statement-breakpoint
CREATE INDEX "products_submitter_id_idx" ON "products" ("submitter_id");--> statement-breakpoint
CREATE INDEX "products_status_likes_idx" ON "products" ("status","likes_count");--> statement-breakpoint
CREATE INDEX "products_status_created_at_idx" ON "products" ("status","created_at");--> statement-breakpoint
CREATE INDEX "products_tags_idx" ON "products" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "products_platforms_idx" ON "products" USING gin ("platforms");--> statement-breakpoint
CREATE INDEX "tool_comments_tool_id_idx" ON "tool_comments" ("tool_id");--> statement-breakpoint
CREATE INDEX "tools_status_idx" ON "tools" ("status");--> statement-breakpoint
CREATE INDEX "tools_category_id_idx" ON "tools" ("category_id");--> statement-breakpoint
CREATE INDEX "tools_pricing_idx" ON "tools" ("pricing");--> statement-breakpoint
CREATE INDEX "tools_submitter_id_idx" ON "tools" ("submitter_id");--> statement-breakpoint
CREATE INDEX "tools_status_upvotes_idx" ON "tools" ("status","upvotes_count");--> statement-breakpoint
CREATE INDEX "tools_status_created_at_idx" ON "tools" ("status","created_at");--> statement-breakpoint
CREATE INDEX "tools_tags_idx" ON "tools" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "tools_platforms_idx" ON "tools" USING gin ("platforms");--> statement-breakpoint
ALTER TABLE "product_tools" ADD CONSTRAINT "product_tools_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_tools" ADD CONSTRAINT "product_tools_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");