import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import { inArray } from "drizzle-orm"
import postgres from "postgres"
import { getCanonicalCategory } from "../constants/categories"
import { categories, toolFaqs, tools } from "../db/schema"
import { buildSeedToolValues, seedToolsData } from "../db/seed"
import { getISOWeekRange } from "../utils/iso-weeks"

// Insert-only: adds the catalog tools behind the new alternatives pages and nothing else. A slug
// that already exists is skipped, never updated, so real users' listings, votes and launches stay
// exactly as they are.
//
//   pnpm tsx scripts/add-catalog-tools.ts            dry run, reads only
//   pnpm tsx scripts/add-catalog-tools.ts --apply    inserts the missing tools and their FAQs

const NEW_CATALOG_TOOL_SLUGS = [
  "claude-code",
  "cursor",
  "n8n",
  "zapier",
  "github-copilot",
  "lovable",
  "mongodb",
  "firebase",
  "jira",
  "replit",
  "terraform",
  "datadog",
] as const

// Week 39 of 2026 holds the original catalog tools and no maker launches, so these join them there
// instead of entering the current week's leaderboard next to real launches.
const CATALOG_LAUNCH_YEAR = 2026
const CATALOG_LAUNCH_WEEK = 39

const isApply = process.argv.includes("--apply")

const maskUrl = (raw: string) => {
  try {
    const parsed = new URL(raw)
    return `${parsed.hostname}:${parsed.port || "5432"}${parsed.pathname}`
  } catch {
    return "(unparseable DATABASE_URL)"
  }
}

const fail = (message: string): never => {
  console.error(`❌ ${message}`)
  process.exit(1)
}

const main = async () => {
  const databaseUrl = process.env.DATABASE_URL ?? fail("DATABASE_URL is not set.")

  const definitions = NEW_CATALOG_TOOL_SLUGS.map(
    (slug) =>
      seedToolsData.find((item) => item.slug === slug) ??
      fail(`No seed definition for "${slug}" in db/seed.ts.`)
  )

  // Seed definitions still use pre-migration category slugs; listings now live in the official set.
  const officialCategorySlug = (legacySlug: string) =>
    getCanonicalCategory(legacySlug)?.slug ??
    fail(`"${legacySlug}" has no official category in constants/categories.ts.`)

  const { startDate } = getISOWeekRange(CATALOG_LAUNCH_YEAR, CATALOG_LAUNCH_WEEK)
  const launch = {
    year: CATALOG_LAUNCH_YEAR,
    week: CATALOG_LAUNCH_WEEK,
    startDate,
  }

  console.log(`Database: ${maskUrl(databaseUrl)}`)
  console.log(`Mode:     ${isApply ? "APPLY (inserts new rows only)" : "DRY RUN (reads only)"}`)
  console.log(
    `Launch:   ${CATALOG_LAUNCH_YEAR} week ${CATALOG_LAUNCH_WEEK} (${startDate.toISOString().slice(0, 10)})\n`
  )

  const client = postgres(databaseUrl, { max: 1, prepare: false })
  const db = drizzle({ client })

  try {
    const existingSlugs = new Set(
      (
        await db
          .select({ slug: tools.slug })
          .from(tools)
          .where(inArray(tools.slug, [...NEW_CATALOG_TOOL_SLUGS]))
      ).map(({ slug }) => slug)
    )

    const categorySlugs = [
      ...new Set(definitions.map((item) => officialCategorySlug(item.categorySlug))),
    ]
    const categoryIds = new Map(
      (
        await db
          .select({ id: categories.id, slug: categories.slug })
          .from(categories)
          .where(inArray(categories.slug, categorySlugs))
      ).map(({ id, slug }) => [slug, id])
    )

    const missingCategories = categorySlugs.filter((slug) => !categoryIds.has(slug))
    if (missingCategories.length > 0) {
      fail(
        `Missing categories: ${missingCategories.join(", ")}. This script never creates categories.`
      )
    }

    const toInsert = definitions.filter((item) => !existingSlugs.has(item.slug))

    console.table(
      definitions.map((item) => ({
        slug: item.slug,
        category: officialCategorySlug(item.categorySlug),
        tier: item.tier,
        faqs: item.faqs.length,
        action: existingSlugs.has(item.slug) ? "skip (already exists)" : "insert",
      }))
    )

    if (toInsert.length === 0) {
      console.log("\nNothing to insert.")
      return
    }

    if (!isApply) {
      console.log(
        `\nDry run: ${toInsert.length} tool(s) would be inserted. Re-run with --apply to write them.`
      )
      return
    }

    const now = new Date()
    const inserted = await db.transaction(async (tx) => {
      const slugs: string[] = []
      for (const item of toInsert) {
        const categoryId =
          categoryIds.get(officialCategorySlug(item.categorySlug)) ??
          fail(`No category for ${item.slug}`)
        // DO NOTHING on conflict: a row created since the check above is left untouched.
        const [row] = await tx
          .insert(tools)
          .values(buildSeedToolValues(item, categoryId, launch, now))
          .onConflictDoNothing({ target: tools.slug })
          .returning({ id: tools.id, slug: tools.slug })

        if (!row) continue

        if (item.faqs.length > 0) {
          await tx.insert(toolFaqs).values(
            item.faqs.map((faq, index) => ({
              toolId: row.id,
              question: faq.question,
              answer: faq.answer,
              sortOrder: index,
            }))
          )
        }
        slugs.push(row.slug)
      }
      return slugs
    })

    console.log(`\n✅ Inserted ${inserted.length} tool(s): ${inserted.join(", ")}`)
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error("❌ Failed:", error)
  process.exit(1)
})
