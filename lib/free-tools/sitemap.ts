import { LLMS_TXT_GENERATOR, SITEMAP_ACCEPT } from "@/constants/free-tools"
import { fetchPublicResource } from "@/lib/free-tools/safe-fetch"

const XML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
}

// A regex rather than an XML parser so a sitemap cut off at the byte cap still yields its first URLs.
const readLocs = (xml: string) =>
  [
    ...xml.matchAll(
      /<loc>\s*(?:<!\[CDATA\[)?\s*([^<\s\]]+)\s*(?:\]\]>)?\s*<\/loc>/gi
    ),
  ].map(([, loc]) =>
    loc.replace(/&(?:amp|lt|gt|quot|apos);/g, (entity) => XML_ENTITIES[entity])
  )

const fetchXml = async (url: string) => {
  if (url.endsWith(".gz")) return null
  const resource = await fetchPublicResource(url, SITEMAP_ACCEPT)
  return resource?.status === 200 && resource.body.includes("<loc")
    ? resource.body
    : null
}

const readSitemap = async (url: string) => {
  const xml = await fetchXml(url)
  if (!xml) return []
  if (!/<sitemapindex/i.test(xml)) return readLocs(xml)

  const children = readLocs(xml).slice(0, LLMS_TXT_GENERATOR.MAX_CHILD_SITEMAPS)
  const childXml = await Promise.all(children.map(fetchXml))
  return childXml.flatMap((child) => (child ? readLocs(child) : []))
}

// Tries each sitemap in order and returns the page URLs of the first one that lists any.
export const findSitemapPages = async (sitemapUrls: readonly string[]) => {
  for (const url of sitemapUrls) {
    const pages = await readSitemap(url)
    if (pages.length > 0) return { url, pages }
  }
  return null
}
