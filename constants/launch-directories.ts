import type { LaunchDirectory } from "@/types/directory"
import { DIRECTORY_KIND } from "@/constants/directories"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { LAUNCHNESTS_FACTS } from "@/constants/comparisons/launchnests"

const { LAUNCH_PLATFORM, SOFTWARE_DIRECTORY, AI_DIRECTORY } = DIRECTORY_KIND

// Every stated fact below comes from the directory's own pages listed in `sources`, read on
// DIRECTORY_FACTS_CHECKED_ON. `null` means the pages we read didn't say. Link status is never
// written here: it comes from the weekly check of `sample`.
export const LAUNCH_DIRECTORIES: readonly LaunchDirectory[] = [
  {
    slug: "uneed",
    name: "Uneed",
    url: "https://www.uneed.best",
    kind: LAUNCH_PLATFORM,
    summary:
      "Maker launch site with daily, weekly, monthly and yearly leaderboards and a weekly newsletter.",
    freeOption: "Free waiting line; launch date assigned at least 50 days out",
    paidOptions:
      "Fast-track $14.99, Skip the line $39.99, Pro $99/year or $149 lifetime",
    statedLinkPolicy:
      "Free: dofollow at an upvote score of 20+, nofollow at 10-19, removed below 10. Skip the line and Pro: dofollow for life.",
    reviewTime: "Free submissions are moderated and can be declined",
    sources: [
      { label: "Uneed: Pricing", url: "https://www.uneed.best/pricing" },
      {
        label: "Uneed: How it works",
        url: "https://www.uneed.best/how-it-works",
      },
    ],
    sample: {
      listingUrl: "https://www.uneed.best/tool/plantpal",
      targetUrl: "https://plantpal.net",
    },
    comparisonPath: ROUTES.UNEED_ALTERNATIVE,
  },
  {
    slug: "devhunt",
    name: "DevHunt",
    url: "https://devhunt.org",
    kind: LAUNCH_PLATFORM,
    summary: "Open-source weekly launch site for developer tools only.",
    freeOption: "Free listing with a permanent page",
    paidOptions: "Paid launch $49; super boosts $99-$199",
    statedLinkPolicy:
      "Free listings are nofollow. Paid launches get a permanent dofollow link.",
    reviewTime: null,
    sources: [{ label: "DevHunt: FAQ", url: "https://devhunt.org/faq" }],
    sample: {
      listingUrl: "https://devhunt.org/tool/pingwise",
      targetUrl: "https://pingwise.com",
    },
    comparisonPath: ROUTES.DEVHUNT_ALTERNATIVE,
  },
  {
    slug: "betalist",
    name: "BetaList",
    url: "https://betalist.com",
    kind: LAUNCH_PLATFORM,
    summary:
      "Curated site featuring around 20 new startups a day, pre-launch or live, with a large newsletter.",
    freeOption: "None: all submissions are paid, refunded if not selected",
    paidOptions:
      "Plan prices shown at the end of the submission form; boosts from $99/week",
    statedLinkPolicy:
      "Featured startups get a dofollow link through a BetaList redirect.",
    reviewTime: "Depends on the plan paid for",
    sources: [
      { label: "BetaList: Help", url: "https://betalist.com/help" },
      { label: "BetaList: Boost", url: "https://betalist.com/boost" },
    ],
    sample: {
      listingUrl: "https://betalist.com/startups/lektify",
      targetUrl: "https://lektify.app",
    },
    comparisonPath: ROUTES.BETALIST_ALTERNATIVE,
  },
  {
    slug: "microlaunch",
    name: "MicroLaunch",
    url: "https://microlaunch.net",
    kind: LAUNCH_PLATFORM,
    summary:
      "Launch site where each launch gets 30 days of visibility and a monthly ranking.",
    freeOption: null,
    paidOptions: "Launch Pro $39, Launch Plus $79, Launch Everywhere $149",
    statedLinkPolicy: "Launch Pro lists dofollow backlinks.",
    reviewTime: null,
    sources: [
      { label: "MicroLaunch: Submit", url: "https://microlaunch.net/submit" },
    ],
    sample: {
      listingUrl: "https://microlaunch.net/p/varstats",
      targetUrl: "https://varstats.com",
    },
    comparisonPath: ROUTES.MICROLAUNCH_ALTERNATIVE,
  },
  {
    slug: "codehype",
    name: "CodeHype",
    url: "https://www.codehype.ai",
    kind: LAUNCH_PLATFORM,
    summary:
      "Weekly launch site and directory for AI tools, SaaS and startups.",
    freeOption: "Free launch in a 14-day queue; badge required",
    paidOptions: "Plus $15, Pro $25 (one-time)",
    statedLinkPolicy:
      "Free: dofollow while the badge stays verified (re-checked every 3 days). Plus and Pro: permanent dofollow.",
    reviewTime: "Every launch, paid or free, is reviewed by a person",
    sources: [
      { label: "CodeHype: Pricing", url: "https://www.codehype.ai/pricing" },
    ],
    sample: {
      listingUrl: "https://www.codehype.ai/product/postfjord",
      targetUrl: "https://postfjord.com",
      note: "The sample listing is on the paid Plus plan.",
    },
    comparisonPath: ROUTES.CODEHYPE_ALTERNATIVE,
  },
  {
    slug: "fazier",
    name: "Fazier",
    url: "https://fazier.com",
    kind: LAUNCH_PLATFORM,
    summary: "Daily launch site for products and tools.",
    freeOption: "Free; listed within 30 days; backlink to Fazier required",
    paidOptions: "Lite $29, Premium $49, Super $99 (one-time)",
    statedLinkPolicy:
      "Lite: backlink for top 3 daily products. Premium: dofollow link forever.",
    reviewTime: "Free: within 30 days",
    sources: [
      { label: "Fazier: Submit", url: "https://fazier.com/submit" },
      { label: "Fazier: Advertise", url: "https://fazier.com/advertise" },
    ],
    sample: {
      listingUrl: "https://fazier.com/launches/clockaura",
      targetUrl: "https://clockaura.com",
    },
  },
  {
    slug: "tinylaunch",
    name: "TinyLaunch",
    url: "https://www.tinylaunch.com",
    kind: LAUNCH_PLATFORM,
    summary:
      "Launch site with a standard queue and paid launches that skip it.",
    freeOption: "Free standard launch queue",
    paidOptions: "Premium launch $39; featured spot $30/week",
    statedLinkPolicy:
      "Dofollow when you embed the TinyLaunch badge with a dofollow link; Premium gets a guaranteed backlink.",
    reviewTime: null,
    sources: [
      { label: "TinyLaunch: Home", url: "https://www.tinylaunch.com" },
      {
        label: "TinyLaunch: Pricing",
        url: "https://www.tinylaunch.com/pricing",
      },
    ],
    sample: {
      listingUrl: "https://www.tinylaunch.com/launch/24125-monytra",
      targetUrl: "https://monytra.com",
      note: "The sample listing finished 3rd in its launch.",
    },
  },
  {
    slug: "peerpush",
    name: "PeerPush",
    url: "https://peerpush.com",
    kind: LAUNCH_PLATFORM,
    summary:
      "Launch site with a free queue and paid launches that go live immediately.",
    freeOption: "Free; waits in a queue behind paid launches",
    paidOptions: "Standard launch $45; with promotion $99 or $229",
    statedLinkPolicy:
      "Paid launches get a permanent listing link; dofollow not stated.",
    reviewTime: "Paid: live in 60 seconds",
    sources: [
      { label: "PeerPush: Pricing", url: "https://peerpush.com/pricing" },
    ],
    sample: {
      listingUrl: "https://peerpush.com/p/mcclipface-795769e6",
      targetUrl: "https://mcclipface.com",
    },
  },
  {
    slug: "noonlaunch",
    name: "Noonlaunch",
    url: "https://noonlaunch.com",
    kind: LAUNCH_PLATFORM,
    summary: "Weekly launch site; launches go live on Monday of their week.",
    freeOption: "Free; waits for an open slot and is reviewed by an admin",
    paidOptions: "Premium $11, Spotlight $49 (one-time)",
    statedLinkPolicy:
      "Free: nofollow, dofollow for good if it finishes top 3 of its week. Premium and Spotlight: dofollow.",
    reviewTime: null,
    sources: [
      { label: "Noonlaunch: Pricing", url: "https://noonlaunch.com/pricing" },
    ],
    sample: {
      listingUrl: "https://noonlaunch.com/product/instagram-transcript",
      targetUrl: "https://ins-transcript.com",
    },
  },
  {
    slug: "openhunts",
    name: "OpenHunts",
    url: "https://openhunts.com",
    kind: LAUNCH_PLATFORM,
    summary: "Weekly launch site with 20 free slots a week, launching Mondays.",
    freeOption: "Free; queue around 60 weeks, or add their badge to skip",
    paidOptions: "Premium launch $9.90; highlight $20/week",
    statedLinkPolicy: "Free: dofollow if top 3. Premium: guaranteed dofollow.",
    reviewTime: null,
    sources: [
      { label: "OpenHunts: Pricing", url: "https://openhunts.com/pricing" },
    ],
    sample: {
      listingUrl: "https://openhunts.com/projects/diskclue",
      targetUrl: "https://diskclue.com",
      note: "The sample listing was a top-2 weekly winner.",
    },
  },
  {
    slug: "smol-launch",
    name: "Smol Launch",
    url: "https://smollaunch.com",
    kind: LAUNCH_PLATFORM,
    summary:
      "Weekly launch site with 50 free and 50 badge-verified slots a week.",
    freeOption:
      "Free; 50 slots a week, plus 50 for badge-verified launches; vote on 3 launches",
    paidOptions: "Directory submission service from $99",
    statedLinkPolicy:
      "Every approved product links to your site; the free verified tier's backlink lasts while the badge stays verified.",
    reviewTime: "Reviewed before its launch week starts",
    sources: [
      { label: "Smol Launch: Home", url: "https://smollaunch.com" },
      {
        label: "Smol Launch: How it works",
        url: "https://smollaunch.com/how-it-works",
      },
    ],
    sample: {
      listingUrl: "https://smollaunch.com/products/pluginpeer",
      targetUrl: "http://pluginpeer.com",
    },
  },
  {
    slug: "launching-next",
    name: "Launching Next",
    url: "https://www.launchingnext.com",
    kind: LAUNCH_PLATFORM,
    summary: "Startup listing site that reviews submissions daily.",
    freeOption: "Free",
    paidOptions: "$99 upgrade for review within one business day",
    statedLinkPolicy: null,
    reviewTime: "Reviewed every day; paid within 1 business day",
    sources: [
      {
        label: "Launching Next: Submit",
        url: "https://www.launchingnext.com/submit/",
      },
    ],
    sample: {
      listingUrl: "https://www.launchingnext.com/s/almanzor/178274/",
      targetUrl: "https://almanzor.cloud",
    },
  },
  {
    slug: "product-hunt",
    name: "Product Hunt",
    url: "https://www.producthunt.com",
    kind: LAUNCH_PLATFORM,
    summary: "The largest launch site; launches last one Pacific-time day.",
    freeOption: "Free; schedule up to 30 days ahead",
    paidOptions: "Self-service ads",
    statedLinkPolicy: null,
    reviewTime: "The team picks which launches are featured",
    sources: [
      {
        label: "Product Hunt: How Product Hunt works",
        url: "https://help.producthunt.com/en/articles/17734306-1-how-product-hunt-works",
      },
    ],
    sample: null,
    unmeasuredReason:
      "Product pages load their content with JavaScript, so a plain HTML check can't see the link.",
    comparisonPath: ROUTES.PRODUCTHUNT_ALTERNATIVE,
  },
  {
    slug: "launchnests",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    kind: LAUNCH_PLATFORM,
    summary:
      "Our site: weekly launches for developer tools and the products built with them.",
    freeOption: LAUNCHNESTS_FACTS.freeQueue,
    paidOptions: LAUNCHNESTS_FACTS.cost,
    statedLinkPolicy: LAUNCHNESTS_FACTS.linkPolicy,
    reviewTime: "Every submission is reviewed",
    sources: [
      {
        label: "LaunchNests: Pricing",
        url: `${SITE_CONFIG.url}${ROUTES.PRICING}`,
      },
    ],
    sample: {
      listingUrl: `${SITE_CONFIG.url}${ROUTES.PRODUCT("seamlessify-1cc9fe")}`,
      targetUrl: "https://seamlessify.com",
    },
    isOwnSite: true,
  },
  {
    slug: "saashub",
    name: "SaaSHub",
    url: "https://www.saashub.com",
    kind: SOFTWARE_DIRECTORY,
    summary: "Software alternatives directory with an approval process.",
    freeOption: "Free; slower if no competitors are listed",
    paidOptions:
      "Featured and promotion options (prices not on the pages we read)",
    statedLinkPolicy: null,
    reviewTime: "All submissions go through approval",
    sources: [
      {
        label: "SaaSHub: Submit",
        url: "https://www.saashub.com/services/submit",
      },
    ],
    sample: {
      listingUrl: "https://www.saashub.com/numeric-clock-alternatives",
      targetUrl: "https://github.com/nickotmazgin/Linux-Numeric-Date-And-Clock",
    },
  },
  {
    slug: "alternativeto",
    name: "AlternativeTo",
    url: "https://alternativeto.net",
    kind: SOFTWARE_DIRECTORY,
    summary: "Crowdsourced directory of software alternatives.",
    freeOption: null,
    paidOptions: null,
    statedLinkPolicy: null,
    reviewTime: null,
    sources: [
      {
        label: "AlternativeTo: Sample listing",
        url: "https://alternativeto.net/software/vela-maps/about/",
      },
    ],
    sample: {
      listingUrl: "https://alternativeto.net/software/vela-maps/about/",
      targetUrl: "https://pimpinpumpkin.github.io/Vela",
    },
  },
  {
    slug: "startup-stash",
    name: "Startup Stash",
    url: "https://startupstash.com",
    kind: SOFTWARE_DIRECTORY,
    summary: "Curated directory of tools and resources for startups.",
    freeOption: null,
    paidOptions: null,
    statedLinkPolicy: null,
    reviewTime: null,
    sources: [
      {
        label: "Startup Stash: Add listing",
        url: "https://startupstash.com/add-listing/",
      },
    ],
    sample: {
      listingUrl: "https://startupstash.com/tools/hubspot/",
      targetUrl: "https://www.hubspot.com",
    },
  },
  {
    slug: "findly-tools",
    name: "Findly.tools",
    url: "https://findly.tools",
    kind: SOFTWARE_DIRECTORY,
    summary: "Tools directory with badge-based free listings.",
    freeOption: "Free with their badge; unpublished if the badge is removed",
    paidOptions: "Premium $29; directory submission packs $59-$139",
    statedLinkPolicy:
      "Free: 1 dofollow link with the badge. Premium: 4 permanent dofollow links.",
    reviewTime: "Premium: instant approval",
    sources: [
      { label: "Findly.tools: Pricing", url: "https://findly.tools/pricing" },
    ],
    sample: {
      listingUrl: "https://findly.tools/hypello",
      targetUrl: "https://www.hypello.com",
    },
  },
  {
    slug: "twelve-tools",
    name: "Twelve Tools",
    url: "https://twelve.tools",
    kind: AI_DIRECTORY,
    summary: "AI tools directory with free listings that require a backlink.",
    freeOption: "Free; backlink to Twelve Tools required",
    paidOptions: "Pro $36 one-time",
    statedLinkPolicy:
      "Free: 1 dofollow link. Pro: 3 permanent dofollow links, no backlink needed.",
    reviewTime: "Free within 72 hours; Pro within 24 hours",
    sources: [
      { label: "Twelve Tools: Submit", url: "https://twelve.tools/submit" },
      { label: "Twelve Tools: Pricing", url: "https://twelve.tools/pricing" },
    ],
    sample: {
      listingUrl: "https://twelve.tools/qwen-image-org",
      targetUrl: "https://qwen-image.org",
    },
  },
  {
    slug: "dang-ai",
    name: "Dang.ai",
    url: "https://dang.ai",
    kind: AI_DIRECTORY,
    summary: "AI tools directory; free submissions need a backlink to Dang.ai.",
    freeOption: "Free; crawlable backlink to Dang.ai required",
    paidOptions: "Basic $49; Pro $30 setup + $19/month",
    statedLinkPolicy: null,
    reviewTime: "Free up to 4 weeks; Basic about 4 days",
    sources: [{ label: "Dang.ai: Pricing", url: "https://dang.ai/pricing" }],
    sample: {
      listingUrl: "https://dang.ai/tool/image-generation-ai-model-midjourney",
      targetUrl: "https://www.midjourney.com",
    },
  },
  {
    slug: "futurepedia",
    name: "Futurepedia",
    url: "https://www.futurepedia.io",
    kind: AI_DIRECTORY,
    summary: "Large AI tools directory organised by category.",
    freeOption: null,
    paidOptions: null,
    statedLinkPolicy: null,
    reviewTime: null,
    sources: [
      {
        label: "Futurepedia: Sample listing",
        url: "https://www.futurepedia.io/tool/elevenlabs",
      },
    ],
    sample: {
      listingUrl: "https://www.futurepedia.io/tool/elevenlabs",
      targetUrl: "https://elevenlabs.io",
      note: "The sample listing carries an Editor's Pick label.",
    },
  },
]

export const getLaunchDirectory = (slug: string) =>
  LAUNCH_DIRECTORIES.find((directory) => directory.slug === slug)
