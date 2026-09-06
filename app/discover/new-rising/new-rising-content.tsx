"use client"

import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"
import { useNewAndRising } from "@/hooks/home/use-new-and-rising"
import { Loader2 } from "lucide-react"

export const NewAndRisingContent = () => {
  const { data, isLoading } = useNewAndRising({ limit: 20 })
  const items = (data ?? []) as FeedItem[]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading new & rising tools and products...
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col pt-2 pb-8">
      <FeedList
        items={items}
        showMedals={true}
        showTrendingBadge={false}
        showFreshnessBadge={true}
        emptyTitle="No new submissions in the discovery window"
        emptyDescription="No developer tools or products are currently in their 7-day discovery window. Be the first to launch yours!"
      />
    </div>
  )
}
