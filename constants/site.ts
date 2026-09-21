const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://launchnests.com"

export const SITE_CONFIG = {
  name: "LaunchNests",
  shortName: "LaunchNests",
  alternateNames: [
    "LaunchNests Directory",
    "LaunchNests Ecosystem",
    "LaunchNests Platform",
  ],
  tagline: "Discover Developer Tools, APIs & Products",
  description:
    "Discover developer tools, APIs, and infrastructure products. Explore what developers are building, community upvotes, and modern tech stacks.",
  url: siteUrl,
  domain: "launchnests.com",
  creator: "Abu Bakkar Siddique",
  publisher: "LaunchNests",
  keywords: [
    "developer tools",
    "devtools directory",
    "API discovery",
    "software products",
    "developer infrastructure",
    "SaaS tools",
    "open source developer tools",
    "tech stack showcase",
    "built with developer tools",
    "trending dev tools",
    "what is LaunchNests",
    "tech stack database",
    "developer ecosystem",
    "indie hacker tools",
    "best dev tools",
    "developer APIs and SDKs",
    "developer software directory",
    "product tech stacks",
  ],
  socials: {
    x: "https://x.com/AbuBakkar2502",
    linkedin: "https://www.linkedin.com/in/abu-bakkar-siddique-546112205/",
  },
  themeColor: "#0f172a",
} as const

export const CREATOR_SOCIALS = {
  name: "Abu Bakkar Siddique",
  x: "https://x.com/AbuBakkar2502",
  linkedin: "https://www.linkedin.com/in/abu-bakkar-siddique-546112205/",
} as const


