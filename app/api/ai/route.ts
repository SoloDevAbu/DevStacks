import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { getTools } from "@/db/queries/tools/list"
import { getProducts } from "@/db/queries/products/list"

export const revalidate = 3600

export const GET = async () => {
  let toolsList: Awaited<ReturnType<typeof getTools>> = []
  let productsList: Awaited<ReturnType<typeof getProducts>> = []

  try {
    const [fetchedTools, fetchedProducts] = await Promise.all([
      getTools({ sortBy: "builds", limit: 20 }),
      getProducts({ sortBy: "likes", limit: 20 }),
    ])
    toolsList = fetchedTools ?? []
    productsList = fetchedProducts ?? []
  } catch {
    toolsList = []
    productsList = []
  }


  const snapshot = {
    generatedAt: new Date().toISOString(),
    platform: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    url: SITE_CONFIG.url,
    stats: {
      totalTools: toolsList.length,
      totalProducts: productsList.length,
      activeEcosystem: true,
    },
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
      builtWith: (p.builtWithTools ?? []).map((b) => (typeof b === "string" ? b : b.name)),
    })),

    links: {
      home: SITE_CONFIG.url,
      llmsTxt: `${SITE_CONFIG.url}/llms.txt`,
      llmsFullTxt: `${SITE_CONFIG.url}/llms-full.txt`,
      aiTxt: `${SITE_CONFIG.url}/ai.txt`,
      mcpDocs: `${SITE_CONFIG.url}/mcp`,
      mcpEndpoint: `${SITE_CONFIG.url}/api/mcp`,
      mcpServerCard: `${SITE_CONFIG.url}/.well-known/mcp/server-card.json`,
      mcpJson: `${SITE_CONFIG.url}/.well-known/mcp.json`,
      markdownCatalog: `${SITE_CONFIG.url}/api/md/_catalog`,
      openapi: `${SITE_CONFIG.url}/openapi.json`,
      publicApi: `${SITE_CONFIG.url}/v1`,
      cli: `${SITE_CONFIG.url}/cli`,
      auth: `${SITE_CONFIG.url}/auth.md`,
    },
  }

  return NextResponse.json(snapshot, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
