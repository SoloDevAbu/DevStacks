CREATE TYPE "feedback_type" AS ENUM('bug', 'improvement', 'feature', 'other');--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text,
	"type" "feedback_type" DEFAULT 'improvement'::"feedback_type" NOT NULL,
	"title" text,
	"message" text NOT NULL,
	"email" text,
	"page_url" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "feedbacks_user_id_idx" ON "feedbacks" ("user_id");--> statement-breakpoint
CREATE INDEX "feedbacks_type_idx" ON "feedbacks" ("type");--> statement-breakpoint
CREATE INDEX "feedbacks_created_at_idx" ON "feedbacks" ("created_at");--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;