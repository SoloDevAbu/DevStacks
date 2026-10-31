import type { MetadataRoute } from "next"
import { getProducts } from "@/db/queries/products/list"
import { getTools } from "@/db/queries/tools/list"
import {
  getToolCategories,
  getProductCategories,
} from "@/db/queries/categories/list"
import { getActiveMakersForSitemap } from "@/db/queries/users/get-profile"
import { listPublishedBlogs } from "@/db/queries/blogs"
import { ROUTES } from "@/constants/routes"
import { normalizeSitemapUrl } from "@/utils/urls"
import { getAllComparisons } from "@/constants/comparisons"

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: normalizeSitemapUrl(ROUTES.HOME),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: normalizeSitemapUrl(ROUTES.TOOLS),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: normalizeSitemapUrl(ROUTES.TOOL_CATEGORIES),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl(ROUTES.PRODUCTS),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: normalizeSitemapUrl(ROUTES.PRODUCT_CATEGORIES),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl(ROUTES.TRENDING),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: normalizeSitemapUrl(ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl(ROUTES.MAKERS),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl(ROUTES.DISCOVER_WEEKLY_LAUNCHES),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl("/mcp"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: normalizeSitemapUrl("/cli"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: normalizeSitemapUrl(ROUTES.BLOG),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl(ROUTES.PRICING),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: normalizeSitemapUrl(ROUTES.SUBMIT),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: normalizeSitemapUrl(ROUTES.PRIVACY),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: normalizeSitemapUrl(ROUTES.TERMS),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: normalizeSitemapUrl(ROUTES.REFUND),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: normalizeSitemapUrl(ROUTES.FAQ),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl(ROUTES.PRODUCTHUNT_ALTERNATIVES),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl(ROUTES.SAAS_DIRECTORY),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: normalizeSitemapUrl(ROUTES.DEVELOPER_TOOLS_DIRECTORY),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: normalizeSitemapUrl(ROUTES.PRODUCT_LAUNCH_PLATFORM),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: normalizeSitemapUrl(ROUTES.GUIDE_SAAS_DIRECTORIES),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: normalizeSitemapUrl(ROUTES.GUIDE_LAUNCH_DEVTOOLS),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...getAllComparisons().map((comparison) => ({
      url: normalizeSitemapUrl(comparison.routePath || comparison.canonicalUrl),
      lastModified: comparison.lastVerifiedDate
        ? new Date(comparison.lastVerifiedDate)
        : now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ]

  try {
    const [
      dbProducts,
      dbTools,
      dbMakers,
      toolCategories,
      productCategories,
      publishedBlogs,
    ] = await Promise.all([
      getProducts({ limit: 5000 }),
      getTools({ limit: 5000 }),
      getActiveMakersForSitemap(5000).catch(() => []),
      getToolCategories().catch(() => []),
      getProductCategories().catch(() => []),
      listPublishedBlogs({ limit: 5000 }).catch(() => ({ items: [] })),
    ])

    const dynamicRoutes: MetadataRoute.Sitemap = []

    // Tool Category Hubs with >= 1 approved tools
    if (toolCategories && toolCategories.length > 0) {
      dynamicRoutes.push(
        ...toolCategories
          .filter((cat) => cat.count >= 1)
          .map((cat) => ({
            url: normalizeSitemapUrl(ROUTES.TOOL_CATEGORY(cat.slug)),
            lastModified: now,
            changeFrequency: "daily" as const,
            priority: 0.85,
          }))
      )
    }

    // Product Category Hubs with >= 1 approved products
    if (productCategories && productCategories.length > 0) {
      dynamicRoutes.push(
        ...productCategories
          .filter((cat) => cat.count >= 1)
          .map((cat) => ({
            url: normalizeSitemapUrl(ROUTES.PRODUCT_CATEGORY(cat.slug)),
            lastModified: now,
            changeFrequency: "daily" as const,
            priority: 0.85,
          }))
      )
    }

    if (dbProducts && dbProducts.length > 0) {
      const totalProductPages = Math.ceil(dbProducts.length / 20)
      for (let p = 2; p <= totalProductPages; p++) {
        dynamicRoutes.push({
          url: normalizeSitemapUrl(`/products?page=${p}`),
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.8,
        })
      }
      dynamicRoutes.push(
        ...dbProducts.map((product) => ({
          url: normalizeSitemapUrl(`/products/${product.slug}`),
          lastModified: product.updatedAt ?? now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      )
    }

    if (dbTools && dbTools.length > 0) {
      const totalToolPages = Math.ceil(dbTools.length / 20)
      for (let p = 2; p <= totalToolPages; p++) {
        dynamicRoutes.push({
          url: normalizeSitemapUrl(`/tools?page=${p}`),
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.8,
        })
      }
      // Base tool profile URLs
      dynamicRoutes.push(
        ...dbTools.map((tool) => ({
          url: normalizeSitemapUrl(`/tools/${tool.slug}`),
          lastModified: tool.updatedAt ?? now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      )

      // Dedicated Built-With showcase pages for tools with >= 1 verified builds
      dynamicRoutes.push(
        ...dbTools
          .filter((tool) => (tool.buildsCount ?? 0) >= 1)
          .map((tool) => ({
            url: normalizeSitemapUrl(`/built-with/${tool.slug}`),
            lastModified: tool.updatedAt ?? now,
            changeFrequency: "weekly" as const,
            priority: 0.75,
          }))
      )

      // Dedicated Alternatives pages for tools with >= 1 sibling in the same category
      const categoryCountMap = new Map<string, number>()
      for (const cat of toolCategories) {
        categoryCountMap.set(cat.id, cat.count)
      }

      dynamicRoutes.push(
        ...dbTools
          .filter((tool) => {
            if (!tool.categoryId) return false
            const count = categoryCountMap.get(tool.categoryId) ?? 0
            return count >= 2 // self + at least 1 sibling
          })
          .map((tool) => ({
            url: normalizeSitemapUrl(`/alternatives/${tool.slug}`),
            lastModified: tool.updatedAt ?? now,
            changeFrequency: "weekly" as const,
            priority: 0.75,
          }))
      )
    }

    if (dbMakers && dbMakers.length > 0) {
      dynamicRoutes.push(
        ...dbMakers
          .filter((maker) => Boolean(maker.username))
          .map((maker) => ({
            url: normalizeSitemapUrl(`/makers/${maker.username}`),
            lastModified: maker.updatedAt ?? maker.createdAt ?? now,
            changeFrequency: "weekly" as const,
            priority: 0.75,
          }))
      )
    }

    if (publishedBlogs?.items && publishedBlogs.items.length > 0) {
      dynamicRoutes.push(
        ...publishedBlogs.items.map(({ blog }) => ({
          url: normalizeSitemapUrl(ROUTES.BLOG_POST(blog.slug)),
          lastModified: blog.updatedAt ?? blog.publishedAt ?? now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      )
    }

    const seen = new Set<string>()
    return [...staticRoutes, ...dynamicRoutes]
      .map((entry) => ({
        ...entry,
        url: normalizeSitemapUrl(entry.url),
      }))
      .filter((entry) => {
        if (!entry.url || seen.has(entry.url)) return false
        seen.add(entry.url)
        return true
      })
  } catch {
    const seen = new Set<string>()
    return staticRoutes
      .map((entry) => ({
        ...entry,
        url: normalizeSitemapUrl(entry.url),
      }))
      .filter((entry) => {
        if (!entry.url || seen.has(entry.url)) return false
        seen.add(entry.url)
        return true
      })
  }
}

export default sitemap
