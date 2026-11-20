import { revalidatePath, revalidateTag } from "next/cache"
import { CATALOG_CACHE_TAGS } from "@/constants/cache"
import { ROUTES } from "@/constants/routes"

interface CatalogChange {
  productSlug?: string
  toolSlug?: string
  makerUsername?: string
  blogSlug?: string
}

// Hub pages that read the database directly instead of through a tagged cache. They are few and
// fixed, so a catalog change or the weekly rollover expires them by path.
const HUB_PATHS = [
  ROUTES.BLOG,
  ROUTES.MAKERS,
  ROUTES.TRENDING,
  ROUTES.PRICING,
  ROUTES.PRODUCT_CATEGORIES,
  ROUTES.TOOL_CATEGORIES,
  ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS,
  ROUTES.SITEMAP,
] as const

export const revalidateHubs = () =>
  HUB_PATHS.forEach((path) => revalidatePath(path))

// Only the listing caches, the hub pages and the changed entity's own pages are marked stale.
// Expiring the whole route tree on every mutation would force a re-render (one database hit and
// one R2 write) of every page on its next visit.
export const revalidateCatalog = ({
  productSlug,
  toolSlug,
  makerUsername,
  blogSlug,
}: CatalogChange = {}) => {
  CATALOG_CACHE_TAGS.forEach((tag) => revalidateTag(tag, "max"))
  revalidateHubs()

  const entityPaths = [
    productSlug && ROUTES.PRODUCT(productSlug),
    toolSlug && ROUTES.TOOL(toolSlug),
    toolSlug && ROUTES.BUILT_WITH(toolSlug),
    toolSlug && ROUTES.ALTERNATIVES(toolSlug),
    makerUsername && ROUTES.MAKER(makerUsername),
    blogSlug && ROUTES.BLOG_POST(blogSlug),
  ].filter((path): path is string => Boolean(path))

  entityPaths.forEach((path) => revalidatePath(path))
}

// A profile edit only changes the maker's own page and the makers hub; expiring the catalog here
// would re-render every list page on each profile save.
export const revalidateMaker = (makerUsername?: string) => {
  revalidatePath(ROUTES.MAKERS)
  if (makerUsername) revalidatePath(ROUTES.MAKER(makerUsername))
}

interface VoteChange {
  productSlug?: string
  toolSlug?: string
}

// Only the voted item's own page is refreshed. Ranked lists pick up vote counts on the
// CACHE_REVALIDATE_SECONDS.RANKINGS timer, so a burst of votes no longer re-runs the ranking
// queries once per vote. A cache failure is logged rather than thrown because the vote is already
// committed by the time this runs.
export const revalidateVote = ({ productSlug, toolSlug }: VoteChange) => {
  try {
    if (productSlug) revalidatePath(ROUTES.PRODUCT(productSlug))
    if (toolSlug) revalidatePath(ROUTES.TOOL(toolSlug))
  } catch (error) {
    console.error("[Cache] Vote revalidation failed:", error)
  }
}
