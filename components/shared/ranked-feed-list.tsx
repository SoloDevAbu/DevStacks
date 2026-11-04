"use client"

import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { RANKING_MODE, type RankingMode } from "@/constants/rankings"
import { useDebounce } from "@/hooks/shared/use-debounce"
import { useFlipList } from "@/hooks/shared/use-flip-list"
import { useUserInteractions } from "@/hooks/users/use-user-interactions"
import {
  calculatePopularScore,
  compareByCommunityVotes,
  compareByPopularScore,
} from "@/lib/rankings/compare"

// The count changes on click and the row moves just after, so it never slides away from under the
// pointer and a quick like then unlike leaves it where it was.
const RERANK_DELAY_MS = 400
const ID_SEPARATOR = ","

const RANKING_COMPARATORS = {
  [RANKING_MODE.COMMUNITY]: compareByCommunityVotes,
  [RANKING_MODE.POPULAR]: compareByPopularScore,
}

interface RankedFeedListProps {
  items: FeedItem[]
  mode: RankingMode
  showMedals?: boolean
}

export const RankedFeedList = ({
  items,
  mode,
  showMedals,
}: RankedFeedListProps) => {
  const { getProductLikes, getToolUpvotes } = useUserInteractions()

  const liveItems = items.map((item) => {
    if (item.itemKind === "product") {
      return {
        ...item,
        likesCount: getProductLikes(item.slug, item.likesCount),
      }
    }

    const upvotesCount = getToolUpvotes(item.slug, item.upvotesCount)
    return {
      ...item,
      upvotesCount,
      score: calculatePopularScore(
        item.buildsCount,
        upvotesCount,
        item.viewsCount
      ),
    }
  })

  const rankedIds = useDebounce(
    [...liveItems]
      .sort(RANKING_COMPARATORS[mode])
      .map(({ id }) => id)
      .join(ID_SEPARATOR),
    RERANK_DELAY_MS
  )
  const listRef = useFlipList<HTMLOListElement>(rankedIds)

  const ranks = new Map(
    rankedIds.split(ID_SEPARATOR).map((id, rank) => [id, rank])
  )
  const getRank = ({ id }: FeedItem) => ranks.get(id) ?? items.length
  const orderedItems = [...items].sort((a, b) => getRank(a) - getRank(b))

  return (
    <ol ref={listRef} className="flex flex-col">
      {orderedItems.map((item, index) => (
        <li key={item.id} data-flip-id={item.id}>
          <FeedCard item={item} index={index} showMedals={showMedals} />
        </li>
      ))}
    </ol>
  )
}
