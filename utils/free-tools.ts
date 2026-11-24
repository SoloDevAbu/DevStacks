import { DOMAIN_RATING_BANDS } from "@/constants/free-tools"
import type { AiReadinessStatus, DomainRatingResult } from "@/types/free-tools"

export const getDomainRatingBand = (rating: number) =>
  DOMAIN_RATING_BANDS.find(({ min }) => rating >= min)?.label ?? ""

export const formatDomainRating = (rating: number) =>
  Number.isInteger(rating) ? String(rating) : rating.toFixed(1)

export const parseDomainList = (input: string) =>
  input
    .split(/[\s,;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)

export const sortByDomainRating = (results: readonly DomainRatingResult[]) =>
  results.toSorted((a, b) => (b.domainRating ?? -1) - (a.domainRating ?? -1))

const escapeCsv = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value

export const buildDomainRatingCsv = (results: readonly DomainRatingResult[]) =>
  [
    "domain,domain_rating,note",
    ...results.map(({ domain, domainRating, error }) =>
      [
        domain,
        domainRating === null ? "" : formatDomainRating(domainRating),
        error ?? "",
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ].join("\n")

export const AI_READINESS_STATUS_LABEL: Record<AiReadinessStatus, string> = {
  pass: "Pass",
  warn: "Warning",
  fail: "Fail",
}
