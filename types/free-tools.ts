import type { FaqItem } from "@/constants/faqs"

export type FreeToolSlug =
  | "domain-rating-checker"
  | "bulk-domain-rating-checker"
  | "ai-readiness-checker"
  | "llms-txt-generator"

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

export type FreeToolCheckStatus = "pass" | "warn" | "fail"

export interface FreeToolCheckResult {
  id: string
  label: string
  status: FreeToolCheckStatus
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
  checks: FreeToolCheckResult[]
  crawlers: AiCrawlerAccess[]
  checkedAt: string
}

export interface LlmsTxtReport {
  url: string
  llmsTxtUrl: string
  hasLlmsTxt: boolean
  checks: FreeToolCheckResult[]
  generated: string
  linkCount: number
  linkSource: string | null
  checkedAt: string
}
