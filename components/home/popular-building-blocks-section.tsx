"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/shared/section-header"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { usePopularBuildingBlocks } from "@/hooks/home/use-popular-building-blocks"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"

export const PopularBuildingBlocksSection = () => {
  const { data, isLoading } = usePopularBuildingBlocks({
    limit: HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS,
  })

  const items = (data ?? []) as FeedItem[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Popular Building Blocks"
        subtitle="The tools developers are building with"
        viewAllText="View all tools"
        viewAllHref={ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS}
      />
      <div className="-mt-px flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS }).map(
            (_, i) => (
              <Card
                key={i}
                className={cn(
                  "h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50",
                  i > 0 && "-mt-px"
                )}
              />
            )
          )
        ) : items.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
            No building blocks available yet.
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
