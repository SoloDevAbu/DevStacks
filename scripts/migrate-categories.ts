import "dotenv/config"
import postgres from "postgres"
import {
  OFFICIAL_CATEGORIES,
  LEGACY_CATEGORY_REDIRECTS,
  getCanonicalCategory,
} from "../constants/categories"

const args = process.argv.slice(2)
const isDryRun = args.includes("--dry-run")
const targetUrl =
  args.find((a) => !a.startsWith("--") && (a.startsWith("postgres://") || a.startsWith("postgresql://"))) ||
  process.env.DATABASE_URL ||
  ""

if (!targetUrl) {
  console.error("❌ Error: No database URL provided.")
  process.exit(1)
}

// Mask password for terminal output
const maskUrl = (raw: string): string => {
  try {
    const parsed = new URL(raw)
    if (parsed.password) parsed.password = "******"
    return parsed.toString()
  } catch {
    return raw.replace(/:([^:@]+)@/, ":******@")
  }
}

const runMigration = async () => {
  const startTime = Date.now()
  console.log("🚀 ========================================================")
  console.log(`📦 LaunchNests Category Standardization Migration`)
  console.log(`Mode: ${isDryRun ? "🧪 DRY RUN (No changes will be saved)" : "⚡ LIVE EXECUTION"}`)
  console.log(`Database: ${maskUrl(targetUrl)}`)
  console.log("🚀 ========================================================\n")

  const sql = postgres(targetUrl, { max: 1, prepare: false })

  try {
    const [currentDb] = await sql`SELECT current_database(), current_user`
    console.log(`✅ Connected to DB: "${currentDb.current_database}" as user: "${currentDb.current_user}"\n`)

    // 1. Upsert all official categories into categories table
    console.log(`1️⃣ Upserting ${OFFICIAL_CATEGORIES.length} official categories into categories table...`)

    if (!isDryRun) {
      for (const cat of OFFICIAL_CATEGORIES) {
        await sql`
          INSERT INTO categories (name, slug)
          VALUES (${cat.name}, ${cat.slug})
          ON CONFLICT (slug) DO UPDATE SET name = ${cat.name}
        `
      }
      console.log(`   ✅ All ${OFFICIAL_CATEGORIES.length} official categories are present in database.\n`)
    } else {
      console.log(`   [Dry Run] Would upsert ${OFFICIAL_CATEGORIES.length} official categories.\n`)
    }

    // 2. Fetch fresh categories map from DB
    const allDbCategories = await sql<{ id: string; name: string; slug: string }[]>`
      SELECT id, name, slug FROM categories
    `
    const dbCatBySlug = new Map(allDbCategories.map((c) => [c.slug, c]))
    const dbCatById = new Map(allDbCategories.map((c) => [c.id, c]))

    // Ensure all official categories are mapped to their official names
    for (const cat of OFFICIAL_CATEGORIES) {
      if (dbCatBySlug.has(cat.slug)) {
        const existing = dbCatBySlug.get(cat.slug)!
        existing.name = cat.name // update display name to official
      } else {
        dbCatBySlug.set(cat.slug, {
          id: `new-${cat.slug}`,
          name: cat.name,
          slug: cat.slug,
        })
      }
    }

    const PRODUCT_EXPLICIT_MAPPING: Record<string, string> = {
      "AI Rap Video Generator": "ai-video",
      "AICost": "ai",
      "ConvertAny": "productivity",
      "dataHabibi": "analytics",
      "Dime Dime Baby AI": "ai-video",
      "Dola AI": "gaming",
      "Eng-Helper": "productivity",
      "Feng Shui Bedroom Planner": "design",
      "FindUpApp": "directory",
      "Flow AI": "ai-video",
      "FranchiseNegosyo": "directory",
      "FreeAIList": "directory",
      "GirlFilter": "ai-image",
      "Imgkits": "ai-image",
      "JSONViewerTool": "developer-tools",
      "Kling 4.0": "ai-video",
      "Kling 4.0 ": "ai-video",
      "Lighthouse Local": "seo",
      "Macro Markets": "finance",
      "mandapi": "ai",
      "MarkAny": "productivity",
      "MimicZip": "ai-video",
      "Niche Pickers": "seo",
      "PDF Duplicate Review": "productivity",
      "PSL Rating": "ai-image",
      "Ray 3.2 AI ": "ai-video",
      "remove person from photo": "ai-image",
      "Seamlessify": "design",
      "SEObot": "seo",
      "SpriteFrame": "gaming",
      "TeachAny": "education",
      "TermiGram": "developer-tools",
      "TransMonkey": "ai",
      "Trigram": "advertising",
      "TriRank": "seo",
      "Video Text Remover AI": "ai-video",
      "만화 번역기 AI": "ai",
    }

    const TOOL_EXPLICIT_MAPPING: Record<string, string> = {
      "Algolia": "developer-tools",
      "Bun": "developer-tools",
      "Clerk": "developer-tools",
      "Cloudflare": "developer-tools",
      "Docker": "developer-tools",
      "Dodo Payments": "finance",
      "Drizzle ORM": "developer-tools",
      "GitHub": "developer-tools",
      "Kitset": "productivity",
      "LangChain": "ai",
      "Linear": "project-management",
      "Neon": "developer-tools",
      "Next.js": "developer-tools",
      "OpenAI API": "ai",
      "Pangolinfo VOC Insight MCP": "analytics",
      "Playwright": "developer-tools",
      "PostgreSQL": "developer-tools",
      "PostHog": "analytics",
      "Postman": "developer-tools",
      "Prisma": "developer-tools",
      "Prisma Postgres": "developer-tools",
      "Raycast": "productivity",
      "Redis": "developer-tools",
      "Resend": "email",
      "Sentry": "developer-tools",
      "SiftingIO Market Data API": "finance",
      "Stripe": "finance",
      "Supabase": "developer-tools",
      "Tailwind CSS": "design-resources",
      "Turborepo": "developer-tools",
      "TypeScript": "programming-languages",
      "Upstash": "developer-tools",
      "Vercel": "developer-tools",
      "Vite": "developer-tools",
      "热核算力": "ai",
    }

    // Helper to get target official category
    const getTargetCategoryId = (
      currentCat: { name: string; slug: string } | null,
      itemType: "product" | "tool",
      name: string,
      tags: string[] = []
    ): { id: string; name: string; slug: string; reason: string } => {
      // 1. Explicit verified mapping for known items
      const explicitSlug =
        itemType === "product"
          ? PRODUCT_EXPLICIT_MAPPING[name]
          : TOOL_EXPLICIT_MAPPING[name]

      if (explicitSlug && dbCatBySlug.has(explicitSlug)) {
        const matched = dbCatBySlug.get(explicitSlug)!
        return {
          id: matched.id,
          name: matched.name,
          slug: matched.slug,
          reason: `Exact match for "${name}"`,
        }
      }

      // 2. Try canonical resolution of existing category
      if (currentCat) {
        const canonical =
          getCanonicalCategory(currentCat.slug) ||
          getCanonicalCategory(currentCat.name)
        if (canonical && dbCatBySlug.has(canonical.slug)) {
          const matched = dbCatBySlug.get(canonical.slug)!
          return {
            id: matched.id,
            name: matched.name,
            slug: matched.slug,
            reason: `Mapped from "${currentCat.name}"`,
          }
        }
      }

      // 3. Keyword fallbacks based on item name and tags
      const combined = `${name} ${tags.join(" ")}`.toLowerCase()
      if (
        combined.includes("ai video") ||
        combined.includes("kling") ||
        (combined.includes("video") && combined.includes("ai"))
      ) {
        const cat = dbCatBySlug.get("ai-video") || dbCatBySlug.get("video")!
        return { id: cat.id, name: cat.name, slug: cat.slug, reason: "Matched AI video" }
      }
      if (
        combined.includes("ai image") ||
        combined.includes("photo filter") ||
        (combined.includes("image") && combined.includes("ai"))
      ) {
        const cat = dbCatBySlug.get("ai-image") || dbCatBySlug.get("image")!
        return { id: cat.id, name: cat.name, slug: cat.slug, reason: "Matched AI image" }
      }
      if (combined.includes("video")) {
        const cat = dbCatBySlug.get("video")!
        return { id: cat.id, name: cat.name, slug: cat.slug, reason: "Matched video" }
      }
      if (combined.includes("image") || combined.includes("photo")) {
        const cat = dbCatBySlug.get("image")!
        return { id: cat.id, name: cat.name, slug: cat.slug, reason: "Matched image" }
      }
      if (combined.includes("telegram") || combined.includes("advertising")) {
        const cat = dbCatBySlug.get("advertising") || dbCatBySlug.get("marketing")!
        return { id: cat.id, name: cat.name, slug: cat.slug, reason: "Matched advertising" }
      }
      if (combined.includes("ai") || combined.includes("gpt") || combined.includes("llm")) {
        const cat = dbCatBySlug.get("ai")!
        return { id: cat.id, name: cat.name, slug: cat.slug, reason: "Matched AI" }
      }

      // Default fallback
      const fallbackSlug = itemType === "tool" ? "developer-tools" : "saas"
      const fallback = dbCatBySlug.get(fallbackSlug) || dbCatBySlug.get("productivity")!
      return { id: fallback.id, name: fallback.name, slug: fallback.slug, reason: `Default ${itemType} fallback` }
    }

    // 3. Process and Reconcile Products
    console.log("2️⃣ Processing and remapping all Products...")
    const products = await sql<{
      id: string
      name: string
      slug: string
      category_id: string | null
      tags: string[]
    }[]>`
      SELECT id, name, slug, category_id, tags FROM products ORDER BY name ASC
    `
    console.log(`   Found ${products.length} total products.\n`)

    const productDiffs: Array<{
      product: string
      oldCategory: string
      newCategory: string
      preservedTag: string
    }> = []

    for (const prod of products) {
      const currentCat = prod.category_id ? dbCatById.get(prod.category_id) || null : null
      const target = getTargetCategoryId(currentCat, "product", prod.name, prod.tags || [])

      let updatedTags = prod.tags || []
      let preservedTag = "-"

      // Preserve old category name in tags if it was unique and descriptive
      if (currentCat && currentCat.name.length > 2 && currentCat.name.length < 40) {
        const isNotPricingJunk = !currentCat.name.includes("**") && !currentCat.name.includes("MVP")
        const isDifferent = currentCat.name.toLowerCase() !== target.name.toLowerCase()
        if (isNotPricingJunk && isDifferent) {
          const tagToAppend = currentCat.name.toLowerCase()
          if (!updatedTags.includes(tagToAppend)) {
            updatedTags = [...updatedTags, tagToAppend]
            preservedTag = tagToAppend
          }
        }
      }

      productDiffs.push({
        product: prod.name,
        oldCategory: currentCat ? currentCat.name : "NULL (orphan)",
        newCategory: target.name,
        preservedTag,
      })

      if (!isDryRun) {
        await sql`
          UPDATE products
          SET category_id = ${target.id},
              tags = ${updatedTags}
          WHERE id = ${prod.id}
        `
      }
    }

    console.table(productDiffs)

    // 4. Process and Reconcile Tools
    console.log("\n3️⃣ Processing and remapping all Developer Tools...")
    const tools = await sql<{
      id: string
      name: string
      slug: string
      category_id: string | null
      tags: string[]
    }[]>`
      SELECT id, name, slug, category_id, tags FROM tools ORDER BY name ASC
    `
    console.log(`   Found ${tools.length} total tools.\n`)

    const toolDiffs: Array<{
      tool: string
      oldCategory: string
      newCategory: string
      preservedTag: string
    }> = []

    for (const tool of tools) {
      const currentCat = tool.category_id ? dbCatById.get(tool.category_id) || null : null
      const target = getTargetCategoryId(currentCat, "tool", tool.name, tool.tags || [])

      let updatedTags = tool.tags || []
      let preservedTag = "-"

      if (currentCat && currentCat.name.length > 2 && currentCat.name.length < 40) {
        const isDifferent = currentCat.name.toLowerCase() !== target.name.toLowerCase()
        if (isDifferent) {
          const tagToAppend = currentCat.name.toLowerCase()
          if (!updatedTags.includes(tagToAppend)) {
            updatedTags = [...updatedTags, tagToAppend]
            preservedTag = tagToAppend
          }
        }
      }

      toolDiffs.push({
        tool: tool.name,
        oldCategory: currentCat ? currentCat.name : "NULL (orphan)",
        newCategory: target.name,
        preservedTag,
      })

      if (!isDryRun) {
        await sql`
          UPDATE tools
          SET category_id = ${target.id},
              tags = ${updatedTags}
          WHERE id = ${tool.id}
        `
      }
    }

    console.table(toolDiffs)

    // 5. Clean up obsolete categories (only non-official categories with 0 items)
    console.log("\n4️⃣ Cleaning up orphaned/obsolete legacy categories...")
    const officialSlugs = new Set(OFFICIAL_CATEGORIES.map((c) => c.slug))

    const activeCatCounts = await sql<{ category_id: string; count: number }[]>`
      SELECT category_id, count(*)::int as count FROM (
        SELECT category_id FROM products WHERE category_id IS NOT NULL
        UNION ALL
        SELECT category_id FROM tools WHERE category_id IS NOT NULL
      ) active
      GROUP BY category_id
    `
    const activeCatIds = new Set(activeCatCounts.map((r) => r.category_id))

    // Categories to delete: NOT in official canonical list AND has 0 products/tools
    const freshDbCategories = await sql<{ id: string; name: string; slug: string }[]>`
      SELECT id, name, slug FROM categories
    `
    const obsoleteCats = freshDbCategories.filter(
      (c) => !officialSlugs.has(c.slug) && !activeCatIds.has(c.id)
    )

    console.log(`   Identified ${obsoleteCats.length} obsolete legacy categories to prune.`)

    if (!isDryRun && obsoleteCats.length > 0) {
      const obsoleteIds = obsoleteCats.map((c) => c.id)
      await sql`
        DELETE FROM categories
        WHERE id = ANY(${obsoleteIds})
      `
      console.log(`   ✅ Successfully pruned ${obsoleteCats.length} legacy category rows.`)
    } else if (isDryRun) {
      console.log(`   [Dry Run] Would prune ${obsoleteCats.length} categories: ${obsoleteCats.map((c) => c.name).slice(0, 10).join(", ")}...`)
    }

    // 6. Final Verification
    console.log("\n5️⃣ Final Integrity Verification:")
    const [prodNulls] = await sql`SELECT count(*)::int as count FROM products WHERE category_id IS NULL`
    const [toolNulls] = await sql`SELECT count(*)::int as count FROM tools WHERE category_id IS NULL`
    const [totalActiveCats] = await sql`SELECT count(*)::int as count FROM categories`

    console.log(`   * Products with NULL category: ${prodNulls.count} (Target: 0)`)
    console.log(`   * Tools with NULL category:    ${toolNulls.count} (Target: 0)`)
    console.log(`   * Total categories in DB:      ${totalActiveCats.count} (Target: ${OFFICIAL_CATEGORIES.length})`)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log("\n========================================================")
    console.log(`🎉 MIGRATION ${isDryRun ? "DRY RUN " : ""}COMPLETED in ${duration}s!`)
    console.log("========================================================\n")
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error)
    process.exit(1)
  } finally {
    await sql.end()
    process.exit(0)
  }
}

runMigration()
