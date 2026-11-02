import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/constants/cache"
import { ROUTES } from "@/constants/routes"

// A catalog change surfaces on many pages at once (listings, categories, alternatives, comparisons,
// sitemap, llms.txt, feed), so the whole route tree is marked stale. Pages keep serving the cached
// version and re-render in the background on their next visit.
export const revalidateCatalog = () => {
  Object.values(CACHE_TAGS).forEach((tag) => revalidateTag(tag, "max"))
  revalidatePath(ROUTES.HOME, "layout")
}
