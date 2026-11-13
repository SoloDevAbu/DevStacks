import type { PlatformComparison } from "@/types/comparison"
import { SITE_CONFIG } from "@/constants/site"
import {
  COMPARISON_FACTS_CHECKED_ON,
  LAUNCHNESTS_ANGLES,
  LAUNCHNESTS_FACTS,
  LAUNCHNESTS_PROFILE,
} from "@/constants/comparisons/launchnests"

export const DEVHUNT_COMPARISON: PlatformComparison = {
  slug: "devhunt",
  routePath: "/devhunt-alternative",
  targetKeyword: "DevHunt alternative",
  name: "DevHunt Alternative",
  comparedPlatformName: "DevHunt",
  metaTitle: "DevHunt Alternative: LaunchNests vs DevHunt",
  metaDescription:
    "DevHunt and LaunchNests both run weekly launches for developer tools. Compare free vs paid links ($49 on DevHunt, $15 on LaunchNests), audience and scope, with sources.",
  keywords: [
    "DevHunt alternative",
    "alternatives to DevHunt",
    "DevHunt vs LaunchNests",
    "sites like DevHunt",
    "launch developer tools",
    "dev tool launch platforms",
  ],
  canonicalUrl: `${SITE_CONFIG.url}/devhunt-alternative`,
  factsCheckedOn: COMPARISON_FACTS_CHECKED_ON,
  sources: [
    { label: "DevHunt: FAQ", url: "https://devhunt.org/faq" },
    { label: "DevHunt: Home", url: "https://devhunt.org" },
  ],
  heroBadge: "Comparison guide",
  heroTitle: "DevHunt Alternative for Developer Tools",
  heroDescription:
    "DevHunt and LaunchNests are closer than most launch sites: both are for developer tools and both run weekly launches. DevHunt is older, open source and has a much larger audience. The main differences are link policy, price and what each lists.",
  comparedPlatformProfile: {
    name: "DevHunt",
    tagline: "Weekly launches for developer tools",
    websiteUrl: "https://devhunt.org",
    primaryAudience: "Developers looking for new developer tools.",
    discoveryLifespan:
      "A new batch of launches every week on the homepage; every tool keeps a permanent page.",
    pricingModel:
      "Free listing (nofollow). Paid launch $49 once (choose your week, newsletter spot, dofollow link, boost). Super boosts $99-$199. Ads from $99 a week.",
    keyStrengths: [
      "Developer tools only, so the audience matches dev products",
      "Open source",
      "Large audience: DevHunt states 655,823 unique visitors since launch and 7,464 tools launched",
      "Weekly winners are featured in the newsletter and on social, and get a badge",
    ],
    keyLimitations: [
      "Free listings get a nofollow link; dofollow needs the $49 launch",
      "Super boosts ($99-$199) open the week at #1-#3 on the homepage",
      "Voting needs a GitHub or Google sign-in",
    ],
  },
  launchNestsProfile: LAUNCHNESTS_PROFILE,
  quickComparisonDimensions: [
    {
      key: "cost",
      label: "Cost to launch",
      competitorValue: "Free, or $49 paid launch",
      launchNestsValue: LAUNCHNESTS_FACTS.cost,
    },
    {
      key: "window",
      label: "Launch window",
      competitorValue: "Weekly batch on the homepage",
      launchNestsValue: LAUNCHNESTS_FACTS.launchFormat,
    },
    {
      key: "freelink",
      label: "Dofollow link (free)",
      competitorValue: "No, free listings are nofollow",
      launchNestsValue: LAUNCHNESTS_FACTS.freeLink,
      description:
        "This is the biggest practical difference for a free listing.",
    },
    {
      key: "paidlink",
      label: "Dofollow link (paid)",
      competitorValue: "Permanent, with the $49 launch",
      launchNestsValue: LAUNCHNESTS_FACTS.paidLink,
    },
    {
      key: "boosts",
      label: "Paid ranking boosts",
      competitorValue: "Super boosts $99-$199 for the top three opening spots",
      launchNestsValue: "Premium+ ($19) gets top placement on directory pages",
    },
    {
      key: "scope",
      label: "What it lists",
      competitorValue: "Developer tools only",
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
      competitorValue: "655,823 unique visitors since launch",
      launchNestsValue: LAUNCHNESTS_FACTS.audience,
    },
  ],
  deepDives: [
    {
      id: "links",
      title: "Free links: nofollow vs badge-based dofollow",
      subtitle: "What a free listing gives you",
      competitorAngle:
        "DevHunt's FAQ says every tool gets a permanent page with a nofollow link. The paid launch ($49 once) adds a permanent dofollow link, a choice of launch week, a newsletter spot and a boost.",
      launchNestsAngle:
        "LaunchNests free listings are nofollow by default and switch to dofollow while the LaunchNests badge is live on your site; we re-check the badge regularly. Premium ($15 once) gives a permanent dofollow link without the badge.",
      practicalTakeaway:
        "If you don't want to pay, LaunchNests gives a way to a dofollow link; DevHunt doesn't. If you'll pay, compare $49 on DevHunt (larger audience) with $15 on LaunchNests.",
    },
    {
      id: "weekly",
      title: "Two weekly launch formats",
      subtitle: "How a launch week works",
      competitorAngle:
        "DevHunt shows a new batch of launches each week. Paid launches win ties and get their own post on X; super boosts ($99-$199) open the week at #1-#3, after which the homepage ranks by votes. The most-voted tools at the end of the week win and are featured in the Tuesday newsletter.",
      launchNestsAngle:
        "LaunchNests also runs weekly launches ranked by votes. Premium+ listings are pinned at the top of directory pages; there's no newsletter.",
      practicalTakeaway:
        "The formats are similar. DevHunt's audience and newsletter are the main reasons to prefer it.",
    },
    {
      id: "tech-stack",
      title: "Tool pages vs tech-stack links",
      subtitle: "Discovery after the launch week",
      competitorAngle:
        "DevHunt lists developer tools. Its listings don't connect products to the tools they are built with.",
      launchNestsAngle: LAUNCHNESTS_ANGLES.techStack,
      practicalTakeaway:
        "LaunchNests also lists products built with developer tools, not only the tools themselves.",
    },
  ],
  scenarios: [
    {
      id: "choose-devhunt",
      title: "When DevHunt is the better choice",
      badge: "Dev audience",
      badgeVariant: "hot",
      recommendedFor: "Developer tools that want the larger dev audience",
      explanation:
        "DevHunt has a much bigger developer audience and a weekly newsletter.",
      bulletPoints: [
        "Your product is a developer tool",
        "You're willing to pay $49 for a dofollow link and newsletter spot",
        "You can bring voters during your launch week",
      ],
    },
    {
      id: "choose-launchnests",
      title: "When LaunchNests is the better choice",
      badge: "Free dofollow",
      badgeVariant: "new",
      recommendedFor: "Dev tools and products built with them",
      explanation:
        "LaunchNests is cheaper and lists products as well as tools.",
      bulletPoints: [
        "You want a dofollow link without paying (by keeping the badge live)",
        "You'd rather pay $15 than $49",
        "Your product is built with developer tools but isn't one itself",
      ],
    },
    {
      id: "choose-both",
      title: "Use both",
      badge: "Both",
      badgeVariant: "neutral",
      recommendedFor: "Developer tools",
      explanation:
        "Both are built for developer tools; launching on both is normal.",
      bulletPoints: [
        "Launch on the two in different weeks so you can promote each",
        "List the tools you use on LaunchNests to appear on their pages",
      ],
    },
  ],
  canYouUseBoth: {
    heading: "Using DevHunt and LaunchNests together",
    subheading: "Two weekly launches, staggered",
    description:
      "Since both run weekly launches, stagger them so each gets your full attention:",
    strategySteps: [
      {
        stepNumber: 1,
        title: "Launch on LaunchNests",
        timing: "Week 1",
        action:
          "Launch on LaunchNests, list your tech stack, and add the badge to your site if you're on the free plan.",
        outcome: "A developer listing with stack links.",
      },
      {
        stepNumber: 2,
        title: "Launch on DevHunt",
        timing: "A later week",
        action: "Launch on DevHunt and promote it to your audience.",
        outcome: "A second launch week in front of DevHunt's larger audience.",
      },
    ],
    summary:
      "DevHunt for audience; LaunchNests for cheaper links and stack-based discovery.",
  },
  faqs: [
    {
      question: "Is DevHunt free?",
      answer:
        "Yes. DevHunt's FAQ says listing is free and every tool gets a permanent page with a nofollow link. A paid launch costs $49 once and adds a choice of launch week, a newsletter spot, a dofollow link and a boost.",
    },
    {
      question: "Does DevHunt give a dofollow link?",
      answer:
        "Only on paid launches. Free listings are nofollow; paid launches get a permanent dofollow link.",
    },
    {
      question: "Is DevHunt open source?",
      answer: "Yes, according to its FAQ.",
    },
    {
      question: "How is LaunchNests different from DevHunt?",
      answer:
        "Both run weekly launches for developer products. LaunchNests free listings can get a dofollow link by keeping the badge live, its paid plan is $15 once rather than $49, and it lists products built with developer tools as well as the tools. DevHunt has a much larger audience, a weekly newsletter and is open source.",
    },
  ],
}
