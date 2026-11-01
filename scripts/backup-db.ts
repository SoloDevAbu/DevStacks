import "dotenv/config"
import postgres from "postgres"
import fs from "fs"
import path from "path"

// Parse CLI arguments
const args = process.argv.slice(2)

// Find connection URL from args or environment
let connectionUrl = ""
let isProd = false
let customLabel = ""

for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg === "--url" && args[i + 1]) {
    connectionUrl = args[i + 1]
    i++
  } else if (arg === "--prod") {
    isProd = true
  } else if (arg === "--label" && args[i + 1]) {
    customLabel = args[i + 1]
    i++
  } else if (!arg.startsWith("--") && (arg.startsWith("postgres://") || arg.startsWith("postgresql://"))) {
    connectionUrl = arg
  }
}

// Fallback hierarchy: CLI arg -> PROD_DATABASE_URL (if --prod) -> PROD_DATABASE_URL -> DATABASE_URL
if (!connectionUrl) {
  if (isProd && process.env.PROD_DATABASE_URL) {
    connectionUrl = process.env.PROD_DATABASE_URL
  } else if (process.env.PROD_DATABASE_URL) {
    connectionUrl = process.env.PROD_DATABASE_URL
    isProd = true
  } else {
    connectionUrl = process.env.DATABASE_URL || ""
  }
}

if (!connectionUrl) {
  console.error("❌ Error: No database connection URL provided!")
  console.error("\nUsage options:")
  console.error('  1. Pass URL directly:  bun scripts/backup-db.ts "postgresql://postgres:pass@host:5432/postgres"')
  console.error('  2. Pass with --prod:   bun scripts/backup-db.ts --prod (reads PROD_DATABASE_URL from .env)')
  console.error("  3. Default (.env):     bun scripts/backup-db.ts (reads DATABASE_URL from .env)")
  process.exit(1)
}

// Detect label
if (!customLabel) {
  if (isProd || connectionUrl.includes("supabase") || connectionUrl.includes("prod")) {
    customLabel = "prod"
  } else {
    customLabel = "dev"
  }
}

// Mask password for safe logging
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

const sql = postgres(connectionUrl, { prepare: false })

// Exact 25 tables in topological dependency order to respect foreign keys
export const EXACT_25_TABLES_ORDER = [
  // Level 0: Foundation tables (no foreign keys)
  "categories",
  "users",
  "verifications",

  // Level 1: Depends only on Level 0
  "accounts",
  "sessions",
  "maker_faqs",
  "tools",
  "products",
  "ads",
  "feedbacks",
  "url_ai_cache",

  // Level 2: Depends on tools, products, ads, users
  "tool_faqs",
  "product_faqs",
  "product_tools",
  "tool_upvotes",
  "product_likes",
  "tool_bookmarks",
  "product_bookmarks",
  "tool_comments",
  "product_comments",
  "ad_weeks",
  "launches",
  "payments",
  "external_link_visits",
  "blogs",
] as const

export const formatSqlValue = (val: unknown, colName?: string): string => {
  if (val === null || val === undefined) return "NULL"
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE"
  if (typeof val === "number") return String(val)
  if (val instanceof Date) return `'${val.toISOString()}'`
  if (Array.isArray(val)) {
    const isPlatform = colName === "platforms"
    const typeCast = isPlatform ? "::platform[]" : "::text[]"
    if (val.length === 0) return `ARRAY[]${typeCast}`
    const escaped = val.map((item) => {
      if (item === null || item === undefined) return "NULL"
      const str = String(item).replace(/'/g, "''")
      return `'${str}'`
    })
    return `ARRAY[${escaped.join(", ")}]${typeCast}`
  }
  if (typeof val === "object") {
    const str = JSON.stringify(val).replace(/'/g, "''")
    return `'${str}'::jsonb`
  }
  const str = String(val).replace(/'/g, "''")
  return `'${str}'`
}

export const generateSqlRestore = (
  tablesData: Record<string, any[]>,
  orderedTables: string[],
  environmentName = "PROD"
): string => {
  const lines: string[] = [
    `-- =========================================================================`,
    `-- LaunchNests (BuyMyNextLaunch) Full Database Restore Script (25 Tables)`,
    `-- Environment: ${environmentName.toUpperCase()}`,
    `-- Generated: ${new Date().toISOString()}`,
    `-- =========================================================================`,
    ``,
    `BEGIN;`,
    `-- Disable foreign key checks and triggers for clean restoration`,
    `SET session_replication_role = 'replica';`,
    ``,
  ]

  for (const table of orderedTables) {
    const rows = tablesData[table] || []
    lines.push(`-- -------------------------------------------------------------`)
    lines.push(`-- Table: "${table}" (${rows.length} rows)`)
    lines.push(`-- -------------------------------------------------------------`)
    lines.push(`TRUNCATE TABLE "${table}" CASCADE;`)

    if (rows.length > 0) {
      const columns = Object.keys(rows[0])
      const colList = columns.map((c) => `"${c}"`).join(", ")

      for (const row of rows) {
        const values = columns.map((col) => formatSqlValue(row[col], col)).join(", ")
        lines.push(`INSERT INTO "${table}" (${colList}) VALUES (${values}) ON CONFLICT DO NOTHING;`)
      }
    }
    lines.push(``)
  }

  lines.push(`-- Re-enable foreign key checks and triggers`)
  lines.push(`SET session_replication_role = 'origin';`)
  lines.push(`COMMIT;`)
  lines.push(``)

  return lines.join("\n")
}

const runBackup = async () => {
  const startTime = Date.now()
  console.log("🔒 ========================================================")
  console.log(`📦 LaunchNests Database Backup [${customLabel.toUpperCase()} Snapshot]`)
  console.log("🔒 ========================================================\n")
  console.log(`📡 Connecting to: ${maskUrl(connectionUrl)}\n`)

  try {
    const [currentDb] = await sql`SELECT current_database(), current_user, version()`
    console.log(`✅ Connected to database: "${currentDb.current_database}" as user: "${currentDb.current_user}"\n`)

    const rawTables = await sql<{ table_name: string }[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE '_drizzle%'
      ORDER BY table_name ASC
    `
    const dbTableNames = new Set(rawTables.map((r) => r.table_name))
    console.log(`Database reports ${dbTableNames.size} total tables in public schema.\n`)

    const tablesData: Record<string, any[]> = {}
    const stats: Array<{ index: number; table: string; rows: number; status: string }> = []
    let totalRowCount = 0

    console.log("📥 Exporting tables in topological dependency order:\n")
    let idx = 1
    for (const table of EXACT_25_TABLES_ORDER) {
      if (!dbTableNames.has(table)) {
        stats.push({
          index: idx++,
          table,
          rows: 0,
          status: "⚠️ Table not found in DB",
        })
        tablesData[table] = []
        continue
      }

      try {
        const rows = await sql`SELECT * FROM ${sql(table)}`
        tablesData[table] = rows
        totalRowCount += rows.length
        stats.push({
          index: idx++,
          table,
          rows: rows.length,
          status: rows.length > 0 ? "✅ Exported" : "⚪ 0 rows",
        })
      } catch (err: any) {
        console.error(`❌ Error reading table "${table}":`, err.message)
        stats.push({
          index: idx++,
          table,
          rows: 0,
          status: "❌ Error",
        })
      }
    }

    for (const table of dbTableNames) {
      if (!(EXACT_25_TABLES_ORDER as readonly string[]).includes(table)) {
        const rows = await sql`SELECT * FROM ${sql(table)}`
        tablesData[table] = rows
        totalRowCount += rows.length
        stats.push({
          index: idx++,
          table: `${table} (unlisted)`,
          rows: rows.length,
          status: "✅ Exported",
        })
      }
    }

    console.table(stats)

    const backupDir = path.resolve(process.cwd(), "backups")
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    const now = new Date()
    const timestamp = now
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace("T", "_")
      .slice(0, 19)

    const jsonFileName = `db-backup-${customLabel}-${timestamp}.json`
    const jsonFilePath = path.join(backupDir, jsonFileName)
    const backupPayload = {
      metadata: {
        exportedAt: now.toISOString(),
        environment: customLabel,
        database: currentDb.current_database,
        totalTablesConfigured: EXACT_25_TABLES_ORDER.length,
        totalTablesFound: dbTableNames.size,
        totalRows: totalRowCount,
      },
      tableCounts: Object.fromEntries(
        Object.entries(tablesData).map(([k, v]) => [k, v.length])
      ),
      tables: tablesData,
    }

    fs.writeFileSync(jsonFilePath, JSON.stringify(backupPayload, null, 2), "utf8")
    const jsonSizeKb = (fs.statSync(jsonFilePath).size / 1024).toFixed(2)
    console.log(`\n💾 Saved JSON Snapshot:`)
    console.log(`   📁 File: backups/${jsonFileName}`)
    console.log(`   📊 Size: ${jsonSizeKb} KB (${totalRowCount} total rows)`)

    const labelLatestJson = path.join(backupDir, `${customLabel}-latest.json`)
    fs.writeFileSync(labelLatestJson, JSON.stringify(backupPayload, null, 2), "utf8")
    console.log(`   🔗 Linked: backups/${customLabel}-latest.json`)

    const latestJsonPath = path.join(backupDir, "latest.json")
    fs.writeFileSync(latestJsonPath, JSON.stringify(backupPayload, null, 2), "utf8")
    console.log(`   🔗 Linked: backups/latest.json`)

    const sqlFileName = `db-backup-${customLabel}-${timestamp}.sql`
    const sqlFilePath = path.join(backupDir, sqlFileName)
    const orderedAll = Object.keys(tablesData)
    const sqlContent = generateSqlRestore(tablesData, orderedAll, customLabel)
    fs.writeFileSync(sqlFilePath, sqlContent, "utf8")
    const sqlSizeKb = (fs.statSync(sqlFilePath).size / 1024).toFixed(2)
    console.log(`\n📄 Saved SQL Restore Script:`)
    console.log(`   📁 File: backups/${sqlFileName}`)
    console.log(`   📊 Size: ${sqlSizeKb} KB`)

    const labelLatestSql = path.join(backupDir, `${customLabel}-latest.sql`)
    fs.writeFileSync(labelLatestSql, sqlContent, "utf8")
    console.log(`   🔗 Linked: backups/${customLabel}-latest.sql`)

    const latestSqlPath = path.join(backupDir, "latest.sql")
    fs.writeFileSync(latestSqlPath, sqlContent, "utf8")
    console.log(`   🔗 Linked: backups/latest.sql`)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log("\n========================================================")
    console.log(`🎉 ${customLabel.toUpperCase()} BACKUP SUCCESSFUL in ${duration}s!`)
    console.log(`All 25 tables are safely downloaded locally in /backups/`)
    console.log("========================================================\n")
  } catch (error: any) {
    console.error("\n❌ Backup failed with error:", error)
    process.exit(1)
  } finally {
    await sql.end()
    process.exit(0)
  }
}

if (process.argv[1] && process.argv[1].endsWith("backup-db.ts")) {
  runBackup()
}
