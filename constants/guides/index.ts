import { SITE_CONFIG } from "@/constants/site"
import { AI_RECOMMENDATIONS_GUIDE } from "@/constants/guides/ai-recommendations"
import { GEO_CHECKLIST_GUIDE } from "@/constants/guides/geo-checklist"
import { LLMS_TXT_GUIDE } from "@/constants/guides/llms-txt"
import { MARKDOWN_FOR_AGENTS_GUIDE } from "@/constants/guides/markdown-for-agents"
import { SHOW_HN_GUIDE } from "@/constants/guides/show-hn"
import { SUBMIT_STARTUP_GUIDE } from "@/constants/guides/submit-startup"
import {
  type ResourceLink,
  STANDALONE_GUIDE_LINKS,
  toGuideLink,
} from "@/constants/internal-links"
import type { Guide } from "@/types/guides"

export const GUIDES: readonly Guide[] = [
  AI_RECOMMENDATIONS_GUIDE,
  LLMS_TXT_GUIDE,
  GEO_CHECKLIST_GUIDE,
  MARKDOWN_FOR_AGENTS_GUIDE,
  SUBMIT_STARTUP_GUIDE,
  SHOW_HN_GUIDE,
]

const GUIDES_BY_SLUG = new Map(GUIDES.map((guide) => [guide.slug, guide]))

export const getGuide = (slug: string) => GUIDES_BY_SLUG.get(slug) ?? null

// Every guide, data-driven and hand-built, as one link list for the hub and its markdown twin.
export const GUIDE_LINKS: readonly ResourceLink[] = [
  ...GUIDES.map(toGuideLink),
  ...STANDALONE_GUIDE_LINKS,
]

export const GUIDES_HUB = {
  title: "Launch & AI Visibility Guides",
  heading: "Guides",
  description: `Practical guides on launching a product and getting it found by Google and AI assistants, written from what we run on ${SITE_CONFIG.name}.`,
} as const

export const GUIDES_UPDATED_ON = GUIDES.reduce(
  (latest, guide) => (guide.updatedOn > latest ? guide.updatedOn : latest),
  GUIDES[0].updatedOn
)
