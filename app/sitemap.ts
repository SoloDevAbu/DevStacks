import type { MetadataRoute } from "next"
import { getProducts } from "@/db/queries/products/list"
import { getTools } from "@/db/queries/tools/list"
import { getActiveMakersForSitemap } from "@/db/queries/users/get-profile"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = SITE_CONFIG.url
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}${ROUTES.TOOLS}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}${ROUTES.PRODUCTS}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}${ROUTES.TRENDING}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.MAKERS}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_WEEKLY_LAUNCHES}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/mcp`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/cli`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}${ROUTES.PRICING}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}${ROUTES.SUBMIT}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}${ROUTES.PRIVACY}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}${ROUTES.TERMS}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}${ROUTES.REFUND}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}${ROUTES.FAQ}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ]

  try {
    const [dbProducts, dbTools, dbMakers] = await Promise.all([
      getProducts({ limit: 5000 }),
      getTools({ limit: 5000 }),
      getActiveMakersForSitemap(5000).catch(() => []),
    ])

    const dynamicRoutes: MetadataRoute.Sitemap = []

    if (dbProducts && dbProducts.length > 0) {
      dynamicRoutes.push(
        ...dbProducts.map((product) => ({
          url: `${siteUrl}/products/${product.slug}`,
          lastModified: product.updatedAt ?? now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      )
    }

    if (dbTools && dbTools.length > 0) {
      dynamicRoutes.push(
        ...dbTools.map((tool) => ({
          url: `${siteUrl}/tools/${tool.slug}`,
          lastModified: tool.updatedAt ?? now,
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
            lastModified: maker.updatedAt ?? maker.createdAt ?? now,
            changeFrequency: "weekly" as const,
            priority: 0.75,
          }))
      )
    }

    return [...staticRoutes, ...dynamicRoutes]
  } catch {
    return [...staticRoutes]
  }
}

export default sitemap
