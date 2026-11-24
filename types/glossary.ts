import type { FaqItem } from "@/constants/faqs"

export type GlossaryCategoryId = "launch" | "seo" | "ai-search" | "dev-tools"

export interface GlossaryCategory {
  id: GlossaryCategoryId
  label: string
  description: string
}

export interface GlossaryLink {
  label: string
  href: string
}

export interface GlossaryTerm {
  slug: string
  term: string
  // Grammar for the "What is …?" heading: "What is a backlink?", "What are AI Overviews?".
  article?: "a" | "an" | "the"
  plural?: true
  aliases: readonly string[]
  category: GlossaryCategoryId
  shortDefinition: string
  definition: readonly string[]
  whyItMatters: readonly string[]
  onLaunchNests: string
  relatedTerms: readonly string[]
  relatedLinks: readonly GlossaryLink[]
  faqs: readonly FaqItem[]
}
