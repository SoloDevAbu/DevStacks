import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { fetchBlogs, type BlogListParams } from "@/lib/api/blogs"
import type { BlogListItem } from "@/types/blog"

export const BLOGS_INFINITE_QUERY_KEY = (
  params: BlogListParams & { initialPage?: number }
) => ["blogs", "infinite", params]

export const useInfiniteBlogs = ({
  limit = 20,
  initialPage = 1,
  totalPages,
  initialData,
}: BlogListParams & {
  initialPage?: number
  totalPages?: number
  initialData?: BlogListItem[]
} = {}) => {
  const queryClient = useQueryClient()
  const queryFilterParams = {
    limit,
    initialPage,
  }

  const queryKey = BLOGS_INFINITE_QUERY_KEY(queryFilterParams)
  const existingCache = queryClient.getQueryData(queryKey)

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = initialPage }) => {
      const data = await fetchBlogs({
        ...queryFilterParams,
        page: pageParam,
      })
      return (data ?? []) as BlogListItem[]
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < limit) return undefined
      const next = (lastPageParam as number) + 1
      if (totalPages && next > totalPages) return undefined
      return next
    },
    initialData: existingCache
      ? undefined
      : initialData
        ? {
            pages: [initialData],
            pageParams: [initialPage],
          }
        : undefined,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  })
}

