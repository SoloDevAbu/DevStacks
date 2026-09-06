"use client"

import Link from "next/link"
import { PackageSearch, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"

export interface FeedListProps {
  items: FeedItem[]
  isLoading?: boolean
  loadingCount?: number
  showMedals?: boolean
  showTrendingBadge?: boolean
  showFreshnessBadge?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyActionHref?: string
  emptyActionLabel?: string
  className?: string
}

export const FeedList = ({
  items,
  isLoading = false,
  loadingCount = 5,
  showMedals = false,
  showTrendingBadge = false,
  showFreshnessBadge = false,
  emptyTitle = "No items found",
  emptyDescription = "No tools or products found in this section. List yours to be discovered by builders!",
  emptyActionHref = ROUTES.SUBMIT,
  emptyActionLabel = "Submit to DevStacks",
  className,
}: FeedListProps) => {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col", className)}>
        {Array.from({ length: loadingCount }).map((_, i) => (
          <Card
            key={i}
            className={cn(
              "h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50",
              i > 0 && "-mt-px"
            )}
          />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-12 text-center",
          className
        )}
      >
        <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
          <PackageSearch className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">{emptyTitle}</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          {emptyDescription}
        </p>
        {emptyActionHref && (
          <div className="mt-4">
            <Button nativeButton={false} render={<Link href={emptyActionHref} />}>
              <PlusCircle className="mr-1.5 size-4" />
              {emptyActionLabel}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => (
        <FeedCard
          key={item.id}
          item={item}
          index={index}
          showMedals={showMedals}
          showTrendingBadge={showTrendingBadge}
          showFreshnessBadge={showFreshnessBadge}
        />
      ))}
    </div>
  )
}
