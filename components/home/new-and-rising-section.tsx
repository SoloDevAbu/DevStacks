import { SectionHeader } from "@/components/shared/section-header"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { ROUTES } from "@/constants/routes"

interface NewAndRisingSectionProps {
  items: FeedItem[]
}

export const NewAndRisingSection = ({ items }: NewAndRisingSectionProps) => {
  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="New & Rising"
        subtitle="Recently added tools and products gaining attention"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER_NEW_RISING}
      />
      <div className="-mt-px flex flex-col">
        {items.length === 0 ? (
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
