import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { getTools } from "@/db/queries/tools/list"
import { getProducts } from "@/db/queries/products/list"
import { db } from "@/db"
import { tools, products, users } from "@/db/schema"
import { sql, count, eq } from "drizzle-orm"
import { ROUTES } from "@/constants/routes"
import { AI_SURFACE_CACHE_CONTROL } from "@/constants/cache"
import { getCurrentLaunchWeekSnapshot } from "@/lib/launches/launch-week"
import { formatLaunchWeekHeading } from "@/lib/seo/markdown-twins"
import { getListingPath, toAbsoluteUrl } from "@/utils/urls"

export const revalidate = 3600

export const GET = async () => {
  const launchWeekPromise = getCurrentLaunchWeekSnapshot().catch(() => null)
  let toolsList: Awaited<ReturnType<typeof getTools>> = []
  let productsList: Awaited<ReturnType<typeof getProducts>> = []
  let makersList: Array<{
    name: string
    username: string | null
    country: string | null
    bio: string | null
  }> = []
  let totalToolsCount = 0
  let totalProductsCount = 0
  let totalMakersCount = 0

  try {
    const [
      fetchedTools,
      fetchedProducts,
      fetchedMakers,
      toolCountRes,
      productCountRes,
      makerCountRes,
    ] = await Promise.all([
      getTools({ sortBy: "builds", limit: 20 }),
      getProducts({ sortBy: "likes", limit: 20 }),
      db
        .select({
          name: users.name,
          username: users.username,
          country: users.country,
          bio: users.bio,
        })
        .from(users)
        .where(sql`${users.username} IS NOT NULL`)
        .limit(12),
      db
        .select({ total: count() })
        .from(tools)
        .where(eq(tools.isDeleted, false)),
      db
        .select({ total: count() })
        .from(products)
        .where(eq(products.isDeleted, false)),
      db
        .select({ total: count() })
        .from(users)
        .where(sql`${users.username} IS NOT NULL`),
    ])
    toolsList = fetchedTools ?? []
    productsList = fetchedProducts ?? []
    makersList = fetchedMakers ?? []
    totalToolsCount = Number(toolCountRes[0]?.total ?? toolsList.length)
    totalProductsCount = Number(
      productCountRes[0]?.total ?? productsList.length
    )
    totalMakersCount = Number(makerCountRes[0]?.total ?? makersList.length)
  } catch {
    toolsList = []
    productsList = []
    makersList = []
  }

  const launchWeek = await launchWeekPromise

  const snapshot = {
    generatedAt: new Date().toISOString(),
    platform: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    url: SITE_CONFIG.url,
    stats: {
      totalTools: totalToolsCount,
      totalProducts: totalProductsCount,
      totalMakers: totalMakersCount,
      activeEcosystem: true,
    },
    thisWeeksLaunches: launchWeek && {
      isoYear: launchWeek.year,
      isoWeek: launchWeek.week,
      label: formatLaunchWeekHeading(launchWeek),
      startDate: launchWeek.startDate.toISOString(),
      endDate: launchWeek.endDate.toISOString(),
      lastUpdated: launchWeek.lastUpdated.toISOString(),
      count: launchWeek.items.length,
      weekUrl: toAbsoluteUrl(ROUTES.LAUNCH_WEEK(launchWeek.year, launchWeek.week)),
      items: launchWeek.items.map((item, index) => ({
        rank: index + 1,
        kind: item.itemKind,
        name: item.name,
        url: toAbsoluteUrl(getListingPath(item)),
        tagline: item.tagline,
        category: item.category,
        pricing: item.pricing,
        votes: item.itemKind === "tool" ? item.upvotesCount : item.likesCount,
      })),
    },
    topMakers: makersList
      .filter((m) => m.username)
      .map((m) => ({
        name: m.name,
        username: m.username!,
        url: `${SITE_CONFIG.url}/makers/${m.username}`,
        country: m.country,
        bio: m.bio,
      })),
    trendingTools: toolsList.slice(0, 15).map((t) => ({
      name: t.name,
      slug: t.slug,
      url: `${SITE_CONFIG.url}/tools/${t.slug}`,
      tagline: t.tagline,
      website: t.websiteUrl,
      category: t.category,
      pricing: t.pricing,
      buildsCount: t.buildsCount,
      upvotes: t.upvotesCount,
      maker: t.submitterUsername
        ? {
            name: t.submitterName,
            username: t.submitterUsername,
            country: t.submitterCountry,
          }
        : undefined,
    })),
    topProducts: productsList.slice(0, 15).map((p) => ({
      name: p.name,
      slug: p.slug,
      url: `${SITE_CONFIG.url}/products/${p.slug}`,
      tagline: p.tagline,
      website: p.websiteUrl,
      category: p.category,
      tags: p.tags,
      pricing: p.pricing,
      tier: p.tier,
      likes: p.likesCount,
      maker: p.submitterUsername
        ? {
            name: p.submitterName,
            username: p.submitterUsername,
            country: p.submitterCountry,
          }
        : undefined,
      builtWith: (p.builtWithTools ?? []).map((b) =>
        typeof b === "string" ? b : b.name
      ),
    })),

    links: {
      home: SITE_CONFIG.url,
      faq: `${SITE_CONFIG.url}/faq`,
      faqMd: `${SITE_CONFIG.url}/faq.md`,
      llmsTxt: `${SITE_CONFIG.url}/llms.txt`,
      llmsFullTxt: `${SITE_CONFIG.url}/llms-full.txt`,
      aiTxt: `${SITE_CONFIG.url}/ai.txt`,
      mcpDocs: `${SITE_CONFIG.url}/mcp`,
      mcpEndpoint: `${SITE_CONFIG.url}/api/mcp`,
      mcpServerCard: `${SITE_CONFIG.url}/.well-known/mcp/server-card.json`,
      mcpJson: `${SITE_CONFIG.url}/.well-known/mcp.json`,
      markdownCatalog: `${SITE_CONFIG.url}/api/md/catalog`,
      openapi: `${SITE_CONFIG.url}/openapi.json`,
      publicApi: `${SITE_CONFIG.url}/v1`,
      cli: `${SITE_CONFIG.url}/cli`,
      auth: `${SITE_CONFIG.url}/auth.md`,
    },
  }

  return NextResponse.json(snapshot, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": AI_SURFACE_CACHE_CONTROL,
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
