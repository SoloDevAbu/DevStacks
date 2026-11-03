import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/constants/cache"
import { ROUTES } from "@/constants/routes"

interface CatalogChange {
  productSlug?: string
  toolSlug?: string
  makerUsername?: string
  blogSlug?: string
}

// Only the listing caches and the changed entity's own pages are marked stale. Expiring the whole
// route tree on every mutation would force a re-render (one database hit and one R2 write) of every
// page on its next visit.
export const revalidateCatalog = ({
  productSlug,
  toolSlug,
  makerUsername,
  blogSlug,
}: CatalogChange = {}) => {
  Object.values(CACHE_TAGS).forEach((tag) => revalidateTag(tag, "max"))

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
