import type { PlatformComparison } from "@/types/comparison"
import { SITE_CONFIG } from "@/constants/site"
import {
  COMPARISON_FACTS_CHECKED_ON,
  LAUNCHNESTS_ANGLES,
  LAUNCHNESTS_FACTS,
  LAUNCHNESTS_PROFILE,
} from "@/constants/comparisons/launchnests"

export const CODEHYPE_COMPARISON: PlatformComparison = {
  slug: "codehype",
  routePath: "/codehype-alternative",
  targetKeyword: "CodeHype alternative",
  name: "CodeHype Alternative",
  comparedPlatformName: "CodeHype",
  metaTitle: "CodeHype Alternative: LaunchNests vs CodeHype Compared",
  metaDescription:
    "CodeHype and LaunchNests both give free listings a dofollow link while your badge stays live. Compare queues, paid plans ($15-$25 vs $15-$19), focus and audience, with sources.",
  keywords: [
    "CodeHype alternative",
    "alternatives to CodeHype",
    "CodeHype vs LaunchNests",
    "sites like CodeHype",
    "AI product launch sites",
    "where to launch software products",
  ],
  canonicalUrl: `${SITE_CONFIG.url}/codehype-alternative`,
  factsCheckedOn: COMPARISON_FACTS_CHECKED_ON,
  sources: [
    {
      label: "CodeHype: Pricing and FAQ",
      url: "https://www.codehype.ai/pricing",
    },
    { label: "CodeHype: Submit", url: "https://www.codehype.ai/submit" },
    {
      label: "CodeHype: Why CodeHype",
      url: "https://www.codehype.ai/why-codehype",
    },
  ],
  heroBadge: "Comparison guide",
  heroTitle: "CodeHype Alternative for Developer Tools and Software",
  heroDescription:
    "CodeHype is a launch site and directory for AI tools, SaaS and startups, with weekly winners and a large social following. Its pricing is close to LaunchNests': free listings get a dofollow link while your badge stays live, and paid plans are one-time. The differences are focus, queue and audience.",
  comparedPlatformProfile: {
    name: "CodeHype",
    tagline: "Launch site for AI tools, SaaS and startups",
    websiteUrl: "https://www.codehype.ai",
    primaryAudience: "People looking for AI tools, SaaS and new startups.",
    discoveryLifespan:
      "Weekly launches with weekly winners, plus monthly and yearly top lists.",
    pricingModel:
      "Free launch (14-day queue). Plus $15 and Pro $25, one-time per product. Ads $79-$99 a month; directory submission $49-$149.",
    keyStrengths: [
      "Free listings get a dofollow link while the badge stays verified (re-checked every 3 days)",
      "Paid plans publish instantly with a permanent dofollow link",
      "Large social following: CodeHype states a 170K+ combined audience, mostly Instagram and YouTube",
      "Pro ($25) includes a week on the homepage and a 1,500-word blog post",
    ],
    keyLimitations: [
      "Free launches wait in a 14-day queue",
      "Free listings need the badge installed",
      "Focused on AI tools and SaaS rather than developer tools",
    ],
  },
  launchNestsProfile: LAUNCHNESTS_PROFILE,
  quickComparisonDimensions: [
    {
      key: "cost",
      label: "Cost to launch",
      competitorValue: "Free, or $15 / $25 one-time",
      launchNestsValue: LAUNCHNESTS_FACTS.cost,
    },
    {
      key: "queue",
      label: "Free launch timing",
      competitorValue: "14-day queue",
      launchNestsValue: LAUNCHNESTS_FACTS.freeQueue,
    },
    {
      key: "freelink",
      label: "Dofollow link (free)",
      competitorValue: "While the badge stays verified",
      launchNestsValue: LAUNCHNESTS_FACTS.freeLink,
    },
    {
      key: "paidlink",
      label: "Dofollow link (paid)",
      competitorValue: "Permanent on Plus ($15); two extra links on Pro",
      launchNestsValue: LAUNCHNESTS_FACTS.paidLink,
    },
    {
      key: "review",
      label: "Review",
      competitorValue: "Every launch, including paid, is reviewed by a person",
      launchNestsValue: "Every submission is reviewed",
    },
    {
      key: "focus",
      label: "What it lists",
      competitorValue: "AI tools, SaaS and startups",
      launchNestsValue: LAUNCHNESTS_FACTS.focus,
    },
    {
      key: "techstack",
      label: "Tech-stack links",
      competitorValue: "Not part of the listing format",
      launchNestsValue: LAUNCHNESTS_FACTS.techStack,
    },
    {
      key: "audience",
      label: "Audience (self-reported)",
      competitorValue: "170K+ across its social channels",
      launchNestsValue: LAUNCHNESTS_FACTS.audience,
    },
  ],
  deepDives: [
    {
      id: "links",
      title: "Similar link models",
      subtitle: "Badge-based dofollow on both",
      competitorAngle:
        "CodeHype's free launch links to your site as dofollow while its badge stays verified on your site, and it re-checks every 3 days. Plus ($15) and Pro ($25) give a permanent dofollow link without the badge; Pro adds two more backlinks.",
      launchNestsAngle:
        "LaunchNests works the same way: free listings are dofollow while the LaunchNests badge is live, and Premium ($15) or Premium+ ($19) give a permanent dofollow link.",
      practicalTakeaway:
        "On links and price the two are close. Choose on audience and focus.",
    },
    {
      id: "queue",
      title: "14-day queue vs next open week",
      subtitle: "When a free launch goes live",
      competitorAngle:
        "Free launches on CodeHype join a 14-day queue. Paid plans publish instantly, but every launch still goes through human review.",
      launchNestsAngle:
        "Free LaunchNests launches go into an upcoming week that still has free slots, and Premium lets you pick any upcoming week. Every submission is reviewed.",
      practicalTakeaway: "Similar waits; neither takes months.",
    },
    {
      id: "tech-stack",
      title: "AI directory vs tech-stack links",
      subtitle: "Who finds you afterwards",
      competitorAngle:
        "CodeHype is organised around AI tools, SaaS and startups by category, with weekly winners. Its listings don't connect products to the tools they are built with.",
      launchNestsAngle: LAUNCHNESTS_ANGLES.techStack,
      practicalTakeaway:
        "AI and consumer SaaS may fit CodeHype's audience better; developer products fit LaunchNests.",
    },
  ],
  scenarios: [
    {
      id: "choose-codehype",
      title: "When CodeHype is the better choice",
      badge: "AI tools",
      badgeVariant: "hot",
      recommendedFor: "AI tools and SaaS aimed at a broad audience",
      explanation:
        "CodeHype's audience is larger and centred on AI tools and social channels.",
      bulletPoints: [
        "Your product is an AI tool or general SaaS",
        "You want a week on the homepage and a blog post for $25",
        "You want exposure through its Instagram and YouTube following",
      ],
    },
    {
      id: "choose-launchnests",
      title: "When LaunchNests is the better choice",
      badge: "Developers",
      badgeVariant: "new",
      recommendedFor: "Dev tools, APIs and technical SaaS",
      explanation:
        "LaunchNests is built around developer products and their stacks.",
      bulletPoints: [
        "Your audience is developers",
        "You want your product linked from the pages of the tools it is built with",
        "You want your listing readable through /llms.txt and an MCP server",
      ],
    },
    {
      id: "choose-both",
      title: "Use both",
      badge: "Both",
      badgeVariant: "neutral",
      recommendedFor: "AI products with a developer audience",
      explanation:
        "Both badges can sit on your site, so both free listings can be dofollow.",
      bulletPoints: [
        "Submit to both on the free plan",
        "Add both badges to your site",
      ],
    },
  ],
  canYouUseBoth: {
    heading: "Using CodeHype and LaunchNests together",
    subheading: "Two free, badge-based listings",
    description:
      "Because both reward a live badge with a dofollow link, listing on both costs nothing but two badges:",
    strategySteps: [
      {
        stepNumber: 1,
        title: "Submit to both",
        timing: "Day 1",
        action:
          "Submit to CodeHype (14-day queue) and LaunchNests (next open week).",
        outcome: "Two launches within a few weeks.",
      },
      {
        stepNumber: 2,
        title: "Add both badges",
        timing: "Before each launch",
        action: "Put both badges on your site and keep them there.",
        outcome: "Dofollow links from both free listings.",
      },
    ],
    summary: "CodeHype for AI and SaaS audiences; LaunchNests for developers.",
  },
  faqs: [
    {
      question: "Is CodeHype free?",
      answer:
        "Yes. CodeHype's free launch costs $0 and joins a 14-day queue. You install its badge to verify ownership and unlock a dofollow link. Plus ($15) and Pro ($25) are one-time payments that publish instantly.",
    },
    {
      question: "Does CodeHype give a dofollow link?",
      answer:
        "Yes. Free listings are dofollow while the badge stays verified on your site (CodeHype re-checks every 3 days), and Plus and Pro include a permanent dofollow link.",
    },
    {
      question: "How is LaunchNests different from CodeHype?",
      answer:
        "The pricing and link models are similar. LaunchNests focuses on developer tools and the products built with them, links products to their tech stack, and publishes listings for AI tools via /llms.txt and an MCP server. CodeHype focuses on AI tools and SaaS and has a much larger social audience.",
    },
  ],
}
