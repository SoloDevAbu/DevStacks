import { LLMS_TXT_ACCEPT, LLMS_TXT_GENERATOR } from "@/constants/free-tools"
import {
  buildLlmsTxt,
  cleanPageTitle,
  groupUrlsBySection,
  pickSiteName,
  toLinkTitle,
  truncateDescription,
  type LlmsTxtLinkDraft,
  type LlmsTxtSectionDraft,
} from "@/lib/free-tools/llms-txt-generator"
import { validateLlmsTxt } from "@/lib/free-tools/llms-txt-validator"
import { readPageMeta, type PageMeta } from "@/lib/free-tools/page-meta"
import { getSitemapUrls } from "@/lib/free-tools/robots"
import {
  fetchPublicResource,
  isTextResource,
  type PublicResource,
} from "@/lib/free-tools/safe-fetch"
import { findSitemapPages } from "@/lib/free-tools/sitemap"
import type { LlmsTxtReport } from "@/types/free-tools"
import { mapInBatches } from "@/utils/async"

const EMPTY_META: PageMeta = {
  title: "",
  description: "",
  siteName: "",
  links: [],
}
const GONE_STATUSES = new Set([404, 410])

const isHtmlPage = (
  resource: PublicResource | null
): resource is PublicResource =>
  resource?.status === 200 && resource.contentType.includes("html")

interface SiteIdentity {
  name: string
  description: string
}

const describeLink = async (
  url: string,
  site: SiteIdentity
): Promise<LlmsTxtLinkDraft | null> => {
  const page = await fetchPublicResource(
    url,
    undefined,
    LLMS_TXT_GENERATOR.PAGE_MAX_BYTES
  )
  if (page && GONE_STATUSES.has(page.status)) return null
  const meta = isHtmlPage(page) ? readPageMeta(page.body, url) : EMPTY_META
  // Many sites reuse the homepage description on every page, which says nothing about the link.
  const description =
    meta.description === site.description ? "" : meta.description
  return {
    url,
    title: cleanPageTitle(meta.title, site.name) || toLinkTitle(url),
    description: truncateDescription(description),
  }
}

const describeSections = async (
  groups: ReturnType<typeof groupUrlsBySection>,
  site: SiteIdentity
): Promise<LlmsTxtSectionDraft[]> => {
  const urls = groups.flatMap((group) => group.urls)
  const links = await mapInBatches(
    urls,
    LLMS_TXT_GENERATOR.PAGE_CONCURRENCY,
    (url) => describeLink(url, site)
  )
  const byUrl = new Map(urls.map((url, index) => [url, links[index]]))

  return groups
    .map(({ heading, urls: sectionUrls }) => ({
      heading,
      links: sectionUrls
        .map((url) => byUrl.get(url))
        .filter((link): link is LlmsTxtLinkDraft => Boolean(link)),
    }))
    .filter((section) => section.links.length > 0)
}

const findLinkSource = async (
  robotsTxt: string,
  origin: string,
  homepage: PublicResource | null,
  homeMeta: PageMeta
) => {
  const sitemapUrls = [
    ...new Set([...getSitemapUrls(robotsTxt), `${origin}/sitemap.xml`]),
  ]
  const sitemap = await findSitemapPages(sitemapUrls)
  if (sitemap) return { url: sitemap.url, pages: sitemap.pages }
  return homeMeta.links.length > 0 && homepage
    ? { url: homepage.finalUrl, pages: homeMeta.links }
    : null
}

// Returns null when neither the homepage nor /llms.txt can be fetched, so the caller can report it as unreachable.
export const runLlmsTxtCheck = async (
  siteUrl: URL
): Promise<LlmsTxtReport | null> => {
  const { origin } = siteUrl
  const llmsTxtUrl = `${origin}/llms.txt`
  const [homepage, robots, llms] = await Promise.all([
    fetchPublicResource(siteUrl.toString()),
    fetchPublicResource(`${origin}/robots.txt`, "text/plain"),
    fetchPublicResource(llmsTxtUrl, LLMS_TXT_ACCEPT),
  ])
  if (!homepage && !llms) return null

  const homeMeta = isHtmlPage(homepage)
    ? readPageMeta(homepage.body, homepage.finalUrl)
    : EMPTY_META
  const site: SiteIdentity = {
    name: pickSiteName(homeMeta.siteName, homeMeta.title, siteUrl.hostname),
    description: homeMeta.description,
  }
  const robotsTxt = isTextResource(robots) ? robots.body : ""
  const linkSource = await findLinkSource(robotsTxt, origin, homepage, homeMeta)
  const sections = await describeSections(
    groupUrlsBySection(linkSource?.pages ?? [], siteUrl),
    site
  )

  return {
    url: homepage?.finalUrl ?? origin,
    llmsTxtUrl,
    hasLlmsTxt: isTextResource(llms),
    checks: validateLlmsTxt(llms),
    generated: buildLlmsTxt({
      siteName: site.name,
      summary:
        truncateDescription(site.description) ||
        LLMS_TXT_GENERATOR.SUMMARY_PLACEHOLDER,
      sections,
    }),
    linkCount: sections.reduce((total, { links }) => total + links.length, 0),
    linkSource: linkSource?.url ?? null,
    checkedAt: new Date().toISOString(),
  }
}
