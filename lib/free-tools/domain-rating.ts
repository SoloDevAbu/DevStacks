import { DOMAIN_RATING_API, DOMAIN_RATING_ERRORS } from "@/constants/free-tools"
import type { DomainRatingResult } from "@/types/free-tools"

const DOMAIN_PATTERN =
  /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/

// Accepts "https://www.Example.com/path", "example.com" or "www.example.com" and returns "example.com".
export const normalizeDomain = (raw: string): string | null => {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return null
  try {
    const host = new URL(
      /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`
    ).hostname
    const domain = host.replace(/^www\./, "")
    return DOMAIN_PATTERN.test(domain) ? domain : null
  } catch {
    return null
  }
}

export const getAhrefsApiKey = () =>
  process.env[DOMAIN_RATING_API.ENV_KEY] ?? ""

const fetchDomainRating = async (domain: string, apiKey: string) => {
  const url = new URL(DOMAIN_RATING_API.URL)
  url.searchParams.set("target", domain)
  url.searchParams.set("output", "json")

  const response = await fetch(url, {
    headers: { Accept: "application/json", Authorization: `Bearer ${apiKey}` },
    next: { revalidate: DOMAIN_RATING_API.CACHE_SECONDS },
  })
  if (!response.ok) return null

  const data = (await response.json()) as {
    domain_rating?: { domain_rating?: unknown }
  }
  const rating = data.domain_rating?.domain_rating
  return typeof rating === "number" ? rating : null
}

const lookupOne = async (
  domain: string,
  apiKey: string
): Promise<DomainRatingResult> => {
  try {
    const domainRating = await fetchDomainRating(domain, apiKey)
    return {
      domain,
      domainRating,
      error: domainRating === null ? DOMAIN_RATING_ERRORS.LOOKUP_FAILED : null,
    }
  } catch {
    return {
      domain,
      domainRating: null,
      error: DOMAIN_RATING_ERRORS.LOOKUP_FAILED,
    }
  }
}

export const lookupDomainRatings = async (
  domains: readonly string[],
  apiKey: string
): Promise<DomainRatingResult[]> => {
  const results: DomainRatingResult[] = []
  for (
    let start = 0;
    start < domains.length;
    start += DOMAIN_RATING_API.CONCURRENCY
  ) {
    const batch = domains.slice(start, start + DOMAIN_RATING_API.CONCURRENCY)
    results.push(
      ...(await Promise.all(batch.map((domain) => lookupOne(domain, apiKey))))
    )
  }
  return results
}
