ALTER TABLE "products" ADD COLUMN "app_store_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "play_store_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "chrome_extension_url" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "app_store_url" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "play_store_url" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "chrome_extension_url" text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "issuer" SET DEFAULT 'google';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'approved'::"status";--> statement-breakpoint
ALTER TABLE "tools" ALTER COLUMN "status" SET DEFAULT 'approved'::"status";--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_providerId_accountId_uidx" ON "accounts" ("provider_id","account_id");