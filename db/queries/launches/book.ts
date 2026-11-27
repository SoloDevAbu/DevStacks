import { countFreeLaunchesBooked } from "@/db/queries/launches/availability"
import { db } from "@/db"
import { launches } from "@/db/schema"
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import { getISOWeekRange, getUpcomingLaunchWeeks } from "@/utils/iso-weeks"
import { TIER, type Tier } from "@/constants/plans"

export interface LaunchSlotResolution {
  launchYear: number
  launchWeek: number
  startDate: Date
  endDate: Date
  tier: Tier
}

export const resolveAndValidateLaunchSlot = async ({
  launchYear,
  launchWeek,
  tier,
}: {
  launchYear?: number
  launchWeek?: number
  tier?: Tier
}): Promise<LaunchSlotResolution> => {
  let targetYear = launchYear
  let targetWeek = launchWeek

  if (!targetYear || !targetWeek) {
    const nextWeek = getUpcomingLaunchWeeks()[0]
    targetYear = nextWeek.isoYear
    targetWeek = nextWeek.isoWeek
  }

  const { startDate, endDate } = getISOWeekRange(targetYear, targetWeek)

  // Paid tiers come only from a verified payment; everything else launches free.
  const assignedTier: Tier = tier ?? TIER.FREE

  if (assignedTier === TIER.FREE) {
    const bookedCount = await countFreeLaunchesBooked(targetYear, targetWeek)
    if (bookedCount >= MAX_FREE_LAUNCHES_PER_WEEK) {
      throw new Error(
        `Free launch slots for Week ${targetWeek} are full (${MAX_FREE_LAUNCHES_PER_WEEK}/${MAX_FREE_LAUNCHES_PER_WEEK} taken). Please select a later week or upgrade to Premium.`
      )
    }
  }

  return {
    launchYear: targetYear,
    launchWeek: targetWeek,
    startDate,
    endDate,
    tier: assignedTier,
  }
}

export const recordLaunchEntry = async ({
  toolId,
  productId,
  submitterId,
  itemType,
  slot,
}: {
  toolId?: string
  productId?: string
  submitterId: string
  itemType: "tool" | "product"
  slot: LaunchSlotResolution
}) => {
  const [entry] = await db
    .insert(launches)
    .values({
      toolId: toolId ?? null,
      productId: productId ?? null,
      submitterId,
      itemType,
      isoYear: slot.launchYear,
      isoWeek: slot.launchWeek,
      startDate: slot.startDate,
      endDate: slot.endDate,
      tier: slot.tier,
      status: "pending",
      launchStatus: "scheduled",
    })
    .returning()

  return entry
}
