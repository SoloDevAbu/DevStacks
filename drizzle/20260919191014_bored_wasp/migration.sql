CREATE TYPE "ad_placement" AS ENUM('sidebar', 'feed');--> statement-breakpoint
CREATE TYPE "ad_status" AS ENUM('pending_payment', 'active', 'paused', 'expired', 'rejected');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "payment_type" AS ENUM('listing', 'ad');--> statement-breakpoint
CREATE TABLE "ad_weeks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"ad_id" uuid NOT NULL,
	"placement" "ad_placement" NOT NULL,
	"iso_year" integer NOT NULL,
	"iso_week" integer NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"status" "ad_status" DEFAULT 'pending_payment'::"ad_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"tool_id" uuid,
	"product_id" uuid,
	"placement" "ad_placement" DEFAULT 'sidebar'::"ad_placement" NOT NULL,
	"cta_text" text DEFAULT 'Learn More' NOT NULL,
	"status" "ad_status" DEFAULT 'pending_payment'::"ad_status" NOT NULL,
	"total_weeks" integer DEFAULT 1 NOT NULL,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"tier_bonus_applied" "tier",
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"clicks_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"payment_type" "payment_type" NOT NULL,
	"tier" "tier",
	"ad_id" uuid,
	"tool_id" uuid,
	"product_id" uuid,
	"dodo_payment_id" text UNIQUE,
	"dodo_checkout_session_id" text,
	"dodo_customer_id" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "payment_status" DEFAULT 'pending'::"payment_status" NOT NULL,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'pending'::"status";--> statement-breakpoint
ALTER TABLE "tools" ALTER COLUMN "status" SET DEFAULT 'pending'::"status";--> statement-breakpoint
CREATE INDEX "ad_weeks_ad_id_idx" ON "ad_weeks" ("ad_id");--> statement-breakpoint
CREATE INDEX "ad_weeks_placement_week_idx" ON "ad_weeks" ("placement","iso_year","iso_week");--> statement-breakpoint
CREATE UNIQUE INDEX "ad_weeks_ad_year_week_idx" ON "ad_weeks" ("ad_id","iso_year","iso_week");--> statement-breakpoint
CREATE INDEX "ads_placement_status_idx" ON "ads" ("placement","status");--> statement-breakpoint
CREATE INDEX "ads_userId_idx" ON "ads" ("user_id");--> statement-breakpoint
CREATE INDEX "ads_toolId_idx" ON "ads" ("tool_id");--> statement-breakpoint
CREATE INDEX "ads_productId_idx" ON "ads" ("product_id");--> statement-breakpoint
CREATE INDEX "payments_userId_idx" ON "payments" ("user_id");--> statement-breakpoint
CREATE INDEX "payments_dodoPaymentId_idx" ON "payments" ("dodo_payment_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" ("status");--> statement-breakpoint
CREATE INDEX "payments_paymentType_idx" ON "payments" ("payment_type");--> statement-breakpoint
ALTER TABLE "ad_weeks" ADD CONSTRAINT "ad_weeks_ad_id_ads_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_ad_id_ads_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL;