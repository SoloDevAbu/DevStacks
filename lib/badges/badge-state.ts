import {
  BADGE_CHECK,
  BADGE_CHECK_OUTCOME,
  type BadgeCheckOutcome,
} from "@/constants/badges"

export interface BadgeCheckUpdate {
  badgeCheckedAt: Date
  badgeVerified?: boolean
  badgeCheckFailures?: number
  badgeUrl?: string
}

export const getNextBadgeState = (
  currentFailures: number,
  outcome: BadgeCheckOutcome,
  checkedAt: Date
): BadgeCheckUpdate => {
  if (outcome === BADGE_CHECK_OUTCOME.INCONCLUSIVE) {
    return { badgeCheckedAt: checkedAt }
  }

  if (outcome === BADGE_CHECK_OUTCOME.ACTIVE) {
    return {
      badgeCheckedAt: checkedAt,
      badgeVerified: true,
      badgeCheckFailures: 0,
    }
  }

  const badgeCheckFailures = currentFailures + 1
  return {
    badgeCheckedAt: checkedAt,
    badgeCheckFailures,
    ...(badgeCheckFailures >= BADGE_CHECK.MAX_FAILURES
      ? { badgeVerified: false }
      : {}),
  }
}
