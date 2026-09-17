import { SectionHeader } from "@/components/shared/section-header"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { ROUTES } from "@/constants/routes"

interface TodaysLaunchesSectionProps {
  items: FeedItem[]
}

export const TodaysLaunchesSection = ({
  items,
}: TodaysLaunchesSectionProps) => {
  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Today's Launches"
        subtitle="Tools and products launched today, ranked by community votes"
        viewAllText="View all today's launches"
        viewAllHref={ROUTES.DISCOVER_DAILY_LAUNCHES}
      />
      <div className="-mt-px flex flex-col">
        {items.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-12 text-center">
            <p className="text-sm font-medium text-slate-400">
              No launches today yet.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Be the first to launch something!
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <FeedCard
              key={item.id}
              item={item}
              index={index}
              showMedals={true}
              showFreshnessBadge={true}
            />
          ))
        )}
      </div>
    </section>
  )
}
