import { LLMS_TXT_GENERATOR } from "@/constants/free-tools"

export interface LlmsTxtLinkDraft {
  url: string
  title: string
  description: string
}

export interface LlmsTxtSectionDraft {
  heading: string
  links: LlmsTxtLinkDraft[]
}

interface SectionUrls {
  heading: string
  urls: string[]
}

const TITLE_SEPARATOR = /\s+[|–—·•-]\s+/
const TITLE_SEPARATOR_CAPTURE = /(\s+[|–—·•-]\s+)/
const NON_PAGE_EXTENSION =
  /\.(xml|txt|json|rss|atom|jpe?g|png|gif|webp|avif|svg|ico|pdf|zip|gz|css|js|mjs|md|mp4|mp3|woff2?)$/i

const bareHost = (hostname: string) => hostname.replace(/^www\./, "")

const compact = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "")

const capitalise = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

const humanise = (segment: string) => {
  let decoded = segment
  try {
    decoded = decodeURIComponent(segment)
  } catch {
    // Keep the raw segment when it is not valid percent-encoding.
  }
  return decoded
    .replace(/\.[a-z0-9]+$/i, "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(capitalise)
    .join(" ")
}

const brandOf = (hostname: string) => compact(bareHost(hostname).split(".")[0])

// Picks the title segment that names the site, so "Pricing | Acme" and "Acme - Home" both give "Acme".
export const pickSiteName = (
  ogSiteName: string,
  title: string,
  hostname: string
) => {
  if (ogSiteName) return ogSiteName
  const segments = title.split(TITLE_SEPARATOR).filter(Boolean)
  const brand = brandOf(hostname)
  return (
    segments.find((segment) => compact(segment) === brand) ??
    segments[0] ??
    bareHost(hostname)
  )
}

// Strips a leading or trailing site-name segment and keeps the rest: "INTA — Life is Timing | Acme".
export const cleanPageTitle = (title: string, siteName: string) => {
  const site = compact(siteName)
  const isSite = (segment = "") => site.length > 0 && compact(segment) === site
  const parts = title.split(TITLE_SEPARATOR_CAPTURE)
  if (parts.length > 1 && isSite(parts.at(-1))) parts.splice(-2)
  if (parts.length > 1 && isSite(parts[0])) parts.splice(0, 2)
  const cleaned = parts.join("").trim()
  return isSite(cleaned) ? "" : cleaned
}

export const toLinkTitle = (url: string) =>
  humanise(new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "")

export const truncateDescription = (text: string) => {
  const { DESCRIPTION_MAX_LENGTH } = LLMS_TXT_GENERATOR
  if (text.length <= DESCRIPTION_MAX_LENGTH) return text
  const cut = text.slice(0, DESCRIPTION_MAX_LENGTH)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:]+$/, "")}…`
}

const toPageUrl = (raw: string, siteUrl: URL) => {
  try {
    const url = new URL(raw, siteUrl)
    const isPage =
      url.protocol === "https:" &&
      bareHost(url.hostname) === bareHost(siteUrl.hostname) &&
      !url.search &&
      url.pathname !== "/" &&
      !NON_PAGE_EXTENSION.test(url.pathname)
    if (!isPage) return null
    url.hash = ""
    return url
  } catch {
    return null
  }
}

const depthOf = (url: URL) => url.pathname.split("/").filter(Boolean).length

// Groups URLs by their first path segment, keeping the order sections first appear in. Shallow pages
// come first in each group; one-page groups such as /pricing are pooled into a top-level section.
export const groupUrlsBySection = (
  rawUrls: readonly string[],
  siteUrl: URL
): SectionUrls[] => {
  const {
    MAX_CANDIDATE_URLS,
    MAX_SECTIONS,
    MAX_LINKS_PER_SECTION,
    TOP_LEVEL_SECTION,
  } = LLMS_TXT_GENERATOR
  const seen = new Set<string>()
  const groups = new Map<string, URL[]>()

  rawUrls.slice(0, MAX_CANDIDATE_URLS).forEach((raw) => {
    const url = toPageUrl(raw, siteUrl)
    const key = url?.pathname.replace(/\/+$/, "")
    if (!url || !key || seen.has(key)) return
    seen.add(key)
    const segment = url.pathname.split("/").filter(Boolean)[0]
    const group = groups.get(segment)
    if (group) group.push(url)
    else groups.set(segment, [url])
  })

  const topLevel: URL[] = []
  const sections: SectionUrls[] = []
  groups.forEach((urls, segment) => {
    if (urls.length === 1 && depthOf(urls[0]) === 1) {
      topLevel.push(urls[0])
      return
    }
    sections.push({
      heading: humanise(segment),
      urls: urls
        .toSorted((a, b) => depthOf(a) - depthOf(b))
        .map((url) => url.toString()),
    })
  })

  return [
    ...(topLevel.length > 0
      ? [
          {
            heading: TOP_LEVEL_SECTION,
            urls: topLevel.map((url) => url.toString()),
          },
        ]
      : []),
    ...sections,
  ]
    .slice(0, MAX_SECTIONS)
    .map((section) => ({
      ...section,
      urls: section.urls.slice(0, MAX_LINKS_PER_SECTION),
    }))
}

const escapeLinkText = (text: string) => text.replace(/[[\]]/g, "")

const formatLink = ({ url, title, description }: LlmsTxtLinkDraft) =>
  `- [${escapeLinkText(title)}](${url})${description ? `: ${description}` : ""}`

export const buildLlmsTxt = ({
  siteName,
  summary,
  sections,
}: {
  siteName: string
  summary: string
  sections: readonly LlmsTxtSectionDraft[]
}) =>
  [
    `# ${siteName}`,
    `> ${summary}`,
    ...sections.map(({ heading, links }) =>
      [`## ${heading}`, "", ...links.map(formatLink)].join("\n")
    ),
  ].join("\n\n") + "\n"
