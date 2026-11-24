import type { FaqItem } from "@/constants/faqs"

export type FreeToolSlug =
  | "domain-rating-checker"
  | "bulk-domain-rating-checker"
  | "ai-readiness-checker"

export interface FreeToolGuideSection {
  heading: string
  paragraphs: readonly string[]
}

export interface FreeTool {
  slug: FreeToolSlug
  name: string
  metaTitle: string
  metaDescription: string
  tagline: string
  cardDescription: string
  howTo: readonly { name: string; text: string }[]
  guide: readonly FreeToolGuideSection[]
  faqs: readonly FaqItem[]
}

export interface DomainRatingResult {
  domain: string
  domainRating: number | null
  error: string | null
}

export interface DomainRatingResponse {
  results: DomainRatingResult[]
}

export type AiReadinessStatus = "pass" | "warn" | "fail"

export interface AiReadinessCheckResult {
  id: string
  label: string
  status: AiReadinessStatus
  detail: string
}

export interface AiCrawlerAccess {
  name: string
  owner: string
  allowed: boolean
}

export interface AiReadinessReport {
  url: string
  score: number
  checks: AiReadinessCheckResult[]
  crawlers: AiCrawlerAccess[]
  checkedAt: string
}
