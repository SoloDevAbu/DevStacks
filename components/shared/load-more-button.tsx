"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"

export const buildPageHref = (
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

interface LoadMoreButtonProps {
  href: string
  onLoadMore: () => void
  isLoading?: boolean
  hasNextPage?: boolean
  autoTrigger?: boolean
  className?: string
}

export const LoadMoreButton = ({
  href,
  onLoadMore,
  isLoading = false,
  hasNextPage = true,
  autoTrigger = true,
  className,
}: LoadMoreButtonProps) => {
  const containerRef = useIntersectionObserver({
    onIntersect: onLoadMore,
    enabled: autoTrigger && hasNextPage && !isLoading,
    rootMargin: "350px 0px",
  })

  if (!hasNextPage) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let browser handle opening in a new tab/window for modifier keys or non-primary clicks
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.shiftKey
    ) {
      return
    }

    e.preventDefault()
    if (!isLoading && hasNextPage) {
      onLoadMore()
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full items-center justify-center border-t border-dashed border-border bg-white/50 px-4 py-8",
        className
      )}
    >
      <a
        href={href}
        onClick={handleClick}
        role="button"
        aria-busy={isLoading}
        aria-disabled={isLoading}
        tabIndex={0}
        className={cn(
          buttonVariants({ variant: "outline", size: "default" }),
          "min-w-36 cursor-pointer gap-2 rounded-none border-border px-6 py-2.5 text-xs font-semibold shadow-2xs transition-all hover:bg-slate-50",
          isLoading && "pointer-events-none opacity-70"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-3.5 animate-spin text-slate-500" />
            <span>Loading more...</span>
          </>
        ) : (
          <span>Load more</span>
        )}
      </a>
    </div>
  )
}
