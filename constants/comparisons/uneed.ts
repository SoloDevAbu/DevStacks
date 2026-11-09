import type { PlatformComparison } from "@/types/comparison"
import { SITE_CONFIG } from "@/constants/site"
import {
  COMPARISON_FACTS_CHECKED_ON,
  LAUNCHNESTS_ANGLES,
  LAUNCHNESTS_FACTS,
  LAUNCHNESTS_PROFILE,
} from "@/constants/comparisons/launchnests"
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"

export const UNEED_COMPARISON: PlatformComparison = {
  slug: "uneed",
  routePath: "/uneed-alternative",
  targetKeyword: "Uneed alternative",
  name: "Uneed Alternative",
  comparedPlatformName: "Uneed",
  metaTitle: "Uneed Alternative: LaunchNests vs Uneed (Queue, Votes, Pricing)",
  metaDescription:
    "Uneed's free line launches you at least 50 days out and needs an upvote score of 10 to stay published. How that compares with LaunchNests, with Uneed's own pages as sources.",
  keywords: [
    "Uneed alternative",
    "alternatives to Uneed",
    "Uneed vs LaunchNests",
    "sites like Uneed",
    "Uneed waiting line",
    "indie hacker launch platforms",
    "where to launch software products",
  ],
  canonicalUrl: `${SITE_CONFIG.url}/uneed-alternative`,
  factsCheckedOn: COMPARISON_FACTS_CHECKED_ON,
  sources: [
    { label: "Uneed: Pricing", url: "https://www.uneed.best/pricing" },
    {
      label: "Uneed: How it works",
      url: "https://www.uneed.best/how-it-works",
    },
    { label: "Uneed: Home", url: "https://www.uneed.best" },
  ],
  heroBadge: "Comparison guide",
  heroTitle: "Uneed Alternative for Developer Tools and Software",
  heroDescription:
    "Uneed is an established launch site for makers, with daily, weekly, monthly and yearly leaderboards. Its free line is moderated and assigns a launch date at least 50 days out. LaunchNests is a smaller, developer-focused site where free launches go into the next open week and stay listed without a vote minimum.",
  comparedPlatformProfile: {
    name: "Uneed",
    tagline: "Launch site and tool directory for makers",
    websiteUrl: "https://www.uneed.best",
    primaryAudience:
      "Makers, indie founders and people looking for new tools, across development, design, marketing and business.",
    discoveryLifespan:
      "Launch day, plus rolling leaderboards for the day, week (last 7 days), month (last 30 days) and year. Product pages stay on Uneed permanently.",
    pricingModel:
      "Free line (launch date at least 50 days out). Fast-track $14.99 (slot in about 14 days). Skip the line $39.99 (choose your date). Relaunch $15. Uneed Pro $99/year or $149 lifetime. Extra services such as newsletter sponsoring ($249) and directory submission ($249).",
    keyStrengths: [
      "Large maker audience: Uneed states 125K monthly visitors and a 30,000+ subscriber newsletter",
      "Podium badges for the top three, and the top three products are featured in the weekly newsletter",
      "Removes votes from batches of new accounts or a single IP",
      "Paid launches are never declined and get a dofollow link for life",
    ],
    keyLimitations: [
      "The free line assigns a date at least 50 days out",
      "Free submissions can be declined, often because the category is crowded",
      "Free launches need an upvote score of 10 to stay published and 20 for a dofollow link",
      "Uneed Pro members get a +3 vote multiplier",
    ],
  },
  launchNestsProfile: LAUNCHNESTS_PROFILE,
  quickComparisonDimensions: [
    {
      key: "cost",
      label: "Cost to launch",
      competitorValue: "Free line, or $14.99 / $39.99 to launch sooner",
      launchNestsValue: LAUNCHNESTS_FACTS.cost,
    },
    {
      key: "queue",
      label: "Free launch date",
      competitorValue: "Assigned, at least 50 days out",
      launchNestsValue: LAUNCHNESTS_FACTS.freeQueue,
    },
    {
      key: "paidscheduling",
      label: "Choosing your date",
      competitorValue: "Skip the line, $39.99",
      launchNestsValue: LAUNCHNESTS_FACTS.paidScheduling,
    },
    {
      key: "retention",
      label: "Staying listed (free)",
      competitorValue: "Upvote score of 10 or more on launch day",
      launchNestsValue: LAUNCHNESTS_FACTS.retention,
    },
    {
      key: "freelink",
      label: "Dofollow link (free)",
      competitorValue: "Upvote score of 20 or more",
      launchNestsValue: LAUNCHNESTS_FACTS.freeLink,
    },
    {
      key: "paidlink",
      label: "Dofollow link (paid)",
      competitorValue: "For life on Skip the line, Relaunch and Pro launches",
      launchNestsValue: LAUNCHNESTS_FACTS.paidLink,
    },
    {
      key: "subscription",
      label: "Membership",
      competitorValue:
        "Uneed Pro: $99/year or $149 lifetime, +3 vote multiplier",
      launchNestsValue: LAUNCHNESTS_FACTS.subscription,
    },
    {
      key: "audience",
      label: "Audience (self-reported)",
      competitorValue: "125K monthly visitors; 30,000+ newsletter subscribers",
      launchNestsValue: LAUNCHNESTS_FACTS.audience,
    },
    {
      key: "focus",
      label: "What it lists",
      competitorValue:
        "Tools across development, design, marketing, business and more",
      launchNestsValue: LAUNCHNESTS_FACTS.focus,
    },
  ],
  deepDives: [
    {
      id: "waiting-line",
      title: "Waiting line vs next open week",
      subtitle: "When a free launch actually happens",
      competitorAngle:
        "Uneed's free option is a waiting line: Uneed assigns your launch date, at least 50 days out, and launches up to 50 free products a day alongside every paid launch. Free submissions are moderated and can be declined. Fast-track ($14.99) gets a slot in about 14 days, and Skip the line ($39.99) lets you choose the date.",
      launchNestsAngle: `LaunchNests has ${MAX_FREE_LAUNCHES_PER_WEEK} free launch slots each week. When you submit you choose from the upcoming weeks that still have free slots, and Premium lets you pick any upcoming week. Every submission is reviewed before it goes live.`,
      practicalTakeaway:
        "If you're launching months from now, Uneed's free line costs nothing but time. If your product is ready now, the wait is the main difference.",
    },
    {
      id: "vote-thresholds",
      title: "Upvote thresholds vs no minimum",
      subtitle: "What happens after launch day",
      competitorAngle:
        "On Uneed's free line, an upvote score of 20 or more earns a dofollow link, 10 to 19 keeps the product published with a nofollow link, and below 10 the product is removed from the line. Fast-track launches get a dofollow link from a score of 10. Skip the line, Relaunch and Pro launches get a dofollow link for life with no minimum.",
      launchNestsAngle: `${LAUNCHNESTS_ANGLES.retention} Free listings are nofollow by default and dofollow while the LaunchNests badge stays on your site; paid listings are dofollow permanently.`,
      practicalTakeaway:
        "Uneed's thresholds reward makers who can bring voters. On LaunchNests the free dofollow link depends on keeping the badge on your site, not on votes.",
    },
    {
      id: "tech-stack",
      title: "Tool listings vs tech-stack links",
      subtitle: "Discovery after the launch",
      competitorAngle:
        "Uneed lists products by category (development, design, marketing, business and others) with rolling leaderboards. Its listings don't connect a product to the developer tools it is built with.",
      launchNestsAngle: LAUNCHNESTS_ANGLES.techStack,
      practicalTakeaway:
        "For developer products, being listed on the pages of the tools you use is a source of discovery that lasts beyond the launch.",
    },
    {
      id: "pricing",
      title: "Pricing side by side",
      subtitle: "What each option costs",
      competitorAngle:
        "Uneed: free line; Fast-track $14.99; Skip the line $39.99; Relaunch $15; Uneed Pro $99/year or $149 lifetime (includes a +3 vote multiplier, one free relaunch a month and five Skip the line launches on the lifetime plan). Uneed also sells newsletter sponsoring ($249), directory submission ($249), public reviews ($147) and ad spots.",
      launchNestsAngle:
        "LaunchNests: free; Premium $15 one-time (choose any upcoming week, permanent dofollow link, priority placement and an AI-written launch profile); Premium+ $19 one-time (top placement across directory pages). There is no subscription.",
      practicalTakeaway:
        "Uneed has more paid options and a larger audience to sell to. LaunchNests is cheaper and simpler, with a far smaller audience.",
    },
  ],
  scenarios: [
    {
      id: "choose-uneed",
      title: "When Uneed is the better choice",
      badge: "Makers",
      badgeVariant: "hot",
      recommendedFor: "Products with a maker audience and time to wait",
      explanation:
        "Uneed has a much larger audience and a busy community, and its free line is a good deal if you plan ahead.",
      bulletPoints: [
        "You can wait 50+ days for a free launch, or pay $14.99 / $39.99 to go sooner",
        "You can bring enough voters to reach the 10 and 20 upvote thresholds",
        "Your product isn't only for developers",
        "You want a shot at the weekly newsletter's top three",
      ],
    },
    {
      id: "choose-launchnests",
      title: "When LaunchNests is the better choice",
      badge: "Developers",
      badgeVariant: "new",
      recommendedFor: "Dev tools, APIs and technical SaaS",
      explanation:
        "LaunchNests suits developer products that are ready now and want a listing that doesn't depend on votes.",
      bulletPoints: [
        "You want to launch in the next open week",
        "You don't want your listing to depend on upvote thresholds",
        "You want your product linked from the pages of the tools it is built with",
      ],
    },
    {
      id: "choose-both",
      title: "Use both",
      badge: "Both",
      badgeVariant: "neutral",
      recommendedFor: "Most software launches",
      explanation:
        "Join Uneed's line early and list on LaunchNests while you wait.",
      bulletPoints: [
        "Submit to Uneed's free line as early as possible",
        "List on LaunchNests in the meantime",
        "Prepare your audience for your Uneed launch date",
      ],
    },
  ],
  canYouUseBoth: {
    heading: "Using Uneed and LaunchNests together",
    subheading: "Use the wait for Uneed's free line",
    description:
      "Because Uneed's free line assigns a date at least 50 days out, there is time to list elsewhere first. Here is one way to sequence them:",
    strategySteps: [
      {
        stepNumber: 1,
        title: "Join Uneed's free line",
        timing: "As early as possible",
        action:
          "Submit to Uneed's free line, or pay for Fast-track or Skip the line if you need a date sooner.",
        outcome: "Your Uneed launch date is set.",
      },
      {
        stepNumber: 2,
        title: "List on LaunchNests",
        timing: "While you wait",
        action:
          "Submit to LaunchNests, list the tools your product is built with, and add the badge to your site for a dofollow link on the free plan.",
        outcome: "A developer listing that's live during the wait.",
      },
      {
        stepNumber: 3,
        title: "Launch on Uneed",
        timing: "Your Uneed date",
        action:
          "Point your audience to your Uneed launch to clear the upvote thresholds.",
        outcome:
          "Your Uneed launch, with the LaunchNests listing already in place.",
      },
    ],
    summary:
      "Uneed for its maker audience and leaderboards; LaunchNests as a developer listing that doesn't depend on votes.",
  },
  faqs: [
    {
      question: "Is Uneed free?",
      answer:
        "Yes. Uneed's free option is its waiting line: Uneed assigns your launch date, at least 50 days out. Free submissions are moderated and can be declined. Fast-track ($14.99) gets a slot in about 14 days, and Skip the line ($39.99) lets you choose your date.",
    },
    {
      question:
        "What happens if my product doesn't get enough upvotes on Uneed?",
      answer:
        "On the free line, an upvote score below 10 removes the product from the line, 10 to 19 keeps it published with a nofollow link, and 20 or more earns a dofollow link. Uneed applies this the day after your launch day. Skip the line, Relaunch and Pro launches have no minimum and get a dofollow link for life.",
    },
    {
      question: "Does LaunchNests require upvotes to stay listed?",
      answer:
        "No. An approved LaunchNests listing stays live whatever its vote count; votes only decide its ranking during its launch week. Free listings are nofollow by default and dofollow while the LaunchNests badge stays on your site.",
    },
    {
      question: "How much does Uneed Pro cost?",
      answer:
        "Uneed's pricing page lists Pro at $99 a year, or $149 once for lifetime access. Pro includes a +3 vote multiplier, a Pro badge and one free relaunch a month.",
    },
    {
      question: "How is LaunchNests different from Uneed?",
      answer:
        "LaunchNests is newer and much smaller, and it only lists software. Free launches go into the next open week instead of a date 50+ days out, there's no upvote threshold, paid plans are one-time ($15 or $19), and products link to the tools they are built with. Uneed has a far larger audience, a newsletter and more paid services.",
    },
    {
      question: "Can I list on both Uneed and LaunchNests?",
      answer:
        "Yes. A common approach is to join Uneed's free line early and list on LaunchNests while you wait for your Uneed date.",
    },
  ],
}
