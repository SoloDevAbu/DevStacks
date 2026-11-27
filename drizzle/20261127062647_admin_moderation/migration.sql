CREATE TABLE "admin_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"admin_id" text NOT NULL,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"item_type" "launch_item_type" NOT NULL,
	"tool_id" uuid,
	"product_id" uuid,
	"submitter_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"base_updated_at" timestamp with time zone NOT NULL,
	"status" "status" DEFAULT 'pending'::"status" NOT NULL,
	"review_note" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "listing_revisions_one_item_chk" CHECK (num_nonnulls("tool_id", "product_id") = 1)
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "reviewed_by" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "reviewed_by" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "admin_audit_log_created_at_idx" ON "admin_audit_log" ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "admin_audit_log_admin_id_idx" ON "admin_audit_log" ("admin_id");--> statement-breakpoint
CREATE INDEX "admin_audit_log_target_idx" ON "admin_audit_log" ("target_type","target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "listing_revisions_pending_tool_uidx" ON "listing_revisions" ("tool_id") WHERE "status" = 'pending';--> statement-breakpoint
CREATE UNIQUE INDEX "listing_revisions_pending_product_uidx" ON "listing_revisions" ("product_id") WHERE "status" = 'pending';--> statement-breakpoint
CREATE INDEX "listing_revisions_status_created_at_idx" ON "listing_revisions" ("status","created_at");--> statement-breakpoint
CREATE INDEX "listing_revisions_submitter_id_idx" ON "listing_revisions" ("submitter_id");--> statement-breakpoint
CREATE INDEX "listing_revisions_reviewed_by_idx" ON "listing_revisions" ("reviewed_by");--> statement-breakpoint
ALTER TABLE "admin_audit_log" ADD CONSTRAINT "admin_audit_log_admin_id_users_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "listing_revisions" ADD CONSTRAINT "listing_revisions_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "listing_revisions" ADD CONSTRAINT "listing_revisions_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "listing_revisions" ADD CONSTRAINT "listing_revisions_submitter_id_users_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "listing_revisions" ADD CONSTRAINT "listing_revisions_reviewed_by_users_id_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_reviewed_by_users_id_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_reviewed_by_users_id_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL;