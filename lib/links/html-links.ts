import * as cheerio from "cheerio"

const UNFOLLOWED_REL_TOKENS = ["nofollow", "ugc", "sponsored"]
const BLOCKING_ROBOTS_DIRECTIVES = ["nofollow", "noindex", "none"]
const BOT_CHALLENGE_TITLE = "just a moment"

export const normalizeHost = (host: string) =>
  host.replace(/^www\./, "").toLowerCase()

export const hasToken = (value: string | null | undefined, tokens: string[]) =>
  (value ?? "")
    .toLowerCase()
    .split(/[\s,]+/)
    .some((token) => tokens.includes(token))

export const isUnfollowedRel = (rel: string | null | undefined) =>
  hasToken(rel, UNFOLLOWED_REL_TOKENS)

// A page-level robots "nofollow" (meta tag or X-Robots-Tag header) unfollows every link on it,
// whatever each link's own rel says.
export const pageBlocksLinks = (
  $: cheerio.CheerioAPI,
  robotsHeader?: string | null
) =>
  [robotsHeader, $('meta[name="robots" i]').attr("content")].some((value) =>
    hasToken(value, BLOCKING_ROBOTS_DIRECTIVES)
  )

export const isBotChallenge = (response: Response, html: string) =>
  response.headers.has("cf-mitigated") ||
  cheerio
    .load(html)("title")
    .text()
    .trim()
    .toLowerCase()
    .startsWith(BOT_CHALLENGE_TITLE)

export const resolveHref = (href: string, base: URL): URL | null => {
  try {
    return new URL(href, base)
  } catch {
    return null
  }
}
