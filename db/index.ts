import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle({ client: sql })

sql`ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "issuer" text NOT NULL DEFAULT '';`.catch(
  () => {}
)
sql`CREATE UNIQUE INDEX IF NOT EXISTS "accounts_issuer_accountId_uidx" ON "accounts" ("issuer", "account_id");`.catch(
  () => {}
)
sql`CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "accounts" ("user_id");`.catch(
  () => {}
)

export { schema }
