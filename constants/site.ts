const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devstacks.io"

export const SITE_CONFIG = {
  name: "DevStacks",
  shortName: "DevStacks",
  tagline: "Discover Developer Tools, APIs & Products",
  description:
    "Discover developer tools, APIs, and infrastructure products. Explore what developers are building, community upvotes, and battle-tested tech stacks.",
  url: siteUrl,
  domain: "devstacks.io",
  creator: "DevStacks Team",
  publisher: "DevStacks",
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
  ],
  socials: {
    twitter: "https://x.com/devstacks",
    github: "https://github.com/devstacks",
    discord: "https://discord.gg/devstacks",
  },
  themeColor: "#0f172a",
} as const
