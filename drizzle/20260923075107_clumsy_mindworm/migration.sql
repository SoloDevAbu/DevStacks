ALTER TABLE "launches" ALTER COLUMN "submitter_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "submitter_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tools" ALTER COLUMN "submitter_id" DROP NOT NULL;