import type { MetadataRoute } from "next"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { SITE_CONFIG } from "@/constants/site"
import { TRENDING_PRODUCTS } from "@/constants/products"

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
      url: `${siteUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/built-with`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
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
    const dbProducts = await getTrendingProducts(50)
    if (dbProducts && dbProducts.length > 0) {
      const productRoutes: MetadataRoute.Sitemap = dbProducts.map((product) => ({
        url: `${siteUrl}/products/${product.slug}`,
        lastModified: product.updatedAt ?? new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
      return [...staticRoutes, ...productRoutes]
    }
  } catch {
    // Fall back to constants if DB connection is unavailable
  }

  const fallbackProductRoutes: MetadataRoute.Sitemap = TRENDING_PRODUCTS.map((product) => ({
    url: `${siteUrl}/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...fallbackProductRoutes]
}
