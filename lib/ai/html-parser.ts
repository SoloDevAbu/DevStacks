import * as cheerio from "cheerio"

export interface ParsedHtmlData {
  title: string
  metaDescription: string
  ogImage?: string
  cleanedText: string
  socialLinks: {
    githubUrl?: string
    twitterUrl?: string
    linkedinUrl?: string
    discordUrl?: string
    appStoreUrl?: string
    playStoreUrl?: string
    chromeExtensionUrl?: string
  }
}

export const parseHtmlContent = (
  html: string,
  baseUrl: string
): ParsedHtmlData => {
  const $ = cheerio.load(html)

  const ogTitle = $('meta[property="og:title"]').attr("content")?.trim() || ""
  const docTitle = $("title").first().text().trim()
  const title = ogTitle || docTitle || ""

  const ogDesc =
    $('meta[property="og:description"]').attr("content")?.trim() || ""
  const metaDesc =
    $('meta[name="description"]').attr("content")?.trim() || ""
  const metaDescription = ogDesc || metaDesc || ""

  const ogImage =
    $('meta[property="og:image"]').attr("content")?.trim() ||
    $('meta[name="twitter:image"]').attr("content")?.trim()

  const socialLinks: ParsedHtmlData["socialLinks"] = {}

  $("a[href]").each((_, el) => {
    const rawHref = $(el).attr("href")?.trim()
    if (!rawHref) return

    let absoluteHref = rawHref
    try {
      absoluteHref = new URL(rawHref, baseUrl).toString()
    } catch {
      return
    }

    const lower = absoluteHref.toLowerCase()

    if (
      !socialLinks.githubUrl &&
      (lower.includes("github.com/") &&
        !lower.includes("/login") &&
        !lower.includes("/signup"))
    ) {
      socialLinks.githubUrl = absoluteHref
    } else if (
      !socialLinks.twitterUrl &&
      (lower.includes("twitter.com/") || lower.includes("x.com/")) &&
      !lower.includes("/intent/") &&
      !lower.includes("/share")
    ) {
      socialLinks.twitterUrl = absoluteHref
    } else if (
      !socialLinks.discordUrl &&
      (lower.includes("discord.gg/") || lower.includes("discord.com/invite/"))
    ) {
      socialLinks.discordUrl = absoluteHref
    } else if (
      !socialLinks.linkedinUrl &&
      lower.includes("linkedin.com/company/")
    ) {
      socialLinks.linkedinUrl = absoluteHref
    } else if (
      !socialLinks.appStoreUrl &&
      lower.includes("apps.apple.com/")
    ) {
      socialLinks.appStoreUrl = absoluteHref
    } else if (
      !socialLinks.playStoreUrl &&
      lower.includes("play.google.com/store/apps/")
    ) {
      socialLinks.playStoreUrl = absoluteHref
    } else if (
      !socialLinks.chromeExtensionUrl &&
      lower.includes("chromewebstore.google.com/detail/")
    ) {
      socialLinks.chromeExtensionUrl = absoluteHref
    }
  })

  // Remove scripts, styles, iframes, svgs, and noisy chrome
  $("script, style, noscript, svg, iframe, nav, footer").remove()

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()

  const cleanedText = bodyText.slice(0, 15000)

  return {
    title,
    metaDescription,
    ogImage,
    cleanedText,
    socialLinks,
  }
}

