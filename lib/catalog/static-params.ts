import { getProducts } from "@/db/queries/products/list"
import { getTools } from "@/db/queries/tools/list"
import {
  getProductCategories,
  getToolCategories,
  type DbCategoryItem,
} from "@/db/queries/categories/list"
import { getActiveMakersForSitemap } from "@/db/queries/users/get-profile"
import { listPublishedBlogs } from "@/db/queries/blogs"
import { STATIC_PARAMS_LIMIT } from "@/constants/cache"
import {
  isAlternativesIndexable,
  isBuiltWithIndexable,
  isCategoryIndexable,
} from "@/utils/indexing"
import type { DbTool } from "@/types/entities"

// Pages listed here are rendered during the build and uploaded to the cache, so the Worker serves
// them without rendering. A database that cannot be reached during the build yields no params, and
// the pages then render on first visit instead of failing the build.
const safely = async <T>(load: () => Promise<T[]>): Promise<T[]> => {
  try {
    return await load()
  } catch {
    return []
  }
}

const toSlugParams = (items: ReadonlyArray<{ slug: string }>) =>
  items.map(({ slug }) => ({ slug }))

// A tool's category count includes the tool itself.
export const filterToolsWithAlternatives = (
  tools: readonly DbTool[],
  toolCategories: readonly DbCategoryItem[]
): DbTool[] => {
  const categoryCounts = new Map(
    toolCategories.map(({ id, count }) => [id, count])
  )
  return tools.filter(
    ({ categoryId }) =>
      Boolean(categoryId) &&
      isAlternativesIndexable((categoryCounts.get(categoryId!) ?? 0) - 1)
  )
}

export const getProductStaticParams = () =>
  safely(async () =>
    toSlugParams(await getProducts({ limit: STATIC_PARAMS_LIMIT }))
  )

export const getToolStaticParams = () =>
  safely(async () =>
    toSlugParams(await getTools({ limit: STATIC_PARAMS_LIMIT }))
  )

export const getBuiltWithStaticParams = () =>
  safely(async () =>
    toSlugParams(
      (await getTools({ limit: STATIC_PARAMS_LIMIT })).filter((tool) =>
        isBuiltWithIndexable(tool.buildsCount ?? 0)
      )
    )
  )

export const getAlternativesStaticParams = () =>
  safely(async () => {
    const [tools, toolCategories] = await Promise.all([
      getTools({ limit: STATIC_PARAMS_LIMIT }),
      getToolCategories(),
    ])
    return toSlugParams(filterToolsWithAlternatives(tools, toolCategories))
  })

const toIndexableCategoryParams = (categories: readonly DbCategoryItem[]) =>
  toSlugParams(categories.filter(({ count }) => isCategoryIndexable(count)))

export const getProductCategoryStaticParams = () =>
  safely(async () => toIndexableCategoryParams(await getProductCategories()))

export const getToolCategoryStaticParams = () =>
  safely(async () => toIndexableCategoryParams(await getToolCategories()))

export const getBlogStaticParams = () =>
  safely(async () => {
    const { items } = await listPublishedBlogs({ limit: STATIC_PARAMS_LIMIT })
    return items.map(({ blog }) => ({ slug: blog.slug }))
  })

export const getMakerStaticParams = () =>
  safely(async () =>
    (await getActiveMakersForSitemap(STATIC_PARAMS_LIMIT)).flatMap(
      ({ username }) => (username ? [{ username }] : [])
    )
  )
