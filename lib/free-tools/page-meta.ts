import * as cheerio from "cheerio"

export interface PageMeta {
  title: string
  description: string
  siteName: string
  links: string[]
}

const clean = (value: string | undefined) =>
  value?.replace(/\s+/g, " ").trim() ?? ""

const resolveLink = (href: string, baseUrl: string) => {
  try {
    return new URL(href, baseUrl).toString()
  } catch {
    return null
  }
}

export const readPageMeta = (html: string, baseUrl: string): PageMeta => {
  const $ = cheerio.load(html)
  const meta = (selector: string) => clean($(selector).attr("content"))

  return {
    title:
      clean($("title").first().text()) || meta('meta[property="og:title"]'),
    description:
      meta('meta[name="description"]') ||
      meta('meta[property="og:description"]'),
    siteName: meta('meta[property="og:site_name"]'),
    links: $("a[href]")
      .map((_, element) => resolveLink($(element).attr("href") ?? "", baseUrl))
      .get()
      .filter((link): link is string => link !== null),
  }
}
