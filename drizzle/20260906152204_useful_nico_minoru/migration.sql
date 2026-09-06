CREATE TYPE "status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "product_bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tool_bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"tool_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tool_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"tool_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tool_upvotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"tool_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
	"submitter_id" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"description" text NOT NULL,
	"problem_statement" text,
	"solution" text,
	"unique_value" text,
	"website_url" text NOT NULL,
	"logo_url" text,
	"github_url" text,
	"twitter_url" text,
	"linkedin_url" text,
	"discord_url" text,
	"keywords" text,
	"target_audience" text,
	"meta_title" text,
	"meta_description" text,
	"ai_context" text,
	"geo_target" text,
	"aso_category" text,
	"category" text,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"platforms" text[] DEFAULT '{}'::text[] NOT NULL,
	"pricing" "pricing" DEFAULT 'Free'::"pricing" NOT NULL,
	"tier" "tier" DEFAULT 'free'::"tier" NOT NULL,
	"status" "status" DEFAULT 'pending'::"status" NOT NULL,
	"upvotes_count" integer DEFAULT 0 NOT NULL,
	"builds_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "build_products" DROP CONSTRAINT "build_products_build_id_builds_id_fkey";--> statement-breakpoint
DROP TABLE "bookmarks";--> statement-breakpoint
DROP TABLE "build_products";--> statement-breakpoint
DROP TABLE "builds";--> statement-breakpoint
DROP TABLE "comments";--> statement-breakpoint
DROP TABLE "upvotes";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "built_with_tools" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "likes_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "upvotes_count";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "builds_count";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE "status" USING "status"::text::"status";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'pending'::"status";--> statement-breakpoint
CREATE UNIQUE INDEX "product_bookmarks_product_user_idx" ON "product_bookmarks" ("product_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_likes_product_user_idx" ON "product_likes" ("product_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tool_bookmarks_tool_user_idx" ON "tool_bookmarks" ("tool_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tool_upvotes_tool_user_idx" ON "tool_upvotes" ("tool_id","user_id");--> statement-breakpoint
ALTER TABLE "product_bookmarks" ADD CONSTRAINT "product_bookmarks_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_bookmarks" ADD CONSTRAINT "product_bookmarks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tool_bookmarks" ADD CONSTRAINT "tool_bookmarks_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tool_bookmarks" ADD CONSTRAINT "tool_bookmarks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tool_comments" ADD CONSTRAINT "tool_comments_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tool_comments" ADD CONSTRAINT "tool_comments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tool_upvotes" ADD CONSTRAINT "tool_upvotes_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tool_upvotes" ADD CONSTRAINT "tool_upvotes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_submitter_id_users_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
DROP TYPE "product_status";