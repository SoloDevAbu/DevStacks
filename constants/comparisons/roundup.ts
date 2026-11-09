import type { PlatformComparison, RoundupEntry } from "@/types/comparison"
import {
  LAUNCHNESTS_FACTS,
  LAUNCHNESTS_PROFILE,
} from "@/constants/comparisons/launchnests"
import { PRODUCT_HUNT_COMPARISON } from "@/constants/comparisons/product-hunt"
import { DEVHUNT_COMPARISON } from "@/constants/comparisons/devhunt"
import { UNEED_COMPARISON } from "@/constants/comparisons/uneed"
import { BETALIST_COMPARISON } from "@/constants/comparisons/betalist"
import { CODEHYPE_COMPARISON } from "@/constants/comparisons/codehype"
import { MICROLAUNCH_COMPARISON } from "@/constants/comparisons/microlaunch"

const fromComparison = (
  comparison: PlatformComparison,
  entry: Pick<
    RoundupEntry,
    "bestFor" | "verdict" | "cost" | "launchWindow" | "freeLink"
  >
): RoundupEntry => ({
  ...entry,
  name: comparison.comparedPlatformName,
  websiteUrl: comparison.comparedPlatformProfile.websiteUrl,
  comparisonPath: comparison.routePath,
  strengths: comparison.comparedPlatformProfile.keyStrengths,
  limitations: comparison.comparedPlatformProfile.keyLimitations,
})

export const ROUNDUP_CRITERIA = [
  "How well the audience matches a developer tool or technical SaaS",
  "What a useful launch costs, including whether a free listing gets a dofollow link",
  "How large an audience the site reports",
] as const

// Ranked for launching a developer tool, by the criteria above. LaunchNests is ranked where we
// think it honestly belongs, not first.
export const PRODUCT_HUNT_ALTERNATIVES: readonly RoundupEntry[] = [
  fromComparison(DEVHUNT_COMPARISON, {
    bestFor: "Developer tools that want a developer-only audience",
    verdict:
      "The closest match to Product Hunt for dev tools: weekly launches, a large developer audience and a newsletter for winners. Free listings are nofollow, so budget $49 if the link matters.",
    cost: "Free; $49 paid launch",
    launchWindow: "One week",
    freeLink: "No (nofollow)",
  }),
  fromComparison(UNEED_COMPARISON, {
    bestFor: "Makers who can plan ahead and bring voters",
    verdict:
      "A large maker audience and a well-run leaderboard. The free line takes 50+ days and needs an upvote score of 20 for a dofollow link; $14.99 or $39.99 gets you in sooner.",
    cost: "Free (50+ day wait); $14.99 / $39.99",
    launchWindow: "Launch day, then rolling leaderboards",
    freeLink: "Upvote score of 20+",
  }),
  {
    name: LAUNCHNESTS_PROFILE.name,
    websiteUrl: LAUNCHNESTS_PROFILE.websiteUrl,
    bestFor: "Dev tools and products built with them, on a small budget",
    verdict:
      "Our own site, so weigh this accordingly. Free launches go into the next open week, a free listing is dofollow while our badge stays on your site, and products link to the tools they're built with. The audience is still small.",
    cost: LAUNCHNESTS_FACTS.cost,
    launchWindow: "One week, then a permanent listing",
    freeLink: "While the badge is live",
    strengths: LAUNCHNESTS_PROFILE.keyStrengths,
    limitations: LAUNCHNESTS_PROFILE.keyLimitations,
  },
  fromComparison(BETALIST_COMPARISON, {
    bestFor: "New startups building a waitlist",
    verdict:
      "The best pick for early adopters before launch, with a large newsletter. Every submission is paid (refunded if you're not selected), and editors choose around 20 startups a day.",
    cost: "Paid only, refunded if not selected",
    launchWindow: "Curated feature, up to twice",
    freeLink: "No free option; dofollow if featured",
  }),
  fromComparison(CODEHYPE_COMPARISON, {
    bestFor: "AI tools and SaaS with a broad audience",
    verdict:
      "Pricing and link model similar to ours, with a 14-day free queue and a large social following. Better suited to AI and consumer SaaS than to developer tools.",
    cost: "Free (14-day queue); $15 / $25",
    launchWindow: "One week",
    freeLink: "While the badge is verified",
  }),
  fromComparison(MICROLAUNCH_COMPARISON, {
    bestFor: "Startups that want a 30-day push with marketing extras",
    verdict:
      "A longer launch window and bundled boosts, reviews and directory submissions. The plans shown are paid ($39-$149), so it costs the most of this list for a useful launch.",
    cost: "$39 / $79 / $149",
    launchWindow: "30 days",
    freeLink: "Not stated for free launches",
  }),
]

export const PRODUCT_HUNT_REFERENCE: RoundupEntry = fromComparison(
  PRODUCT_HUNT_COMPARISON,
  {
    bestFor: "Products with an audience ready for one big launch day",
    verdict:
      "Still the largest launch site. Launching is free, but the team picks which launches are featured, and each launch lasts one Pacific-time day.",
    cost: "Free",
    launchWindow: "One day",
    freeLink: "Not stated",
  }
)
