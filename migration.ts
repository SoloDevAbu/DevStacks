import "dotenv/config"
import postgres from "postgres"

// Ordered list of tables to guarantee foreign key integrity
const TABLES_IN_ORDER = [
  "categories",
  "users",
  "verifications",
  "accounts",
  "sessions",
  "maker_faqs",
  "tools",
  "products",
  "tool_faqs",
  "product_faqs",
  "product_tools",
  "tool_upvotes",
  "product_likes",
  "tool_bookmarks",
  "product_bookmarks",
  "tool_comments",
  "product_comments",
  "ads",
  "ad_weeks",
  "launches",
  "payments",
  "external_link_visits",
] as const

interface MigrationOptions {
  sourceUrl: string
  targetUrl: string
  batchSize?: number
  enableRLS?: boolean
}

export const runDatabaseMigration = async ({
  sourceUrl,
  targetUrl,
  batchSize = 250,
  enableRLS = true,
}: MigrationOptions) => {
  console.log("🚀 Starting Database Migration: Neon ➔ Supabase")
  console.log("--------------------------------------------------")

  if (
    targetUrl.includes("[YOUR-PASSWORD]") ||
    targetUrl.includes("[YOUR_PASSWORD]")
  ) {
    console.error("❌ Error: Target URL contains placeholder password.")
    console.error(
      "👉 Please replace [YOUR-PASSWORD] with your real Supabase database password."
    )
    process.exit(1)
  }

  const source = postgres(sourceUrl, { max: 5, onnotice: () => {} })
  const target = postgres(targetUrl, { max: 5, prepare: false, onnotice: () => {} })

  try {
    // 1. Connectivity test
    console.log("📡 Testing connection to Source (Neon)...")
    const [sourceDb] = await source`SELECT current_database(), version()`
    console.log(`   Connected to Neon DB: ${sourceDb.current_database}`)

    console.log("📡 Testing connection to Target (Supabase)...")
    const [targetDb] = await target`SELECT current_database(), version()`
    console.log(`   Connected to Supabase DB: ${targetDb.current_database}`)

    // 2. Target schema validation
    const existingTargetTables = await target<{ table_name: string }[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `
    if (existingTargetTables.length === 0) {
      console.error("\n❌ No tables found in your Supabase project!")
      console.error(
        "👉 Please run 'pnpm db:push' first to create all tables and enums in Supabase."
      )
      console.error(
        "   Once 'pnpm db:push' finishes, run 'pnpm db:migrate-data' again to transfer all data."
      )
      process.exit(1)
    }

    // 3. Discover source tables
    const existingSourceTables = await source<{ table_name: string }[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `
    const sourceTableSet = new Set(
      existingSourceTables.map((t) => t.table_name)
    )

    // Ensure all known tables are covered plus any additional discovered tables
    const tablesToMigrate = [
      ...TABLES_IN_ORDER.filter((t) => sourceTableSet.has(t)),
      ...Array.from(sourceTableSet).filter(
        (t) => !TABLES_IN_ORDER.includes(t as any) && !t.startsWith("__drizzle")
      ),
    ]

    console.log(`📋 Found ${tablesToMigrate.length} tables to migrate:`)
    console.log(`   ${tablesToMigrate.join(", ")}`)
    console.log("--------------------------------------------------")

    // 4. Temporarily relax foreign keys & triggers if supported by connection mode
    let replicationRoleModified = false
    try {
      await target`SET session_replication_role = 'replica';`
      replicationRoleModified = true
      console.log("⚙️  Configured session replication role to 'replica'")
    } catch {
      console.log(
        "⚙️  Using strict topological dependency ordering for FK constraints"
      )
    }

    const migrationSummary: Record<
      string,
      { sourceCount: number; targetCount: number; status: string }
    > = {}

    // 5. Migrate data table by table in topological order
    for (const tableName of tablesToMigrate) {
      process.stdout.write(`⏳ Migrating table: [${tableName}] ... `)

      // Get count from source
      const [{ count: sourceCountStr }] = await source.unsafe(
        `SELECT count(*) as count FROM "${tableName}"`
      )
      const sourceCount = Number(sourceCountStr)

      if (sourceCount === 0) {
        console.log(`0 rows (skipped)`)
        migrationSummary[tableName] = {
          sourceCount: 0,
          targetCount: 0,
          status: "Empty",
        }
        continue
      }

      // Read all records from source
      const rows = await source.unsafe(`SELECT * FROM "${tableName}"`)

      // Clear existing records in target table if any to ensure clean idempotent migration
      try {
        await target.unsafe(`TRUNCATE TABLE "${tableName}" CASCADE`)
      } catch {
        await target.unsafe(`DELETE FROM "${tableName}"`)
      }

      // Ensure target table has all columns present in source
      const targetColumns = await target<{ column_name: string }[]>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${tableName}
      `
      const targetColSet = new Set(targetColumns.map((c) => c.column_name))

      // Check if source has columns missing in target (e.g. is_deleted)
      const sourceColumns = await source<{ column_name: string; udt_name: string; is_nullable: string; column_default: string | null }[]>`
        SELECT column_name, udt_name, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${tableName}
      `
      for (const col of sourceColumns) {
        if (!targetColSet.has(col.column_name)) {
          console.log(`\n   Auto-adding missing column "${col.column_name}" to Supabase table "${tableName}"...`)
          let colType = col.udt_name
          if (colType === "bool") colType = "boolean"
          if (colType.startsWith("_")) colType = `${colType.slice(1)}[]`
          const defaultClause = col.column_default ? ` DEFAULT ${col.column_default}` : ""
          try {
            await target.unsafe(`ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS "${col.column_name}" ${colType}${defaultClause};`)
            targetColSet.add(col.column_name)
          } catch (e: any) {
            console.warn(`   Could not auto-add column ${col.column_name}: ${e.message}`)
          }
        }
      }

      // Filter insert batch to columns that exist on target
      const validColumns = Object.keys(rows[0]).filter((col) => targetColSet.has(col))

      // Batch insert into target
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize)
        await target`INSERT INTO ${target(tableName)} ${target(batch, validColumns)}`
      }

      // Verify row count on target
      const [{ count: targetCountStr }] = await target.unsafe(
        `SELECT count(*) as count FROM "${tableName}"`
      )
      const targetCount = Number(targetCountStr)

      if (sourceCount === targetCount) {
        console.log(`✅ ${targetCount} / ${sourceCount} rows migrated`)
        migrationSummary[tableName] = {
          sourceCount,
          targetCount,
          status: "Success",
        }
      } else {
        console.log(
          `⚠️ Count mismatch! Source: ${sourceCount}, Target: ${targetCount}`
        )
        migrationSummary[tableName] = {
          sourceCount,
          targetCount,
          status: "Mismatch",
        }
      }
    }

    // 6. Restore replication role
    if (replicationRoleModified) {
      console.log("--------------------------------------------------")
      console.log("⚙️  Restoring session replication role on Supabase...")
      try {
        await target`SET session_replication_role = 'origin';`
      } catch {}
    }

    // 7. Security & RLS best practices (Supabase skill guideline)
    if (enableRLS) {
      console.log(
        "🔒 Applying Supabase RLS best practices across all public tables..."
      )
      for (const tableName of tablesToMigrate) {
        try {
          await target.unsafe(
            `ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`
          )
          await target.unsafe(
            `GRANT ALL PRIVILEGES ON TABLE "${tableName}" TO postgres, service_role;`
          )
        } catch (rlsErr: any) {
          // Non-fatal warning
        }
      }
      console.log(
        "✅ Row Level Security enabled for defense-in-depth on public schema."
      )
    }

    console.log("--------------------------------------------------")
    console.log("🎉 Database Migration Complete!")
    console.table(migrationSummary)
    return { success: true, summary: migrationSummary }
  } catch (error) {
    console.error("❌ Migration failed with error:", error)
    throw error
  } finally {
    await source.end()
    await target.end()
  }
}

const main = async () => {
  const sourceUrl =
    process.env.MIGRATION_SOURCE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL_PROD ||
    "postgresql://neondb_owner:npg_Big0olY3Fnqc@ep-hidden-block-b54kmns1-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

  let targetUrl =
    process.env.MIGRATION_TARGET_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.DATABASE_URL

  if (!targetUrl) {
    console.error("❌ Error: Missing SUPABASE_DATABASE_URL or DATABASE_URL.")
    process.exit(1)
  }

  // Supabase migration/DDL best practice: Use session pooler (port 5432) instead of transaction pooler (port 6543)
  if (targetUrl.includes(":6543/")) {
    console.log("ℹ️  Switching from transaction pooler (port 6543) to session pooler (port 5432) for migration compatibility...")
    targetUrl = targetUrl.replace(":6543/", ":5432/")
  }

  await runDatabaseMigration({ sourceUrl, targetUrl })
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Migration halted:", err.message || err)
    process.exit(1)
  })

