import ws from "ws"
import { Pool, neonConfig, neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!)

neonConfig.webSocketConstructor = ws

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

export const db = drizzle({
  client: pool,
})

sql`ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "issuer" text NOT NULL DEFAULT 'google';`.catch(
  () => {}
)
sql`ALTER TABLE "accounts" ALTER COLUMN "issuer" SET DEFAULT 'google';`.catch(
  () => {}
)
sql`CREATE UNIQUE INDEX IF NOT EXISTS "accounts_providerId_accountId_uidx" ON "accounts" ("provider_id", "account_id");`.catch(
  () => {}
)
sql`CREATE UNIQUE INDEX IF NOT EXISTS "accounts_issuer_accountId_uidx" ON "accounts" ("issuer", "account_id");`.catch(
  () => {}
)
sql`CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "accounts" ("user_id");`.catch(
  () => {}
)

export { schema }
