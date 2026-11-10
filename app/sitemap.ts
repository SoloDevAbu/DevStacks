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
import { DIRECTORY_FACTS_CHECKED_ON } from "@/constants/directories"
import { LAUNCH_DIRECTORIES } from "@/constants/launch-directories"
import {
  isAlternativesIndexable,
  isBuiltWithIndexable,
  isCategoryIndexable,
} from "@/utils/indexing"
import { getCachedLaunchWeekSummaries } from "@/lib/launches/launch-archive"

export const revalidate = 3600

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
      url: normalizeSitemapUrl(ROUTES.MCP),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: normalizeSitemapUrl(ROUTES.CLI),
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
    {
      url: normalizeSitemapUrl(ROUTES.DIRECTORIES),
      lastModified: new Date(DIRECTORY_FACTS_CHECKED_ON),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...LAUNCH_DIRECTORIES.map((directory) => ({
      url: normalizeSitemapUrl(ROUTES.DIRECTORY(directory.slug)),
      lastModified: new Date(DIRECTORY_FACTS_CHECKED_ON),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getAllComparisons().map((comparison) => ({
      url: normalizeSitemapUrl(comparison.routePath || comparison.canonicalUrl),
      lastModified: new Date(comparison.factsCheckedOn),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ]

  // Not caught on purpose: a failed refresh keeps the last full sitemap instead of
  // publishing one that drops every product, tool and maker URL.
  const [
    dbProducts,
    dbTools,
    dbMakers,
    toolCategories,
    productCategories,
    publishedBlogs,
    launchWeeks,
  ] = await Promise.all([
    getProducts({ limit: 5000 }),
    getTools({ limit: 5000 }),
    getActiveMakersForSitemap(5000).catch(() => []),
    getToolCategories().catch(() => []),
    getProductCategories().catch(() => []),
    listPublishedBlogs({ limit: 5000 }).catch(() => ({ items: [] })),
    getCachedLaunchWeekSummaries().catch(() => []),
  ])

  const dynamicRoutes: MetadataRoute.Sitemap = launchWeeks.map(
    ({ year, week, lastUpdated }) => ({
      url: normalizeSitemapUrl(ROUTES.LAUNCH_WEEK(year, week)),
      lastModified: new Date(lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  )

  if (toolCategories && toolCategories.length > 0) {
    dynamicRoutes.push(
      ...toolCategories
        .filter((cat) => isCategoryIndexable(cat.count))
        .map((cat) => ({
          url: normalizeSitemapUrl(ROUTES.TOOL_CATEGORY(cat.slug)),
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.85,
        }))
    )
  }

  if (productCategories && productCategories.length > 0) {
    dynamicRoutes.push(
      ...productCategories
        .filter((cat) => isCategoryIndexable(cat.count))
        .map((cat) => ({
          url: normalizeSitemapUrl(ROUTES.PRODUCT_CATEGORY(cat.slug)),
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.85,
        }))
    )
  }

  // Paginated list pages stay crawlable through their links; the sitemap lists only the pages
  // that hold content of their own.
  if (dbProducts && dbProducts.length > 0) {
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
    dynamicRoutes.push(
      ...dbTools.map((tool) => ({
        url: normalizeSitemapUrl(`/tools/${tool.slug}`),
        lastModified: tool.updatedAt ?? now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    )

    dynamicRoutes.push(
      ...dbTools
        .filter((tool) => isBuiltWithIndexable(tool.buildsCount ?? 0))
        .map((tool) => ({
          url: normalizeSitemapUrl(`/built-with/${tool.slug}`),
          lastModified: tool.updatedAt ?? now,
          changeFrequency: "weekly" as const,
          priority: 0.75,
        }))
    )

    // A tool's category count includes the tool itself.
    const categoryCountMap = new Map<string, number>()
    for (const cat of toolCategories) {
      categoryCountMap.set(cat.id, cat.count)
    }

    dynamicRoutes.push(
      ...dbTools
        .filter((tool) => {
          if (!tool.categoryId) return false
          const count = categoryCountMap.get(tool.categoryId) ?? 0
          return isAlternativesIndexable(count - 1)
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
      ...dbMakers.map((maker) => ({
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

  // Hubs change when a listing does, so they carry the newest listing update instead of the
  // time the sitemap happened to be generated. Editorial and policy pages carry no date, because
  // nothing here knows when their copy last changed.
  const catalogLastModified = [
    ...(dbProducts ?? []),
    ...(dbTools ?? []),
  ].reduce(
    (latest, item) =>
      item.updatedAt && new Date(item.updatedAt) > latest
        ? new Date(item.updatedAt)
        : latest,
    new Date(0)
  )
  const hubLastModified =
    catalogLastModified.getTime() > 0 ? catalogLastModified : now
  const undatedUrls = new Set(
    [
      ROUTES.PRIVACY,
      ROUTES.TERMS,
      ROUTES.REFUND,
      ROUTES.PRICING,
      ROUTES.FAQ,
      ROUTES.SUBMIT,
      ROUTES.MCP,
      ROUTES.CLI,
      ROUTES.PRODUCTHUNT_ALTERNATIVES,
      ROUTES.SAAS_DIRECTORY,
      ROUTES.PRODUCT_LAUNCH_PLATFORM,
      ROUTES.GUIDE_SAAS_DIRECTORIES,
      ROUTES.GUIDE_LAUNCH_DEVTOOLS,
    ].map(normalizeSitemapUrl)
  )

  const seen = new Set<string>()
  return [...staticRoutes, ...dynamicRoutes]
    .map((entry) => {
      const url = normalizeSitemapUrl(entry.url)
      return {
        ...entry,
        url,
        lastModified: undatedUrls.has(url)
          ? undefined
          : entry.lastModified === now
            ? hubLastModified
            : entry.lastModified,
      }
    })
    .filter((entry) => {
      if (!entry.url || seen.has(entry.url)) return false
      seen.add(entry.url)
      return true
    })
}

export default sitemap
