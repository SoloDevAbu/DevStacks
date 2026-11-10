import * as cheerio from "cheerio"
import {
  DIRECTORY_CHECK,
  DIRECTORY_CHECK_OUTCOME,
  LINK_PATH,
  type LinkPath,
} from "@/constants/directories"
import {
  isBotChallenge,
  isUnfollowedRel,
  normalizeHost,
  pageBlocksLinks,
  resolveHref,
} from "@/lib/links/html-links"
import type { DirectoryCheckResult, DirectorySample } from "@/types/directory"

// domhandler is not a direct dependency, so its node type is taken from cheerio.load.
type Element = Exclude<
  Parameters<typeof cheerio.load>[0],
  string | Buffer | readonly unknown[]
>

const PAGE_GONE_STATUSES = [404, 410]
const BLOCKED_STATUSES = [401, 403, 429]
const REDIRECT_PATH_PATTERN = /\/(visit|go|out|r|redirect|link|click)(\/|$|\?)/i

const requestInit = (redirect: RequestRedirect): RequestInit => ({
  redirect,
  signal: AbortSignal.timeout(DIRECTORY_CHECK.TIMEOUT_MS),
  headers: {
    "User-Agent": DIRECTORY_CHECK.USER_AGENT,
    Accept: "text/html,application/xhtml+xml",
  },
})

const failure = (
  outcome: DirectoryCheckResult["outcome"],
  httpStatus: number | null = null
): DirectoryCheckResult => ({ outcome, rel: null, linkPath: null, httpStatus })

const trimSlash = (path: string) => path.replace(/\/+$/, "")

const matchesTarget = (url: URL | null, target: URL) =>
  Boolean(url) &&
  normalizeHost(url!.hostname) === normalizeHost(target.hostname) &&
  trimSlash(url!.pathname).startsWith(trimSlash(target.pathname))

const isOnDirectory = (url: URL, page: URL) => {
  const host = normalizeHost(url.hostname)
  const pageHost = normalizeHost(page.hostname)
  return host === pageHost || host.endsWith(`.${pageHost}`)
}

// A directory's own "visit" link (betalist.com/.../visit, l.dang.ai/xyz) only counts once its
// redirects are shown to end at the product. The product page itself is never requested.
const redirectsToTarget = async (start: URL, target: URL) => {
  let current = start
  for (let hop = 0; hop < DIRECTORY_CHECK.MAX_REDIRECT_HOPS; hop++) {
    const response = await fetch(current, requestInit("manual"))
    const location = response.headers.get("location")
    if (response.status < 300 || response.status >= 400 || !location) {
      return false
    }
    const next = resolveHref(location, current)
    if (!next) return false
    if (matchesTarget(next, target)) return true
    current = next
  }
  return false
}

const findRedirectLinks = async (
  $: cheerio.CheerioAPI,
  anchors: Element[],
  page: URL,
  target: URL
) => {
  const candidates = [
    ...new Set(
      anchors
        .map((anchor) => resolveHref($(anchor).attr("href") ?? "", page))
        .filter(
          (url): url is URL =>
            Boolean(url) &&
            isOnDirectory(url!, page) &&
            (normalizeHost(url!.hostname) !== normalizeHost(page.hostname) ||
              REDIRECT_PATH_PATTERN.test(url!.pathname))
        )
        .map((url) => url.href)
    ),
  ].slice(0, DIRECTORY_CHECK.MAX_REDIRECT_CANDIDATES)

  for (const candidate of candidates) {
    try {
      if (await redirectsToTarget(new URL(candidate), target)) {
        return anchors.filter(
          (anchor) =>
            resolveHref($(anchor).attr("href") ?? "", page)?.href === candidate
        )
      }
    } catch {
      continue
    }
  }
  return []
}

const toResult = (
  $: cheerio.CheerioAPI,
  links: Element[],
  linkPath: LinkPath,
  robotsHeader: string | null,
  httpStatus: number
): DirectoryCheckResult => {
  const followed = links.find((link) => !isUnfollowedRel($(link).attr("rel")))
  const isDofollow = Boolean(followed) && !pageBlocksLinks($, robotsHeader)
  const reported = followed ?? links[0]

  return {
    outcome: isDofollow
      ? DIRECTORY_CHECK_OUTCOME.DOFOLLOW
      : DIRECTORY_CHECK_OUTCOME.NOFOLLOW,
    rel: $(reported).attr("rel")?.trim() || null,
    linkPath,
    httpStatus,
  }
}

export const checkDirectoryListing = async (
  sample: DirectorySample
): Promise<DirectoryCheckResult> => {
  const target = new URL(sample.targetUrl)

  let response: Response
  try {
    response = await fetch(sample.listingUrl, requestInit("follow"))
  } catch {
    return failure(DIRECTORY_CHECK_OUTCOME.ERROR)
  }

  if (PAGE_GONE_STATUSES.includes(response.status)) {
    return failure(DIRECTORY_CHECK_OUTCOME.PAGE_GONE, response.status)
  }
  if (BLOCKED_STATUSES.includes(response.status)) {
    return failure(DIRECTORY_CHECK_OUTCOME.BLOCKED, response.status)
  }
  if (!response.ok) {
    return failure(DIRECTORY_CHECK_OUTCOME.ERROR, response.status)
  }

  const html = await response.text()
  if (isBotChallenge(response, html)) {
    return failure(DIRECTORY_CHECK_OUTCOME.BLOCKED, response.status)
  }

  const page = new URL(response.url || sample.listingUrl)
  const robotsHeader = response.headers.get("x-robots-tag")
  const $ = cheerio.load(html)
  const anchors = $("a[href]").toArray()

  const directLinks = anchors.filter((anchor) =>
    matchesTarget(resolveHref($(anchor).attr("href") ?? "", page), target)
  )
  if (directLinks.length > 0) {
    return toResult(
      $,
      directLinks,
      LINK_PATH.DIRECT,
      robotsHeader,
      response.status
    )
  }

  const redirectLinks = await findRedirectLinks($, anchors, page, target)
  if (redirectLinks.length > 0) {
    return toResult(
      $,
      redirectLinks,
      LINK_PATH.REDIRECT,
      robotsHeader,
      response.status
    )
  }

  return failure(DIRECTORY_CHECK_OUTCOME.LINK_NOT_FOUND, response.status)
}
