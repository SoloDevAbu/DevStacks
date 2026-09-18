import { SectionHeader } from "@/components/shared/section-header"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { ROUTES } from "@/constants/routes"

interface WeeklyLaunchesSectionProps {
  initialItems: FeedItem[]
}

export const WeeklyLaunchesSection = ({
  initialItems,
}: WeeklyLaunchesSectionProps) => {
  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="This Week's Launches"
        subtitle="Top tools and products launched this week, ranked by community votes"
        viewAllText="Browse by week"
        viewAllHref={ROUTES.DISCOVER_WEEKLY_LAUNCHES}
      />
      <div className="-mt-px flex flex-col">
        {initialItems.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-12 text-center">
            <p className="text-sm font-medium text-slate-400">
              No launches this week yet.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Be the first to launch something!
            </p>
          </div>
        ) : (
          initialItems.map((item, index) => (
            <FeedCard
              key={item.id}
              item={item}
              index={index}
              showMedals={true}
              showFreshnessBadge={false}
            />
          ))
        )}
      </div>
    </section>
  )
}
