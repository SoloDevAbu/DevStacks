import { cache } from "react"
import { getCategoryBySlug } from "@/db/queries/categories/list"
import { getCategoryPath } from "@/utils/urls"

// `?category=<name>` filter views duplicate the category hub, so they point search engines at it.
export const resolveCategoryHubPath = cache(
  async (itemKind: "tool" | "product", category: string): Promise<string> => {
    const match = await getCategoryBySlug(category).catch(() => null)
    return getCategoryPath(itemKind, match?.slug)
  }
)
