import { POPULAR_BUILDING_BLOCKS_WEIGHTS } from "@/constants/rankings"
import type { RankedItem } from "@/lib/rankings/types"

// Shared by the database queries and the client list, so a re-rank after a vote gives the same
// order the next server render will.
const getCommunityScore = (item: RankedItem) =>
  item.itemKind === "tool" ? item.upvotesCount : item.likesCount

export const compareByCommunityVotes = (a: RankedItem, b: RankedItem) =>
  getCommunityScore(b) - getCommunityScore(a) ||
  b.commentsCount - a.commentsCount

export const calculatePopularScore = (
  buildsCount: number,
  upvotesCount: number,
  viewsCount: number
) => {
  const rawScore =
    buildsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.buildsWeight +
    upvotesCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.upvotesWeight +
    viewsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.viewsWeight
  return Math.round(rawScore * 10) / 10
}

const getCreatedTime = ({ createdAt }: RankedItem) =>
  createdAt ? new Date(createdAt).getTime() : 0

export const compareByPopularScore = (a: RankedItem, b: RankedItem) =>
  (b.score ?? 0) - (a.score ?? 0) || getCreatedTime(b) - getCreatedTime(a)
