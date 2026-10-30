CREATE TABLE "url_ai_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"normalized_url" text NOT NULL UNIQUE,
	"extracted_data" jsonb NOT NULL,
	"user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "url_ai_cache_normalized_url_idx" ON "url_ai_cache" ("normalized_url");--> statement-breakpoint
CREATE INDEX "url_ai_cache_created_at_idx" ON "url_ai_cache" ("created_at");--> statement-breakpoint
ALTER TABLE "url_ai_cache" ADD CONSTRAINT "url_ai_cache_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;