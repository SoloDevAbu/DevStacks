const getSiteUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (envUrl) return envUrl.replace(/\/$/, "")
  return process.env.NODE_ENV === "production"
    ? "https://www.launchnests.com"
    : "http://localhost:3000"
}

const siteUrl = getSiteUrl()

export const SITE_CONFIG = {
  name: "LaunchNests",
  shortName: "LaunchNests",
  alternateNames: [
    "LaunchNests Directory",
    "LaunchNests Ecosystem",
    "LaunchNests Platform",
  ],
  tagline: "Launch & Discover Products for AI & Search Engines",
  description:
    "Launch, rank, and discover developer tools and products built for search engines and AI search. Explore community upvotes, tech stacks, permanent backlinks, and AI indexing across ChatGPT, Claude, and Google.",
  url: siteUrl,
  domain: "www.launchnests.com",
  ogImage: `${siteUrl}/og-image.png`,
  supportEmail: "support@launchnests.com",
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
    "search by AI",
    "AI search engine",
    "AI product discovery",
    "GEO generative engine optimization",
    "AEO answer engine optimization",
    "LLM search discovery",
    "ChatGPT tool search",
    "Claude product search",
    "Perplexity AI tools",
    "search engine indexing",
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
