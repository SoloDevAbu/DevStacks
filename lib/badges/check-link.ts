import * as cheerio from "cheerio"
import {
  BADGE_CHECK,
  BADGE_CHECK_OUTCOME,
  type BadgeCheckOutcome,
} from "@/constants/badges"
import { SITE_CONFIG } from "@/constants/site"
import {
  isBotChallenge,
  isUnfollowedRel,
  normalizeHost,
  pageBlocksLinks,
} from "@/lib/links/html-links"

const PAGE_GONE_STATUSES = [404, 410]

const trimTrailingSlash = (path: string) => path.replace(/\/+$/, "")

export const toPageUrl = (rawUrl?: string | null): URL | null => {
  const trimmed = rawUrl?.trim()
  if (!trimmed) return null
  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    )
    return url.protocol === "http:" || url.protocol === "https:" ? url : null
  } catch {
    return null
  }
}

export const isOnListingSite = (page: URL, websiteUrl: string): boolean => {
  const site = toPageUrl(websiteUrl)
  if (!site) return false
  const siteHost = normalizeHost(site.hostname)
  const pageHost = normalizeHost(page.hostname)
  return pageHost === siteHost || pageHost.endsWith(`.${siteHost}`)
}

const pointsToListing = (
  href: string,
  pageUrl: URL,
  listingPath: string
): boolean => {
  try {
    const target = new URL(href, pageUrl)
    return (
      normalizeHost(target.hostname) === normalizeHost(SITE_CONFIG.domain) &&
      trimTrailingSlash(target.pathname) === listingPath
    )
  } catch {
    return false
  }
}

export const findBadgeLink = (
  html: string,
  pageUrl: URL,
  listingPath: string,
  robotsHeader?: string | null
): BadgeCheckOutcome => {
  const $ = cheerio.load(html)

  const listingLinks = $("a[href]")
    .toArray()
    .filter((link) =>
      pointsToListing($(link).attr("href") ?? "", pageUrl, listingPath)
    )
  if (listingLinks.length === 0) return BADGE_CHECK_OUTCOME.MISSING

  const hasFollowedLink = listingLinks.some(
    (link) => !isUnfollowedRel($(link).attr("rel"))
  )

  return hasFollowedLink && !pageBlocksLinks($, robotsHeader)
    ? BADGE_CHECK_OUTCOME.ACTIVE
    : BADGE_CHECK_OUTCOME.NOT_FOLLOWED
}

// Only a page that answered can prove a badge is gone. Timeouts, bot walls and server errors are
// reported as inconclusive so a site's outage or firewall never costs its maker the link.
export const checkBadgeLink = async ({
  pageUrl,
  websiteUrl,
  listingPath,
}: {
  pageUrl: string
  websiteUrl: string
  listingPath: string
}): Promise<BadgeCheckOutcome> => {
  const page = toPageUrl(pageUrl)
  if (!page || !isOnListingSite(page, websiteUrl)) {
    return BADGE_CHECK_OUTCOME.WRONG_SITE
  }

  try {
    const response = await fetch(page, {
      signal: AbortSignal.timeout(BADGE_CHECK.TIMEOUT_MS),
      headers: {
        "User-Agent": BADGE_CHECK.USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
    })

    if (PAGE_GONE_STATUSES.includes(response.status)) {
      return BADGE_CHECK_OUTCOME.MISSING
    }
    if (!response.ok) return BADGE_CHECK_OUTCOME.INCONCLUSIVE

    const html = await response.text()
    if (isBotChallenge(response, html)) return BADGE_CHECK_OUTCOME.INCONCLUSIVE

    const finalUrl = response.url ? new URL(response.url) : page
    if (!isOnListingSite(finalUrl, websiteUrl)) {
      return BADGE_CHECK_OUTCOME.WRONG_SITE
    }

    return findBadgeLink(
      html,
      finalUrl,
      listingPath,
      response.headers.get("x-robots-tag")
    )
  } catch {
    return BADGE_CHECK_OUTCOME.INCONCLUSIVE
  }
}
