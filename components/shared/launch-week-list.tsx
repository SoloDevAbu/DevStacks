import Link from "next/link"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
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
    <ol className="flex flex-col">
      {items.map((item, index) => (
        <li key={item.id}>
          <FeedCard
            item={item}
            index={index}
            showMedals={true}
            showFreshnessBadge={false}
          />
        </li>
      ))}
    </ol>
  )
