export const BADGE_STYLE = {
  CARD: "card",
  DARK: "dark",
  RANKED: "ranked",
  SHIELD: "shield",
} as const

export type BadgeStyle = (typeof BADGE_STYLE)[keyof typeof BADGE_STYLE]

export const BADGE_STYLE_OPTIONS: ReadonlyArray<{
  value: BadgeStyle
  label: string
}> = [
  { value: BADGE_STYLE.CARD, label: "Light Card" },
  { value: BADGE_STYLE.DARK, label: "Dark Card" },
  { value: BADGE_STYLE.RANKED, label: "Weekly Rank" },
  { value: BADGE_STYLE.SHIELD, label: "GitHub Shield" },
]

// Matched against the scheduled event in worker.ts, so it must stay identical to the entry in
// wrangler.jsonc. The job runs daily and only picks up listings past INTERVAL_DAYS, which spreads
// the outbound fetches instead of checking every badge in one run.
export const BADGE_CHECK_CRON = "0 3 * * *"

export const BADGE_CHECK = {
  INTERVAL_DAYS: 7,
  BATCH_SIZE: 40,
  CONCURRENCY: 5,
  MAX_FAILURES: 2,
  TIMEOUT_MS: 8000,
  USER_AGENT:
    "Mozilla/5.0 (compatible; LaunchNests-BadgeBot/1.0; +https://www.launchnests.com)",
} as const

export const BADGE_TOP_PLACEMENTS = 3

export const BADGE_CHECK_OUTCOME = {
  ACTIVE: "active",
  NOT_FOLLOWED: "not_followed",
  MISSING: "missing",
  WRONG_SITE: "wrong_site",
  INCONCLUSIVE: "inconclusive",
} as const

export type BadgeCheckOutcome =
  (typeof BADGE_CHECK_OUTCOME)[keyof typeof BADGE_CHECK_OUTCOME]

export const BADGE_CHECK_MESSAGES: Record<BadgeCheckOutcome, string> = {
  active: "Badge verified. Your Visit link is now Do-Follow.",
  not_followed:
    "We found the link, but it is marked nofollow, ugc or sponsored, or the page blocks crawlers. Remove that and try again.",
  missing:
    "We could not find a link to your listing in that page's HTML. Publish the snippet and try again.",
  wrong_site: "The badge must be on the website set on your listing.",
  inconclusive:
    "Your site blocked our check or did not respond. Allow LaunchNests-BadgeBot and try again.",
}

export const BADGE_SHIELD_NOTE =
  "GitHub marks README links as nofollow, so the shield does not make your Visit link Do-Follow. Use a card badge on your website for that."

export const BADGE_NOTICE = {
  ACTIVE: {
    tone: "active",
    title: "Badge active",
    body: "Your Visit link is Do-Follow. We re-check your page every week.",
    action: "View badge",
  },
  AT_RISK: {
    tone: "warning",
    title: "Badge not found",
    body: "Your last weekly check failed. Restore the badge before the next check, or your Visit link goes back to nofollow.",
    action: "Check again",
  },
  LOST: {
    tone: "warning",
    title: "Badge removed",
    body: "We could not find your badge on two weekly checks, so your Visit link is nofollow again. Add it back to restore Do-Follow.",
    action: "Get badge",
  },
  AVAILABLE: {
    tone: "available",
    title: "Your Visit link is nofollow",
    body: "Add the LaunchNests badge to your website to make it Do-Follow while the badge stays live.",
    action: "Get badge",
  },
} as const
