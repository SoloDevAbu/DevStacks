import * as cheerio from "cheerio"
import {
  BADGE_CHECK,
  BADGE_CHECK_OUTCOME,
  type BadgeCheckOutcome,
} from "@/constants/badges"
import { SITE_CONFIG } from "@/constants/site"

const UNFOLLOWED_REL_TOKENS = ["nofollow", "ugc", "sponsored"]
const BLOCKING_ROBOTS_DIRECTIVES = ["nofollow", "noindex", "none"]
const PAGE_GONE_STATUSES = [404, 410]
const BOT_CHALLENGE_TITLE = "just a moment"

const normalizeHost = (host: string) => host.replace(/^www\./, "").toLowerCase()

const trimTrailingSlash = (path: string) => path.replace(/\/+$/, "")

const hasToken = (value: string | null | undefined, tokens: string[]) =>
  (value ?? "")
    .toLowerCase()
    .split(/[\s,]+/)
    .some((token) => tokens.includes(token))

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

  const pageBlocksLinks = [
    robotsHeader,
    $('meta[name="robots" i]').attr("content"),
  ].some((value) => hasToken(value, BLOCKING_ROBOTS_DIRECTIVES))
  const hasFollowedLink = listingLinks.some(
    (link) => !hasToken($(link).attr("rel"), UNFOLLOWED_REL_TOKENS)
  )

  return hasFollowedLink && !pageBlocksLinks
    ? BADGE_CHECK_OUTCOME.ACTIVE
    : BADGE_CHECK_OUTCOME.NOT_FOLLOWED
}

const isBotChallenge = (response: Response, html: string) =>
  response.headers.has("cf-mitigated") ||
  cheerio
    .load(html)("title")
    .text()
    .trim()
    .toLowerCase()
    .startsWith(BOT_CHALLENGE_TITLE)

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
