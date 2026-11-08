import { BADGE_TOP_PLACEMENTS } from "@/constants/badges"
import { getCachedWeeklyLaunches } from "@/lib/launches/weekly-launches"
import { getCommunityScore } from "@/lib/rankings/compare"
import { getListingLaunchWeek, isCompletedWeek } from "@/utils/iso-weeks"

export interface WeeklyPlacement {
  rank: number
  year: number
  week: number
}

// Only a finished week counts, and a listing needs at least one vote, so a quiet week's zero-vote
// launches can't claim a podium spot.
export const getWeeklyPlacement = async (listing: {
  id: string
  launchYear?: number | null
  launchWeek?: number | null
  createdAt?: Date | string | null
}): Promise<WeeklyPlacement | null> => {
  const launchWeek = getListingLaunchWeek(listing)
  if (!launchWeek || !isCompletedWeek(launchWeek.year, launchWeek.week)) {
    return null
  }

  const topLaunches = await getCachedWeeklyLaunches(
    launchWeek.year,
    launchWeek.week,
    BADGE_TOP_PLACEMENTS
  )
  const index = topLaunches.findIndex(
    (item) => item.id === listing.id && getCommunityScore(item) > 0
  )

  return index === -1 ? null : { rank: index + 1, ...launchWeek }
}

export const getPlacementLabel = ({ rank, year, week }: WeeklyPlacement) =>
  rank === 1
    ? `WEEKLY WINNER · W${week} ${year}`
    : `#${rank} OF WEEK ${week} · ${year}`
