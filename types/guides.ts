import type { FaqItem } from "@/constants/faqs"
import type { GlossaryLink } from "@/types/glossary"

export interface GuideSection {
  heading: string
  // Markdown body; headings inside start at `###` because the section heading is the `##`.
  body: string
}

export interface Guide {
  slug: string
  title: string
  metaTitle: string
  description: string
  publishedOn: string
  updatedOn: string
  keywords: readonly string[]
  keyTakeaways: readonly string[]
  sections: readonly GuideSection[]
  faqs: readonly FaqItem[]
  relatedLinks: readonly GlossaryLink[]
}
