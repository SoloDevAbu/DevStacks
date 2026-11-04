import { SectionHeader } from "@/components/shared/section-header"
import type { FeedItem } from "@/components/shared/feed-card"
import { RankedFeedList } from "@/components/shared/ranked-feed-list"
import { RANKING_MODE } from "@/constants/rankings"
import { ROUTES } from "@/constants/routes"

interface PopularBuildingBlocksSectionProps {
  items: FeedItem[]
}

export const PopularBuildingBlocksSection = ({
  items,
}: PopularBuildingBlocksSectionProps) => {
  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Popular Building Blocks"
        subtitle="The tools developers are building with"
        viewAllText="View all tools"
        viewAllHref={ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS}
      />
      <div className="-mt-px flex flex-col">
        {items.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
            No building blocks available yet.
          </div>
        ) : (
          <RankedFeedList items={items} mode={RANKING_MODE.POPULAR} />
        )}
      </div>
    </section>
  )
}
