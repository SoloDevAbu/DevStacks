import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL!

// Supabase Connection Pooling requires prepare: false when using transaction pooler (port 6543)
// and works seamlessly across both direct and pooled connections.
const client = postgres(connectionString, { prepare: false })

export const db = drizzle({ client })

export { schema }
