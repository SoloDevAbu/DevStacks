import Link from "next/link"
import type { FeedItem } from "@/components/shared/feed-card"
import { RankedFeedList } from "@/components/shared/ranked-feed-list"
import { RANKING_MODE } from "@/constants/rankings"
import { ROUTES } from "@/constants/routes"
import { emptyStateBox } from "@/utils/styles"

interface LaunchWeekListProps {
  items: FeedItem[]
  emptyTitle?: string
}

export const LaunchWeekList = ({
  items,
  emptyTitle = "No launches this week yet.",
}: LaunchWeekListProps) =>
  items.length === 0 ? (
    <div className={emptyStateBox}>
      <p className="text-sm font-medium text-slate-400">{emptyTitle}</p>
      <p className="mt-1 text-xs text-slate-400">
        <Link
          href={ROUTES.SUBMIT}
          className="underline underline-offset-2 hover:text-slate-600"
        >
          Launch your product
        </Link>{" "}
        to be featured here.
      </p>
    </div>
  ) : (
    <RankedFeedList items={items} mode={RANKING_MODE.COMMUNITY} showMedals />
  )
