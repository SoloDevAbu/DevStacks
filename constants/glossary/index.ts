import { SITE_CONFIG } from "@/constants/site"
import { AI_SEARCH_TERMS } from "@/constants/glossary/ai-search"
import { DEV_TOOL_TERMS } from "@/constants/glossary/dev-tools"
import { LAUNCH_TERMS } from "@/constants/glossary/launch"
import { SEO_TERMS } from "@/constants/glossary/seo"
import type {
  GlossaryCategory,
  GlossaryCategoryId,
  GlossaryTerm,
} from "@/types/glossary"

export const GLOSSARY_CATEGORIES: readonly GlossaryCategory[] = [
  {
    id: "launch",
    label: "Product launch",
    description:
      "Terms for planning, running and following up a software launch.",
  },
  {
    id: "seo",
    label: "SEO and backlinks",
    description:
      "Search engine terms that decide how a new product's pages get found and ranked.",
  },
  {
    id: "ai-search",
    label: "AI search",
    description:
      "Terms for getting a product found, read and cited by AI assistants and agents.",
  },
  {
    id: "dev-tools",
    label: "Developer tools",
    description: "Building blocks developers compare when choosing a stack.",
  },
]

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  ...LAUNCH_TERMS,
  ...SEO_TERMS,
  ...AI_SEARCH_TERMS,
  ...DEV_TOOL_TERMS,
]

const TERMS_BY_SLUG = new Map(GLOSSARY_TERMS.map((term) => [term.slug, term]))

// Bump when term copy changes; drives sitemap lastmod and the visible "updated" date.
export const GLOSSARY_UPDATED_ON = "2026-11-23"

export const GLOSSARY_HUB = {
  title: "Launch, SEO & Developer Tools Glossary",
  heading: "Glossary",
  description: `Plain-English definitions of the product launch, SEO, AI search and developer tool terms makers meet on ${SITE_CONFIG.name}.`,
} as const

export const getGlossaryTerm = (slug: string) => TERMS_BY_SLUG.get(slug) ?? null

export const getGlossaryTermsByCategory = (categoryId: GlossaryCategoryId) =>
  GLOSSARY_TERMS.filter((term) => term.category === categoryId)

export const getGlossaryCategory = (categoryId: GlossaryCategoryId) =>
  GLOSSARY_CATEGORIES.find((category) => category.id === categoryId)

export const getRelatedGlossaryTerms = (term: GlossaryTerm) =>
  term.relatedTerms.flatMap((slug) => TERMS_BY_SLUG.get(slug) ?? [])
