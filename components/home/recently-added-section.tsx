import { SectionHeader } from "@/components/shared/section-header"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { ROUTES } from "@/constants/routes"

interface RecentlyAddedSectionProps {
  items: FeedItem[]
}

export const RecentlyAddedSection = ({ items }: RecentlyAddedSectionProps) => {
  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Recently Added"
        subtitle="Latest products and tools added by the community"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER_RECENTLY_ADDED}
      />
      <div className="-mt-px flex flex-col">
        {items.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
            No recently added tools or products yet.
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
