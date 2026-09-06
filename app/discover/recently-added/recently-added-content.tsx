"use client"

import { Loader2 } from "lucide-react"
import { useRecentlyAdded } from "@/hooks/products/use-recently-added"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"

export const RecentlyAddedContent = () => {
  const { data, isLoading } = useRecentlyAdded({ limit: 30 })
  const items = (data ?? []) as FeedItem[]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading recently added products and builds...
        </p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        No recently added products or builds available yet.
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col pt-2 pb-8">
      {items.map((item, index) => (
        <FeedCard key={item.id} item={item} index={index} />
      ))}
    </div>
  )
}
