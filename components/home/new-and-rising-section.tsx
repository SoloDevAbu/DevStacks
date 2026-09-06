"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/shared/section-header"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { useNewAndRising } from "@/hooks/home/use-new-and-rising"

export const NewAndRisingSection = () => {
  const { data, isLoading } = useNewAndRising({
    limit: HOMEPAGE_LIMITS.NEW_AND_RISING,
  })
  const items = (data ?? []) as FeedItem[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="New & Rising"
        subtitle="Recently added tools and products gaining attention"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER_NEW_RISING}
      />
      <div className="-mt-px flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.NEW_AND_RISING }).map((_, i) => (
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
            No newly submitted products in the discovery window yet. Be the
            first to launch!
          </div>
        ) : (
          items.map((item, index) => (
            <FeedCard
              key={item.id}
              item={item}
              index={index}
              showMedals={true}
              showTrendingBadge={false}
              showFreshnessBadge={true}
            />
          ))
        )}
      </div>
    </section>
  )
}
