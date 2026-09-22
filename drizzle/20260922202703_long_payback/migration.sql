CREATE TABLE "external_link_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"item_type" "launch_item_type" NOT NULL,
	"tool_id" uuid,
	"product_id" uuid,
	"user_id" text,
	"target_url" text NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "external_link_visits_tool_id_idx" ON "external_link_visits" ("tool_id");--> statement-breakpoint
CREATE INDEX "external_link_visits_product_id_idx" ON "external_link_visits" ("product_id");--> statement-breakpoint
CREATE INDEX "external_link_visits_user_id_idx" ON "external_link_visits" ("user_id");--> statement-breakpoint
CREATE INDEX "external_link_visits_created_at_idx" ON "external_link_visits" ("created_at");--> statement-breakpoint
ALTER TABLE "external_link_visits" ADD CONSTRAINT "external_link_visits_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "external_link_visits" ADD CONSTRAINT "external_link_visits_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "external_link_visits" ADD CONSTRAINT "external_link_visits_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;