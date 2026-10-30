"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { BlogRowItem } from "@/components/blog/blog-row-item"
import type { BlogListItem } from "@/types/blog"
import { useInfiniteBlogs } from "@/hooks/blogs/use-blogs"
import {
  LoadMoreButton,
  buildPageHref,
} from "@/components/shared/load-more-button"
import { useScrollRestoration } from "@/hooks/shared/use-scroll-restoration"
import { directoryTelemetryBar } from "@/utils/styles"
import { ROUTES } from "@/constants/routes"
import { blogListContainer } from "@/utils/blog/styles"

interface BlogDirectoryContentProps {
  initialPage?: number
  totalPages?: number
  initialBlogs?: BlogListItem[]
  totalCount?: number
}

export const BlogDirectoryContent = ({
  initialPage = 1,
  totalPages,
  initialBlogs = [],
  totalCount,
}: BlogDirectoryContentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteBlogs({
      limit: 20,
      initialPage,
      totalPages,
      initialData: initialBlogs,
    })

  const displayedBlogs =
    data?.pages.flatMap((page) => page) ?? initialBlogs

  useScrollRestoration({
    key: "bmnl_blogs_scroll",
    filterKey: "all",
    hasData: displayedBlogs.length > 0,
  })

  const currentCount = displayedBlogs.length
  const total = hasNextPage ? (totalCount ?? currentCount) : currentCount

  const currentPageParam =
    data?.pageParams && data.pageParams.length > 0
      ? (data.pageParams[data.pageParams.length - 1] as number)
      : initialPage

  const nextPage = currentPageParam + 1
  const nextPageHref = buildPageHref(ROUTES.BLOG, nextPage)

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Full width telemetry bar below subtitle */}
      <div className={directoryTelemetryBar}>
        <div>
          Showing <span className="font-semibold text-slate-900">{currentCount}</span> of{" "}
          <span className="font-semibold text-slate-900">{total}</span>
        </div>
      </div>

      {displayedBlogs.length === 0 ? (
        <div className="flex min-h-[300px] w-full flex-col items-center justify-center border-b border-dashed border-border bg-white p-8 text-center">
          <BookOpen className="mb-3 size-10 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">
            No Launch Stories Published Yet
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Our editorial team and AI radar are reviewing upcoming launches.
            Check back soon for our first wave of architecture breakdowns.
          </p>
          <Link
            href={ROUTES.SUBMIT}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            Submit a product for review
          </Link>
        </div>
      ) : (
        <div className="flex w-full flex-1 flex-col pb-8">
          <div className={blogListContainer}>
            {displayedBlogs.map(({ blog, tool, product, submitter }) => (
              <BlogRowItem
                key={blog.id}
                blog={blog}
                tool={tool}
                product={product}
                submitter={submitter}
              />
            ))}
          </div>

          <LoadMoreButton
            href={nextPageHref}
            onLoadMore={fetchNextPage}
            isLoading={isFetchingNextPage}
            hasNextPage={Boolean(hasNextPage)}
          />
        </div>
      )}
    </div>
  )
}

