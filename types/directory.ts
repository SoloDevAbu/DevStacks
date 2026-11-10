import type { ComparisonSource } from "@/types/comparison"
import type {
  DirectoryCheckOutcome,
  DirectoryKind,
  LinkPath,
} from "@/constants/directories"

export interface DirectorySample {
  listingUrl: string
  targetUrl: string
  note?: string
}

export interface LaunchDirectory {
  slug: string
  name: string
  url: string
  kind: DirectoryKind
  summary: string
  freeOption: string | null
  paidOptions: string | null
  statedLinkPolicy: string | null
  reviewTime: string | null
  sources: readonly ComparisonSource[]
  sample: DirectorySample | null
  unmeasuredReason?: string
  comparisonPath?: string
  isOwnSite?: boolean
}

export interface DirectoryCheckResult {
  outcome: DirectoryCheckOutcome
  rel: string | null
  linkPath: LinkPath | null
  httpStatus: number | null
}

export interface DirectoryCheck extends DirectoryCheckResult {
  directorySlug: string
  checkedAt: Date
}
