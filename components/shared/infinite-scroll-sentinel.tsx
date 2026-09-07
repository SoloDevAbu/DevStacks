import { Loader2 } from "lucide-react"
import { infiniteScrollLoader, infiniteScrollEndMessage } from "@/utils/styles"

interface InfiniteScrollSentinelProps {
  sentinelRef: React.RefObject<HTMLDivElement | null>
  isFetchingNextPage: boolean
  hasNextPage: boolean
  hasItems: boolean
  endMessage?: string
}

export const InfiniteScrollSentinel = ({
  sentinelRef,
  isFetchingNextPage,
  hasNextPage,
  hasItems,
  endMessage = "You've reached the end of the list",
}: InfiniteScrollSentinelProps) => {
  return (
    <>
      <div ref={sentinelRef} className="h-4 w-full" />
      {isFetchingNextPage && (
        <div className={infiniteScrollLoader}>
          <Loader2 className="size-4 animate-spin text-slate-400" />
          <span>Loading more items...</span>
        </div>
      )}
      {!hasNextPage && hasItems && (
        <p className={infiniteScrollEndMessage}>{endMessage}</p>
      )}
    </>
  )
}
