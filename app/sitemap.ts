import type { MetadataRoute } from "next"
import { getProducts } from "@/db/queries/products/list"
import { getTools } from "@/db/queries/tools/list"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

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
      url: `${siteUrl}${ROUTES.DISCOVER}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_NEW_RISING}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_RISING_TOOLS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_RISING_PRODUCTS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}${ROUTES.DISCOVER_RECENTLY_ADDED}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
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
      url: `${siteUrl}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
  ]

  const featuredCategories = [
    "AI",
    "Database",
    "Auth",
    "Payments",
    "Infra",
    "APIs",
  ]
  const categoryRoutes: MetadataRoute.Sitemap = [
    ...featuredCategories.map((cat) => ({
      url: `${siteUrl}${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...featuredCategories.map((cat) => ({
      url: `${siteUrl}${ROUTES.TOOLS}?category=${encodeURIComponent(cat)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ]

  try {
    const [dbProducts, dbTools] = await Promise.all([
      getProducts({ limit: 5000 }),
      getTools({ limit: 5000 }),
    ])

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

    return [...staticRoutes, ...categoryRoutes, ...dynamicRoutes]
  } catch {
    // Return static routes if DB is temporarily unreachable
  }

  return [...staticRoutes, ...categoryRoutes]
}

export default sitemap
