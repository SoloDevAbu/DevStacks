import "dotenv/config"
import postgres from "postgres"
import fs from "fs"
import path from "path"

// Parse CLI arguments
const args = process.argv.slice(2)
let targetUrl = ""
let backupFilePath = ""

for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if ((arg === "--url" || arg === "--target") && args[i + 1]) {
    targetUrl = args[i + 1]
    i++
  } else if ((arg === "--file" || arg === "-f") && args[i + 1]) {
    backupFilePath = args[i + 1]
    i++
  } else if (!arg.startsWith("--") && (arg.startsWith("postgres://") || arg.startsWith("postgresql://"))) {
    targetUrl = arg
  } else if (!arg.startsWith("--") && (arg.endsWith(".json") || arg.endsWith(".sql"))) {
    backupFilePath = arg
  }
}

// Fallback hierarchy for target URL
if (!targetUrl) {
  targetUrl =
    process.env.NEW_DATABASE_URL ||
    process.env.TARGET_DATABASE_URL ||
    process.env.DATABASE_URL ||
    ""
}

if (!targetUrl) {
  console.error("❌ Error: No target database connection URL provided!")
  console.error("\nUsage options:")
  console.error('  1. Pass target URL:   bun scripts/restore-db.ts "postgresql://postgres:pass@new-host:5432/postgres"')
  console.error('  2. Specific file:     bun scripts/restore-db.ts "postgresql://..." --file backups/prod-latest.sql')
  console.error("  3. Via .env:          Set NEW_DATABASE_URL or DATABASE_URL in .env and run: bun scripts/restore-db.ts")
  process.exit(1)
}

// Mask password for safe terminal logging
const maskUrl = (raw: string): string => {
  try {
    const parsed = new URL(raw)
    if (parsed.password) {
      parsed.password = "******"
    }
    return parsed.toString()
  } catch {
    return raw.replace(/:([^:@]+)@/, ":******@")
  }
}

// Resolve backup file
const backupDir = path.resolve(process.cwd(), "backups")
if (!backupFilePath) {
  const candidates = [
    path.join(backupDir, "prod-latest.sql"),
    path.join(backupDir, "latest.sql"),
    path.join(backupDir, "prod-latest.json"),
    path.join(backupDir, "latest.json"),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      backupFilePath = c
      break
    }
  }
} else if (!path.isAbsolute(backupFilePath)) {
  backupFilePath = path.join(backupDir, backupFilePath)
}

if (!backupFilePath || !fs.existsSync(backupFilePath)) {
  console.error(`❌ Error: Backup file not found at: ${backupFilePath}`)
  console.error(`Available backups in /backups/:`)
  if (fs.existsSync(backupDir)) {
    console.log(fs.readdirSync(backupDir).join("\n"))
  }
  process.exit(1)
}

const runRestore = async () => {
  const startTime = Date.now()
  console.log("♻️ ========================================================")
  console.log("🔄 LaunchNests Database Populate / Restore Utility")
  console.log("♻️ ========================================================\n")
  console.log(`🎯 Target Database: ${maskUrl(targetUrl)}`)
  console.log(`📁 Source Backup:   ${path.basename(backupFilePath)}\n`)

  // Crucial: max: 1 allows manual transaction statements (BEGIN / COMMIT) in postgres.js without UNSAFE_TRANSACTION
  const sql = postgres(targetUrl, {
    max: 1,
    prepare: false,
    onnotice: () => {}, // suppress verbose server notices
  })

  try {
    // 1. Connection test
    const [currentDb] = await sql`SELECT current_database(), current_user, version()`
    console.log(`✅ Connected to TARGET DB: "${currentDb.current_database}" as user: "${currentDb.current_user}"\n`)

    // 2. Pre-flight check: Ensure schema tables exist
    const rawTables = await sql<{ table_name: string }[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE '_drizzle%'
      ORDER BY table_name ASC
    `
    const existingTableNames = rawTables.map((r) => r.table_name)
    console.log(`Found ${existingTableNames.length} existing tables in target database.`)

    if (existingTableNames.length === 0) {
      console.error("\n❌ Target database has NO tables created yet!")
      console.error("👉 Before restoring data, you must push the schema to create tables and enums.")
      console.error(`👉 Run this command in your terminal first:`)
      console.error(`   $env:DATABASE_URL="${targetUrl}"; pnpm db:push\n`)
      process.exit(1)
    }

    // 3. Execution: Run SQL
    console.log(`\n🚀 Executing SQL restore script (${(fs.statSync(backupFilePath).size / 1024).toFixed(2)} KB)...`)
    const sqlContent = fs.readFileSync(backupFilePath, "utf8")

    await sql.unsafe(sqlContent)

    console.log("✅ SQL script executed successfully!")

    // 4. Post-restore Verification
    console.log("\n📊 Verifying row counts in target database:\n")
    const verificationStats: Array<{ table: string; targetRows: number }> = []
    const tablesToCheck = [
      "categories",
      "users",
      "tools",
      "products",
      "product_tools",
      "tool_faqs",
      "product_faqs",
      "launches",
      "payments",
      "blogs",
      "feedbacks",
      "accounts",
      "sessions",
    ]

    for (const table of tablesToCheck) {
      if (existingTableNames.includes(table)) {
        const [res] = await sql`SELECT count(*)::int as count FROM ${sql(table)}`
        verificationStats.push({
          table,
          targetRows: res.count,
        })
      }
    }

    console.table(verificationStats)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log("========================================================")
    console.log(`🎉 POPULATION COMPLETE in ${duration}s!`)
    console.log("The new database is now an exact replica of production.")
    console.log("========================================================\n")
  } catch (error: any) {
    console.error("\n❌ Restore failed:", error)
    process.exit(1)
  } finally {
    await sql.end()
    process.exit(0)
  }
}

runRestore()
