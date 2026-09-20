import type { MetadataRoute } from "next"
import { getProducts } from "@/db/queries/products/list"
import { getTools } from "@/db/queries/tools/list"
import {
  getProductCategories,
  getToolCategories,
} from "@/db/queries/categories/list"
import { getAllMakers } from "@/db/queries/users/get-profile"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

const FALLBACK_CATEGORIES = [
  "AI",
  "Database",
  "Auth",
  "Payments",
  "Infra",
  "APIs",
]

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = SITE_CONFIG.url

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}${ROUTES.TOOLS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}${ROUTES.PRODUCTS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}${ROUTES.TRENDING}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.MAKERS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_WEEKLY_LAUNCHES}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/mcp`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/cli`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}${ROUTES.PRICING}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}${ROUTES.SHOWCASE}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}${ROUTES.SUBMIT}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}${ROUTES.PRIVACY}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}${ROUTES.TERMS}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}${ROUTES.REFUND}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}${ROUTES.FAQ}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
  ]

  try {
    const [dbProducts, dbTools, dbMakers, toolCategories, productCategories] =
      await Promise.all([
        getProducts({ limit: 5000 }),
        getTools({ limit: 5000 }),
        getAllMakers(5000).catch(() => []),
        getToolCategories().catch(() => []),
        getProductCategories().catch(() => []),
      ])

    const toolCats =
      toolCategories && toolCategories.length > 0
        ? toolCategories.map((c) => c.name)
        : FALLBACK_CATEGORIES

    const prodCats =
      productCategories && productCategories.length > 0
        ? productCategories.map((c) => c.name)
        : FALLBACK_CATEGORIES

    const dynamicRoutes: MetadataRoute.Sitemap = []

    if (dbProducts && dbProducts.length > 0) {
      dynamicRoutes.push(
        ...dbProducts.map((product) => ({
          url: `${siteUrl}/products/${product.slug}`,
          lastModified: product.updatedAt ?? new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      )
    }

    if (dbTools && dbTools.length > 0) {
      dynamicRoutes.push(
        ...dbTools.map((tool) => ({
          url: `${siteUrl}/tools/${tool.slug}`,
          lastModified: tool.updatedAt ?? new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      )
    }

    if (dbMakers && dbMakers.length > 0) {
      dynamicRoutes.push(
        ...dbMakers
          .filter((maker) => Boolean(maker.username))
          .map((maker) => ({
            url: `${siteUrl}/makers/${maker.username}`,
            lastModified: maker.updatedAt ?? maker.createdAt ?? new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.75,
          }))
      )
    }

    return [...staticRoutes, ...dynamicRoutes]
  } catch {
    // Return static routes if DB is temporarily unreachable
  }

  return [...staticRoutes]
}

export default sitemap
