import { slugify } from "../utils/slug"

export interface OfficialCategory {
  name: string
  slug: string
  description?: string
}

export const OFFICIAL_CATEGORY_NAMES = [
  "Advertising",
  "AI",
  "AI Agents",
  "AI Automation",
  "AI Image",
  "AI Video",
  "Analytics",
  "Blockchain",
  "Blogging",
  "Bookmarking",
  "Branding",
  "Chrome Extensions",
  "Coding",
  "Crypto",
  "Design",
  "Design Resources",
  "Developer Tools",
  "Directory",
  "E-commerce",
  "Education",
  "Email",
  "Email Marketing",
  "Entertainment",
  "Figma Plugins",
  "Figma Templates",
  "Finance",
  "Framer Templates",
  "Gaming",
  "Hiring",
  "Icon Sets",
  "Image",
  "Internet of Things",
  "Link in Bio",
  "Marketing",
  "Mobile Apps",
  "News",
  "Newsletter",
  "Notion Templates",
  "Podcast",
  "Productivity",
  "Programming Languages",
  "Project Management",
  "Research",
  "Resume Builders",
  "SaaS",
  "SEO",
  "Social Media Management",
  "Social Network",
  "UI Kits",
  "Vibe Coding",
  "Video",
  "Video Editing",
  "Web Templates",
  "Web3",
  "Webflow Templates",
  "Website Builders",
  "Wireframing",
] as const

export type OfficialCategoryName = (typeof OFFICIAL_CATEGORY_NAMES)[number]

export const OFFICIAL_CATEGORIES: OfficialCategory[] =
  OFFICIAL_CATEGORY_NAMES.map((name) => ({
    name,
    slug: slugify(name, "category"),
  }))

export const OFFICIAL_CATEGORY_SLUG_MAP = new Map<string, OfficialCategory>(
  OFFICIAL_CATEGORIES.map((c) => [c.slug, c])
)

export const OFFICIAL_CATEGORY_NAME_MAP = new Map<string, OfficialCategory>(
  OFFICIAL_CATEGORIES.map((c) => [c.name.toLowerCase(), c])
)

/**
 * 301 Permanent Redirects for all legacy/arbitrary slugs that existed in production.
 * Maps legacy slug -> target canonical official slug.
 */
export const LEGACY_CATEGORY_REDIRECTS: Record<string, string> = {
  // Legacy AI variations -> canonical "ai", "ai-video", "ai-image" or specific subcategories
  "ai-machine-learning": "ai",
  "ai-api": "ai",
  "ai-llm-api": "ai",
  "ai-tools": "ai",
  "ai-video": "ai-video",
  "ai-video-tools": "ai-video",
  "ai-video-generator": "ai-video",
  "ai-video-generation": "ai-video",
  "aiai-video": "ai-video",
  "ai-image": "ai-image",
  "ai-image-generator": "ai-image",
  "ai-image-editing": "ai-image",
  "ai-translation": "ai",
  "ai-education": "education",
  "ai-seo-marketing": "seo",

  // Legacy DevTools / Infra variations -> canonical developer tools / coding
  frameworks: "developer-tools",
  databases: "developer-tools",
  "devops-containers": "developer-tools",
  "hosting-deployment": "developer-tools",
  payments: "finance",
  "css-styling": "design-resources",
  "orm-database-tools": "developer-tools",
  "developer-collaboration": "developer-tools",
  "infrastructure-cdn": "developer-tools",
  "api-tools": "developer-tools",
  "monitoring-error-tracking": "developer-tools",
  authentication: "developer-tools",
  "email-communications": "email",
  runtimes: "developer-tools",
  "build-tools": "developer-tools",
  "serverless-data": "developer-tools",
  "search-discovery": "developer-tools",
  "developer-productivity": "productivity",
  testing: "developer-tools",
  "mcp-servers-marketing-analytics": "analytics",
  "financial-data-apis": "finance",

  // Legacy Products variations
  "business-directory": "directory",
  "seo-tools": "seo",
  "design-gaming-ai": "design",
  "real-estate-data": "analytics",
  "fintech-prediction-markets": "finance",
  "home-interior-design": "design",
  "free-guest-trial-credits-after-google-sign-in-paid-plans-on-waitlist-mvp":
    "ai-image",
}

export const getCanonicalCategory = (raw: string): OfficialCategory | null => {
  if (!raw) return null
  const clean = raw.trim().toLowerCase()
  const cleanSlug = slugify(clean, "category")

  // 1. Direct match on official slug
  if (OFFICIAL_CATEGORY_SLUG_MAP.has(cleanSlug)) {
    return OFFICIAL_CATEGORY_SLUG_MAP.get(cleanSlug)!
  }

  // 2. Direct match on official name
  if (OFFICIAL_CATEGORY_NAME_MAP.has(clean)) {
    return OFFICIAL_CATEGORY_NAME_MAP.get(clean)!
  }

  // 3. Match via legacy redirect map
  if (LEGACY_CATEGORY_REDIRECTS[cleanSlug]) {
    const targetSlug = LEGACY_CATEGORY_REDIRECTS[cleanSlug]
    return OFFICIAL_CATEGORY_SLUG_MAP.get(targetSlug) || null
  }

  return null
}
