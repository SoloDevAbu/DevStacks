import type { MetadataRoute } from "next"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { SITE_CONFIG } from "@/constants/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_CONFIG.url

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/showcase`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  try {
    const [dbProducts, dbTools] = await Promise.all([
      getTrendingProducts(50),
      import("@/db/queries/tools/list").then((m) => m.getTools({ limit: 50 })),
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

    return [...staticRoutes, ...dynamicRoutes]
  } catch {
    // Return static routes if DB is temporarily unreachable
  }

  return staticRoutes
}
