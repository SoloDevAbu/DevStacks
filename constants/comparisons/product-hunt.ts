import type { PlatformComparison } from "@/types/comparison"
import { SITE_CONFIG } from "@/constants/site"
import {
  COMPARISON_FACTS_CHECKED_ON,
  LAUNCHNESTS_ANGLES,
  LAUNCHNESTS_FACTS,
  LAUNCHNESTS_PROFILE,
} from "@/constants/comparisons/launchnests"

const PH_HELP = "https://help.producthunt.com/en/articles"

export const PRODUCT_HUNT_COMPARISON: PlatformComparison = {
  slug: "producthunt",
  routePath: "/producthunt-alternative",
  targetKeyword: "Product Hunt alternative",
  name: "Product Hunt Alternative",
  comparedPlatformName: "Product Hunt",
  metaTitle: "Product Hunt Alternative: LaunchNests Compared",
  metaDescription:
    "Product Hunt is free, but its team picks which launches get featured and the leaderboard resets daily. How that compares with a weekly launch on LaunchNests, with sources.",
  keywords: [
    "Product Hunt alternative",
    "alternatives to Product Hunt",
    "Product Hunt vs LaunchNests",
    "sites like Product Hunt",
    "product launch platforms",
    "launching developer tools",
    "where to launch software products",
  ],
  canonicalUrl: `${SITE_CONFIG.url}/producthunt-alternative`,
  factsCheckedOn: COMPARISON_FACTS_CHECKED_ON,
  sources: [
    {
      label: "Product Hunt: How Product Hunt works",
      url: `${PH_HELP}/17734306-1-how-product-hunt-works`,
    },
    {
      label: "Product Hunt: What kind of products get featured",
      url: `${PH_HELP}/17734341-2-what-kind-of-products-get-featured`,
    },
    {
      label: "Product Hunt: Set your goals and pick your launch date",
      url: `${PH_HELP}/17734355-3-set-your-goals-and-pick-your-launch-date`,
    },
    {
      label: "Product Hunt: Relaunch your product",
      url: `${PH_HELP}/17734411-7-relaunch-your-product`,
    },
    {
      label: "Product Hunt: Launch FAQ and myths",
      url: `${PH_HELP}/17734646-8-launch-faq-and-myths`,
    },
  ],
  heroBadge: "Comparison guide",
  heroTitle: "Product Hunt Alternative for Developer Tools and Software",
  heroDescription:
    "Product Hunt is the largest launch site in tech: launching is free, every launch lasts one Pacific-time day, and its team decides which launches are featured on the homepage. LaunchNests is a much smaller, developer-focused site where a launch runs for a week and the listing stays on category and tech-stack pages afterwards.",
  comparedPlatformProfile: {
    name: "Product Hunt",
    tagline: "The best new products in tech",
    websiteUrl: "https://www.producthunt.com",
    primaryAudience:
      "A broad tech audience: early adopters, founders, investors and press.",
    discoveryLifespan:
      "One day. Launches go live at 12:01 AM Pacific and run until midnight Pacific.",
    pricingModel:
      "Launching, commenting and winning Product of the Day are free. Product Hunt also sells self-service ads.",
    keyStrengths: [
      "By far the largest audience of any launch site",
      "Free to launch, and you can schedule up to 30 days ahead",
      "Featured launches compete for Product of the Day, a widely recognised badge",
      "Product Hunt encourages linking straight to your product",
    ],
    keyLimitations: [
      "The team hand-picks which launches are featured; a launch that isn't featured still goes live but off the homepage leaderboard",
      "Ranking uses points, comments, time since launch and other signals, and the formula isn't public",
      "Each launch competes for a single day",
      "Relaunching within two months needs a relaunch request and is meant for major updates",
      "Company and brand accounts can't submit launches",
    ],
  },
  launchNestsProfile: LAUNCHNESTS_PROFILE,
  quickComparisonDimensions: [
    {
      key: "cost",
      label: "Cost to launch",
      competitorValue: "Free",
      launchNestsValue: LAUNCHNESTS_FACTS.cost,
    },
    {
      key: "window",
      label: "Launch window",
      competitorValue: "One day, 12:01 AM to midnight Pacific",
      launchNestsValue: LAUNCHNESTS_FACTS.launchFormat,
    },
    {
      key: "homepage",
      label: "Homepage placement",
      competitorValue: "Only launches the team chooses to feature",
      launchNestsValue: "Every approved launch in its week",
      description:
        "On Product Hunt, unfeatured launches are live but not on the homepage leaderboard.",
    },
    {
      key: "scheduling",
      label: "Scheduling",
      competitorValue: "From tomorrow up to 30 days ahead",
      launchNestsValue: `${LAUNCHNESTS_FACTS.freeQueue}, or ${LAUNCHNESTS_FACTS.paidScheduling}`,
    },
    {
      key: "ranking",
      label: "Ranking",
      competitorValue: "Points, comments, time and undisclosed signals",
      launchNestsValue: "Community votes within the launch week",
    },
    {
      key: "relaunch",
      label: "Relaunching",
      competitorValue: "After two months, or by request for major updates",
      launchNestsValue: "No relaunch option yet; one listing per product",
    },
    {
      key: "techstack",
      label: "Tech-stack links",
      competitorValue: "Not part of the launch format",
      launchNestsValue: LAUNCHNESTS_FACTS.techStack,
    },
    {
      key: "audience",
      label: "Audience size",
      competitorValue: "Very large global tech audience",
      launchNestsValue: LAUNCHNESTS_FACTS.audience,
    },
  ],
  deepDives: [
    {
      id: "featuring",
      title: "Getting featured vs being listed",
      subtitle: "Who decides whether your launch is seen",
      competitorAngle:
        "Product Hunt's team reviews every launch and hand-picks which ones appear on the homepage leaderboard. Its help center calls this an editorial decision: meeting the guidelines doesn't guarantee a spot. A launch that isn't featured still goes live and can be found, but it doesn't compete for Product of the Day.",
      launchNestsAngle:
        "LaunchNests reviews every submission too, but there is no second featuring step. An approved launch appears in its launch week on the homepage alongside the others, and stays on its category and tech-stack pages afterwards.",
      practicalTakeaway:
        "If you can get featured, Product Hunt's reach is far bigger than ours. LaunchNests is a predictable extra listing, not a replacement for that reach.",
    },
    {
      id: "one-day",
      title: "One day vs one week",
      subtitle: "How long a launch competes",
      competitorAngle:
        "Every Product Hunt launch runs for one Pacific-time day. Your position depends on points, comments, time since launch and other signals; upvotes from established members count for more, and Product Hunt doesn't publish the formula.",
      launchNestsAngle:
        "A LaunchNests launch runs for a week on the homepage and ranks by community votes within that week. After the week it moves to the archive and keeps its category and tech-stack pages.",
      practicalTakeaway:
        "A one-day launch rewards having your audience ready on the day. A weekly launch is more forgiving, but the pool of voters on LaunchNests is much smaller.",
    },
    {
      id: "tech-stack",
      title: "Launch page vs tech-stack links",
      subtitle: "Discovery after launch day",
      competitorAngle:
        "Product Hunt organises products by launch day, topic and maker. Its launch format doesn't connect a product to the developer tools it is built with.",
      launchNestsAngle: LAUNCHNESTS_ANGLES.techStack,
      practicalTakeaway:
        "For developer-facing products, tech-stack links give people a way to find you long after the launch, through the tools you already use.",
    },
    {
      id: "ai-access",
      title: "Machine-readable listings",
      subtitle: "How AI tools can read your listing",
      competitorAngle:
        "Product Hunt pages are built for people browsing the site. We didn't find an equivalent of /llms.txt or an MCP server in its launch documentation.",
      launchNestsAngle: LAUNCHNESTS_ANGLES.aiAccess,
      practicalTakeaway:
        "Useful if your users ask AI assistants for tool recommendations; it doesn't replace reach.",
    },
  ],
  scenarios: [
    {
      id: "choose-producthunt",
      title: "When Product Hunt is the better choice",
      badge: "Reach",
      badgeVariant: "hot",
      recommendedFor:
        "Products with an audience ready to show up on launch day",
      explanation:
        "Nothing else in this list matches Product Hunt's audience. If you can prepare a strong launch day, start here.",
      bulletPoints: [
        "You can rally users, followers or a community on one specific day",
        "Your product suits a broad tech audience, not only developers",
        "You want a chance at Product of the Day and press attention",
      ],
    },
    {
      id: "choose-launchnests",
      title: "When LaunchNests is the better choice",
      badge: "Developers",
      badgeVariant: "new",
      recommendedFor: "Dev tools, APIs and technical SaaS",
      explanation:
        "LaunchNests is a smaller, developer-focused listing that doesn't depend on being featured or on one day's performance.",
      bulletPoints: [
        "You want a listing that stays up regardless of votes",
        "You want your product linked from the pages of the tools it is built with",
        "You want a week on the homepage instead of a single day",
      ],
    },
    {
      id: "choose-both",
      title: "Use both",
      badge: "Both",
      badgeVariant: "neutral",
      recommendedFor: "Most software launches",
      explanation:
        "The two don't conflict. Many founders list on smaller sites in the weeks around a Product Hunt launch.",
      bulletPoints: [
        "List on LaunchNests first so the listing and its stack links are already live",
        "Pick a Product Hunt date up to 30 days out and prepare your launch day",
        "Link to your Product Hunt launch from your other listings on the day",
      ],
    },
  ],
  canYouUseBoth: {
    heading: "Using Product Hunt and LaunchNests together",
    subheading: "A simple order that works for most launches",
    description:
      "Product Hunt gives you a single, large launch day. LaunchNests gives you a smaller, longer-lived developer listing. Here is one way to sequence them:",
    strategySteps: [
      {
        stepNumber: 1,
        title: "List on LaunchNests",
        timing: "Two to four weeks before",
        action:
          "Submit your product, list the tools it is built with, and add the badge to your site if you want a dofollow link on the free plan.",
        outcome:
          "Your listing and its tech-stack links are live before the big launch.",
      },
      {
        stepNumber: 2,
        title: "Schedule on Product Hunt",
        timing: "Up to 30 days before",
        action:
          "Pick your Product Hunt date (it can be from tomorrow up to 30 days ahead) and prepare your launch assets and outreach.",
        outcome: "A fixed date to build towards.",
      },
      {
        stepNumber: 3,
        title: "Launch day",
        timing: "Launch day",
        action:
          "Launch on Product Hunt at 12:01 AM Pacific and point your existing audience to it.",
        outcome:
          "Your one-day push on Product Hunt, with the LaunchNests listing still there afterwards.",
      },
    ],
    summary:
      "Product Hunt for reach on the day, LaunchNests as one of the developer listings that stay up afterwards.",
  },
  faqs: [
    {
      question: "Is it free to launch on Product Hunt?",
      answer:
        "Yes. Product Hunt's help center says submitting a launch, commenting and reaching Product of the Day are all free. It also sells self-service ads, which are separate from launching.",
    },
    {
      question: "Does every Product Hunt launch appear on the homepage?",
      answer:
        "No. Product Hunt's team hand-picks which launches to feature on the homepage leaderboard. A launch that isn't featured still goes live, but it doesn't compete for that day's ranking.",
    },
    {
      question: "How long does a Product Hunt launch last?",
      answer:
        "One day. Launches go live at 12:01 AM Pacific Time on the scheduled date and run until midnight Pacific.",
    },
    {
      question: "How often can I relaunch on Product Hunt?",
      answer:
        "If more than two months have passed since your last launch you can submit as usual. Within two months you need to send a relaunch request, and relaunches are meant for major updates.",
    },
    {
      question: "How is LaunchNests different from Product Hunt?",
      answer: `LaunchNests is much smaller and focused on software for developers. Launches run for a week instead of a day, every approved launch is shown in its week, listings stay up with no vote minimum, and products link to the tools they are built with. Product Hunt has a far larger audience. LaunchNests is free, with optional one-time plans; free listings get a dofollow link while the LaunchNests badge stays on your site.`,
    },
    {
      question: "Should I launch on Product Hunt or LaunchNests?",
      answer:
        "Most products should do both. Use Product Hunt for a single high-reach launch day, and LaunchNests for a developer listing that stays up and links your product to its tech stack.",
    },
  ],
}
