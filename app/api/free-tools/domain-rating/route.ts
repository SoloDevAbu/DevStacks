import { type NextRequest, NextResponse } from "next/server"
import { DOMAIN_RATING_API, DOMAIN_RATING_ERRORS } from "@/constants/free-tools"
import {
  getAhrefsApiKey,
  lookupDomainRatings,
  normalizeDomain,
} from "@/lib/free-tools/domain-rating"
import type { DomainRatingResponse } from "@/types/free-tools"

export const POST = async (req: NextRequest) => {
  const body = (await req.json().catch(() => null)) as {
    domains?: unknown
  } | null
  const rawDomains = Array.isArray(body?.domains)
    ? body.domains.filter((value): value is string => typeof value === "string")
    : []

  if (rawDomains.length === 0) {
    return NextResponse.json(
      { error: "Enter at least one domain." },
      { status: 400 }
    )
  }
  if (rawDomains.length > DOMAIN_RATING_API.BULK_MAX_DOMAINS) {
    return NextResponse.json(
      {
        error: `Check up to ${DOMAIN_RATING_API.BULK_MAX_DOMAINS} domains at a time.`,
      },
      { status: 400 }
    )
  }

  const apiKey = getAhrefsApiKey()
  if (!apiKey) {
    return NextResponse.json(
      { error: DOMAIN_RATING_ERRORS.UNAVAILABLE },
      { status: 503 }
    )
  }

  const normalized = rawDomains.map((raw) => ({
    raw: raw.trim(),
    domain: normalizeDomain(raw),
  }))
  const validDomains = [
    ...new Set(normalized.flatMap(({ domain }) => (domain ? [domain] : []))),
  ]
  const ratings = new Map(
    (await lookupDomainRatings(validDomains, apiKey)).map((result) => [
      result.domain,
      result,
    ])
  )

  const seen = new Set<string>()
  const results = normalized.flatMap(({ raw, domain }) => {
    if (!domain)
      return [
        {
          domain: raw,
          domainRating: null,
          error: DOMAIN_RATING_ERRORS.INVALID_DOMAIN,
        },
      ]
    if (seen.has(domain)) return []
    seen.add(domain)
    return [ratings.get(domain)!]
  })

  return NextResponse.json<DomainRatingResponse>({ results })
}
