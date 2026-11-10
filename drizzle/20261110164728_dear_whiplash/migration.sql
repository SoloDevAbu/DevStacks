CREATE TABLE "directory_link_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"directory_slug" text NOT NULL,
	"outcome" text NOT NULL,
	"rel" text,
	"link_path" text,
	"http_status" integer,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "directory_link_checks_slug_checked_at_idx" ON "directory_link_checks" ("directory_slug","checked_at");