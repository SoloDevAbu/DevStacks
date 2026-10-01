import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface CrawlablePaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  params?: Record<string, string | undefined>
  className?: string
}

const buildPageHref = (
  basePath: string,
  page: number,
  params?: Record<string, string | undefined>
): string => {
  const sp = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val && key !== "page" && val.toLowerCase() !== "all") {
        sp.set(key, val)
      }
    })
  }
  if (page > 1) {
    sp.set("page", page.toString())
  }
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export const CrawlablePagination = ({
  currentPage,
  totalPages,
  basePath,
  params,
  className,
}: CrawlablePaginationProps) => {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 1
    const range: number[] = []
    const rangeWithDots: (number | "dots")[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push("dots")
        }
      }
      rangeWithDots.push(i)
      l = i
    }

    return rangeWithDots
  }

  const pages = getVisiblePages()
  const prevHref = buildPageHref(basePath, Math.max(1, currentPage - 1), params)
  const nextHref = buildPageHref(
    basePath,
    Math.min(totalPages, currentPage + 1),
    params
  )

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center border-t border-dashed border-border bg-white/50 px-4 py-6",
        className
      )}
    >
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={prevHref}
              className={cn(
                currentPage <= 1 && "pointer-events-none opacity-40"
              )}
            />
          </PaginationItem>

          {pages.map((p, idx) => {
            if (p === "dots") {
              return (
                <PaginationItem key={`dots-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            const isCurrent = p === currentPage
            const href = buildPageHref(basePath, p, params)

            return (
              <PaginationItem key={p}>
                <PaginationLink href={href} isActive={isCurrent}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              href={nextHref}
              className={cn(
                currentPage >= totalPages && "pointer-events-none opacity-40"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
