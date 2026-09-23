import { db } from "@/db"
import { launches } from "@/db/schema"
import { and, eq, ne, sql } from "drizzle-orm"
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import { getLaunchPromoStatus } from "./availability"
import { getISOWeekRange, getUpcomingLaunchWeeks } from "@/utils/iso-weeks"
import type { Tier } from "@/constants/plans"

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

  // Check promo status: first 50 submissions receive gifted Premium (unlimited slots)
  const promo = await getLaunchPromoStatus()
  let assignedTier: Tier = "free"

  if (tier && tier !== "free") {
    assignedTier = tier
  } else if (promo.isPromoActive) {
    assignedTier = "premium"
  } else {
    assignedTier = "free"
  }

  // If free tier, enforce 25-slot weekly limit
  if (assignedTier === "free") {
    const [booked] = await db
      .select({ count: sql<number>`count(${launches.id})::int` })
      .from(launches)
      .where(
        and(
          eq(launches.isoYear, targetYear),
          eq(launches.isoWeek, targetWeek),
          eq(launches.tier, "free"),
          ne(launches.status, "rejected")
        )
      )

    const bookedCount = booked?.count ?? 0
    if (bookedCount >= MAX_FREE_LAUNCHES_PER_WEEK) {
      throw new Error(
        `Free launch slots for Week ${targetWeek} are full (25/25 taken). Please select a later week or upgrade to Premium.`
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
