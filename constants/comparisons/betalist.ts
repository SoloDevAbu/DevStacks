import type { PlatformComparison } from "@/types/comparison"
import { SITE_CONFIG } from "@/constants/site"
import {
  COMPARISON_FACTS_CHECKED_ON,
  LAUNCHNESTS_ANGLES,
  LAUNCHNESTS_FACTS,
  LAUNCHNESTS_PROFILE,
} from "@/constants/comparisons/launchnests"

export const BETALIST_COMPARISON: PlatformComparison = {
  slug: "betalist",
  routePath: "/betalist-alternative",
  targetKeyword: "BetaList alternative",
  name: "BetaList Alternative",
  comparedPlatformName: "BetaList",
  metaTitle: "BetaList Alternative: LaunchNests vs BetaList (Paid Submissions)",
  metaDescription:
    "Every BetaList submission is paid, with a refund if you aren't selected. How its curated features, links and audience compare with LaunchNests, using BetaList's own pages.",
  keywords: [
    "BetaList alternative",
    "alternatives to BetaList",
    "BetaList vs LaunchNests",
    "sites like BetaList",
    "BetaList free submission",
    "startup directories",
    "where to launch software products",
  ],
  canonicalUrl: `${SITE_CONFIG.url}/betalist-alternative`,
  factsCheckedOn: COMPARISON_FACTS_CHECKED_ON,
  sources: [
    { label: "BetaList: Help", url: "https://betalist.com/help" },
    { label: "BetaList: Criteria", url: "https://betalist.com/criteria" },
    { label: "BetaList: Advertise", url: "https://betalist.com/advertise" },
    { label: "BetaList: Boost", url: "https://betalist.com/boost" },
  ],
  heroBadge: "Comparison guide",
  heroTitle: "BetaList Alternative for Developer Tools and Software",
  heroDescription:
    "BetaList is a long-running, curated startup site with a large newsletter. Every submission is paid, its editors pick around 20 startups a day, and you get a full refund if you aren't selected. LaunchNests is a much smaller, developer-focused site with a free plan.",
  comparedPlatformProfile: {
    name: "BetaList",
    tagline: "Curated site for new startups",
    websiteUrl: "https://betalist.com",
    primaryAudience:
      "Early adopters, founders and investors looking for new technology startups.",
    discoveryLifespan:
      "A curated feature, up to twice per startup (once pre-launch and once at launch), plus the newsletter.",
    pricingModel:
      "All submissions are paid, with an automatic full refund if not selected; plan prices are shown at the end of the submission form. Boosts from $99 a week, sponsorship $4,999 a month.",
    keyStrengths: [
      "Large audience: BetaList states 70,000+ newsletter subscribers and 500,000+ pageviews a month",
      "Features pre-launch waitlists and betas as well as launched products",
      "Featured startups get a dofollow link",
      "Refund if your startup isn't selected",
    ],
    keyLimitations: [
      "No free submission option",
      "Selective: around 20 startups featured a day from thousands of monthly submissions",
      "Technology startups only, on their own domain; no free subdomains or app store links",
      "Widely known products are a poor fit",
    ],
  },
  launchNestsProfile: LAUNCHNESTS_PROFILE,
  quickComparisonDimensions: [
    {
      key: "cost",
      label: "Cost to submit",
      competitorValue: "Paid only, refunded if not selected",
      launchNestsValue: LAUNCHNESTS_FACTS.cost,
    },
    {
      key: "selection",
      label: "Selection",
      competitorValue: "Editors feature around 20 startups a day",
      launchNestsValue: "Reviewed; approved software is listed",
    },
    {
      key: "stage",
      label: "Product stage",
      competitorValue: "Pre-launch, beta or live, if few readers know it yet",
      launchNestsValue: "Live products",
    },
    {
      key: "features",
      label: "How many features",
      competitorValue: "Up to two: pre-launch and launch",
      launchNestsValue: "One launch week, then a permanent listing",
    },
    {
      key: "links",
      label: "Dofollow link",
      competitorValue: "Yes, if featured (through a BetaList redirect)",
      launchNestsValue: LAUNCHNESTS_FACTS.linkPolicy,
    },
    {
      key: "audience",
      label: "Audience (self-reported)",
      competitorValue: "70,000+ subscribers; 500,000+ pageviews a month",
      launchNestsValue: LAUNCHNESTS_FACTS.audience,
    },
    {
      key: "techstack",
      label: "Tech-stack links",
      competitorValue: "Not part of the listing format",
      launchNestsValue: LAUNCHNESTS_FACTS.techStack,
    },
  ],
  deepDives: [
    {
      id: "curation",
      title: "Paid curation vs free listing",
      subtitle: "How you get in",
      competitorAngle:
        "BetaList says all submissions are paid and there is no free option. Its editors review submissions and feature around 20 startups a day; if yours isn't selected, the payment is refunded automatically. How fast you're featured depends on the plan you paid for, and faster plans guarantee a newsletter spot.",
      launchNestsAngle:
        "LaunchNests has a free plan. Every submission is reviewed, and approved software launches in the week you pick. Premium ($15) and Premium+ ($19) are one-time payments for choosing any week, a permanent dofollow link and better placement.",
      practicalTakeaway:
        "BetaList's selectivity is part of its value to readers. LaunchNests is easier to get onto and reaches far fewer people.",
    },
    {
      id: "stage",
      title: "Pre-launch and launch features",
      subtitle: "What stage of product each site wants",
      competitorAngle:
        "BetaList features pre-launch waitlists, private betas and launched products, as long as most readers haven't seen them. Each startup can be featured twice, once pre-launch and once at launch, a few weeks apart.",
      launchNestsAngle:
        "LaunchNests lists live software products and developer tools, each with one launch week and a permanent listing.",
      practicalTakeaway:
        "BetaList is the better of the two for collecting a waitlist before launch.",
    },
    {
      id: "tech-stack",
      title: "Startup features vs tech-stack links",
      subtitle: "Discovery after the feature",
      competitorAngle:
        "BetaList organises startups by feature date and topic. Its listings don't connect a product to the developer tools it is built with.",
      launchNestsAngle: LAUNCHNESTS_ANGLES.techStack,
      practicalTakeaway:
        "For developer products, being listed on your tools' pages keeps bringing in relevant visitors.",
    },
  ],
  scenarios: [
    {
      id: "choose-betalist",
      title: "When BetaList is the better choice",
      badge: "Early adopters",
      badgeVariant: "hot",
      recommendedFor: "New startups building a waitlist",
      explanation:
        "BetaList's audience is large and specifically interested in new startups.",
      bulletPoints: [
        "You're pre-launch and want waitlist sign-ups",
        "You're happy to pay, knowing you're refunded if not selected",
        "Your startup isn't widely known yet",
      ],
    },
    {
      id: "choose-launchnests",
      title: "When LaunchNests is the better choice",
      badge: "Developers",
      badgeVariant: "new",
      recommendedFor: "Live dev tools, APIs and technical SaaS",
      explanation:
        "LaunchNests is free to launch and focused on developer products.",
      bulletPoints: [
        "You want to launch without paying",
        "Your product is live and developer-facing",
        "You want your product linked from the pages of the tools it is built with",
      ],
    },
    {
      id: "choose-both",
      title: "Use both",
      badge: "Both",
      badgeVariant: "neutral",
      recommendedFor: "Startups going from beta to launch",
      explanation: "BetaList before launch, LaunchNests at launch.",
      bulletPoints: [
        "Submit your waitlist to BetaList",
        "List on LaunchNests when the product is live",
        "Use BetaList's second feature for your launch",
      ],
    },
  ],
  canYouUseBoth: {
    heading: "Using BetaList and LaunchNests together",
    subheading: "From waitlist to launch",
    description:
      "BetaList can feature you before and at launch; LaunchNests lists live products. One way to combine them:",
    strategySteps: [
      {
        stepNumber: 1,
        title: "BetaList pre-launch feature",
        timing: "Before launch",
        action: "Submit your waitlist or beta to BetaList.",
        outcome: "Early sign-ups if you're selected.",
      },
      {
        stepNumber: 2,
        title: "LaunchNests at launch",
        timing: "Launch",
        action:
          "Submit the live product to LaunchNests and list the tools it is built with.",
        outcome: "A developer listing that stays up.",
      },
      {
        stepNumber: 3,
        title: "BetaList launch feature",
        timing: "A few weeks after the first feature",
        action: "Use BetaList's second feature for your public launch.",
        outcome: "A second round of BetaList visibility.",
      },
    ],
    summary:
      "BetaList for early adopters before and at launch; LaunchNests for a developer listing.",
  },
  faqs: [
    {
      question: "Is BetaList free?",
      answer:
        "No. BetaList's help page says all submissions are paid and there is no free option. If your startup isn't selected, you're refunded automatically. Plan prices are shown at the end of the submission form.",
    },
    {
      question: "Does BetaList only accept pre-launch startups?",
      answer:
        "No. BetaList features pre-launch waitlists, private betas and launched products, as long as most of its readers haven't come across them. Each startup can be featured up to twice: once pre-launch and once at launch.",
    },
    {
      question: "Does BetaList give a dofollow link?",
      answer:
        "Yes, for featured startups. BetaList says its link doesn't use rel=nofollow; it goes through a BetaList redirect that adds tracking parameters.",
    },
    {
      question: "How is LaunchNests different from BetaList?",
      answer:
        "LaunchNests has a free plan, lists live software and developer tools, keeps approved listings up with no vote minimum, and links products to the tools they are built with. BetaList is paid, curated and has a much larger audience, and it also features pre-launch startups.",
    },
  ],
}
