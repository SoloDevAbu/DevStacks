import type { PlatformComparison } from "@/types/comparison"
import { SITE_CONFIG } from "@/constants/site"
import {
  COMPARISON_FACTS_CHECKED_ON,
  LAUNCHNESTS_ANGLES,
  LAUNCHNESTS_FACTS,
  LAUNCHNESTS_PROFILE,
} from "@/constants/comparisons/launchnests"

export const MICROLAUNCH_COMPARISON: PlatformComparison = {
  slug: "microlaunch",
  routePath: "/microlaunch-alternative",
  targetKeyword: "MicroLaunch alternative",
  name: "MicroLaunch Alternative",
  comparedPlatformName: "MicroLaunch",
  metaTitle:
    "MicroLaunch Alternative: LaunchNests vs MicroLaunch (30-Day Launches)",
  metaDescription:
    "MicroLaunch runs 30-day launches with paid plans from $39 to $149. How its launch format, pricing and links compare with LaunchNests, sourced from MicroLaunch's own pages.",
  keywords: [
    "MicroLaunch alternative",
    "alternatives to MicroLaunch",
    "MicroLaunch vs LaunchNests",
    "sites like MicroLaunch",
    "MicroLaunch pricing",
    "where to launch software products",
  ],
  canonicalUrl: `${SITE_CONFIG.url}/microlaunch-alternative`,
  factsCheckedOn: COMPARISON_FACTS_CHECKED_ON,
  sources: [
    {
      label: "MicroLaunch: Submit and plans",
      url: "https://microlaunch.net/submit",
    },
    { label: "MicroLaunch: Home", url: "https://microlaunch.net" },
  ],
  heroBadge: "Comparison guide",
  heroTitle: "MicroLaunch Alternative for Developer Tools and Software",
  heroDescription:
    "MicroLaunch gives each launch 30 days of visibility and a monthly leaderboard, and sells launch plans from $39 to $149 plus a $299 product review. LaunchNests is a smaller, developer-focused site with week-long launches, a free plan and one-time plans of $15 and $19.",
  comparedPlatformProfile: {
    name: "MicroLaunch",
    tagline: "Get reviews, exposure and first sales over 30 days",
    websiteUrl: "https://microlaunch.net",
    primaryAudience:
      "Startup founders and early adopters looking for new products.",
    discoveryLifespan:
      "30 days of continuous visibility per launch, with monthly rankings.",
    pricingModel:
      "Launch Pro $39, Launch Plus $79, Launch Everywhere $149 (includes submission to 50 directories), Product Review & GTM Plan $299. Prices shown as discounted from $49 / $99 / $199. Free terms aren't stated on the pages we checked.",
    keyStrengths: [
      "Each launch gets 30 days of visibility instead of one day",
      "Paid plans add reviews, boosts and extra SEO pages",
      "Launch Everywhere bundles submission to 50 other directories",
      "MicroLaunch states 30k+ unique visitors a month",
    ],
    keyLimitations: [
      "Free launch terms aren't spelled out on its submit page; the plans shown there are paid",
      "Re-launching is for major feature releases only",
    ],
  },
  launchNestsProfile: LAUNCHNESTS_PROFILE,
  quickComparisonDimensions: [
    {
      key: "cost",
      label: "Paid plans",
      competitorValue: "$39, $79 or $149 per launch; $299 review",
      launchNestsValue: LAUNCHNESTS_FACTS.cost,
    },
    {
      key: "window",
      label: "Launch window",
      competitorValue: "30 days, monthly rankings",
      launchNestsValue: LAUNCHNESTS_FACTS.launchFormat,
    },
    {
      key: "scheduling",
      label: "Choosing your date",
      competitorValue: "Launch anytime on Launch Pro and above",
      launchNestsValue: LAUNCHNESTS_FACTS.paidScheduling,
    },
    {
      key: "links",
      label: "Dofollow link",
      competitorValue: "Listed on Launch Pro and Launch Everywhere",
      launchNestsValue: LAUNCHNESTS_FACTS.linkPolicy,
    },
    {
      key: "extras",
      label: "Extras",
      competitorValue: "Boosts, SEO pages, reviews, directory submissions",
      launchNestsValue:
        "AI-written launch profile and priority placement on Premium",
    },
    {
      key: "techstack",
      label: "Tech-stack links",
      competitorValue: "Not part of the launch format",
      launchNestsValue: LAUNCHNESTS_FACTS.techStack,
    },
    {
      key: "audience",
      label: "Audience (self-reported)",
      competitorValue: "30k+ unique visitors a month",
      launchNestsValue: LAUNCHNESTS_FACTS.audience,
    },
  ],
  deepDives: [
    {
      id: "launch-window",
      title: "30-day launches vs week-long launches",
      subtitle: "How long a launch stays in front of visitors",
      competitorAngle:
        "MicroLaunch says it helps you get reviews, exposure and first sales over 30 days, with a monthly leaderboard. Launch Pro and above let you launch on a date you choose; re-launching is reserved for major feature releases.",
      launchNestsAngle:
        "A LaunchNests launch runs for a week on the homepage and ranks by votes that week. Afterwards the listing stays on its category, tech-stack and maker pages.",
      practicalTakeaway:
        "MicroLaunch gives a longer launch window; LaunchNests gives a shorter launch and a listing that stays afterwards.",
    },
    {
      id: "pricing",
      title: "Pricing side by side",
      subtitle: "What each plan includes",
      competitorAngle:
        "Launch Pro ($39) includes choosing your date, featured spots with two boosts, extra SEO pages, a marketplace spot, verified reviews and a dofollow link. Launch Plus ($79) adds more SEO pages, automated boosts and social mentions. Launch Everywhere ($149) adds submission to 50 launch and SaaS directories. A Product Review & GTM Plan costs $299.",
      launchNestsAngle:
        "LaunchNests is free to launch. Premium ($15 one-time) adds choosing any upcoming week, a permanent dofollow link, priority placement and an AI-written launch profile. Premium+ ($19) adds top placement across directory pages.",
      practicalTakeaway:
        "MicroLaunch bundles more marketing services at a higher price. LaunchNests is cheaper and does less.",
    },
    {
      id: "tech-stack",
      title: "Launch listings vs tech-stack links",
      subtitle: "Discovery after the launch",
      competitorAngle:
        "MicroLaunch organises launches by date and ranking. Its launch format doesn't connect a product to the developer tools it is built with.",
      launchNestsAngle: LAUNCHNESTS_ANGLES.techStack,
      practicalTakeaway:
        "For developer products, being listed on your tools' pages keeps bringing in relevant visitors.",
    },
  ],
  scenarios: [
    {
      id: "choose-microlaunch",
      title: "When MicroLaunch is the better choice",
      badge: "30 days",
      badgeVariant: "hot",
      recommendedFor:
        "Startups that want a month-long push with marketing extras",
      explanation:
        "MicroLaunch's paid plans bundle a longer launch with reviews, boosts and directory submissions.",
      bulletPoints: [
        "You want 30 days of visibility",
        "You'd rather pay for bundled boosts and directory submissions",
        "Your product is aimed at a general startup audience",
      ],
    },
    {
      id: "choose-launchnests",
      title: "When LaunchNests is the better choice",
      badge: "Developers",
      badgeVariant: "new",
      recommendedFor: "Dev tools, APIs and technical SaaS on a small budget",
      explanation:
        "LaunchNests is free or $15-$19 once, and focused on developer products.",
      bulletPoints: [
        "You want to launch free, or pay a one-time $15",
        "You want your product linked from the pages of the tools it is built with",
        "You want a listing with no vote minimum",
      ],
    },
    {
      id: "choose-both",
      title: "Use both",
      badge: "Both",
      badgeVariant: "neutral",
      recommendedFor: "Founders listing on several sites",
      explanation: "The two can run at the same time.",
      bulletPoints: [
        "List on LaunchNests for the developer audience and stack links",
        "Use MicroLaunch's 30-day window for a longer general push",
      ],
    },
  ],
  canYouUseBoth: {
    heading: "Using MicroLaunch and LaunchNests together",
    subheading: "Overlap the launches",
    description:
      "A MicroLaunch launch lasts 30 days, so a LaunchNests week can sit inside it:",
    strategySteps: [
      {
        stepNumber: 1,
        title: "Pick your MicroLaunch date",
        timing: "Before launch",
        action: "Choose a MicroLaunch plan and launch date.",
        outcome: "A 30-day launch window.",
      },
      {
        stepNumber: 2,
        title: "Launch on LaunchNests in the same window",
        timing: "During the 30 days",
        action:
          "Submit to LaunchNests for a week inside that window and list the tools your product is built with.",
        outcome: "A second audience during the same period.",
      },
    ],
    summary:
      "MicroLaunch for a longer paid push; LaunchNests for a developer listing that stays up.",
  },
  faqs: [
    {
      question: "How much does MicroLaunch cost?",
      answer:
        "MicroLaunch's submit page lists Launch Pro at $39, Launch Plus at $79 and Launch Everywhere at $149, shown as discounts from $49, $99 and $199. A Product Review & GTM Plan costs $299. We couldn't find free launch terms on the pages we checked.",
    },
    {
      question: "How long does a MicroLaunch launch last?",
      answer:
        "MicroLaunch says a launch gets 30 days of continuous visibility, and its leaderboard ranks products monthly.",
    },
    {
      question: "Does MicroLaunch give a dofollow link?",
      answer:
        "Its Launch Pro plan lists dofollow backlinks, and Launch Everywhere lists dofollow backlinks from its directory submissions. We didn't find a stated link policy for free launches.",
    },
    {
      question: "How is LaunchNests different from MicroLaunch?",
      answer:
        "LaunchNests is free to launch, with one-time plans of $15 and $19; launches last a week rather than 30 days; listings stay up with no vote minimum; and products link to the tools they are built with. MicroLaunch offers a longer launch and more bundled marketing services, and has a larger audience.",
    },
  ],
}
