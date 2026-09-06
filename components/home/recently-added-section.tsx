"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/shared/section-header"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { useRecentlyAdded } from "@/hooks/products/use-recently-added"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"

export const RecentlyAddedSection = () => {
  const { data, isLoading } = useRecentlyAdded({
    limit: HOMEPAGE_LIMITS.RECENTLY_ADDED,
  })

  const items = (data ?? []) as FeedItem[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Recently Added"
        subtitle="Latest products and tools added by the community"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER_RECENTLY_ADDED}
      />
      <div className="-mt-px flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.RECENTLY_ADDED }).map((_, i) => (
            <Card
              key={i}
              className={cn(
                "h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50",
                i > 0 && "-mt-px"
              )}
            />
          ))
        ) : items.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
            No recently added products or builds yet.
          </div>
        ) : (
          items.map((item, index) => (
            <FeedCard key={item.id} item={item} index={index} />
          ))
        )}
      </div>
    </section>
  )
}
