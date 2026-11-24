import * as cheerio from "cheerio"
import {
  AI_CRAWLERS,
  AI_READINESS_CHECKS,
  AI_READINESS_THRESHOLDS,
  ENTITY_SCHEMA_TYPES,
  type AiReadinessCheckId,
} from "@/constants/free-tools"
import {
  fetchPublicResource,
  type PublicResource,
} from "@/lib/free-tools/safe-fetch"
import { isPathAllowedForAgent } from "@/lib/free-tools/robots"
import type {
  AiCrawlerAccess,
  AiReadinessCheckResult,
  AiReadinessReport,
  AiReadinessStatus,
} from "@/types/free-tools"

const check = (
  id: AiReadinessCheckId,
  status: AiReadinessStatus,
  detail: string
): AiReadinessCheckResult => ({
  id,
  label: AI_READINESS_CHECKS[id].label,
  status,
  detail,
})

const isOkText = (
  resource: PublicResource | null
): resource is PublicResource =>
  resource !== null &&
  resource.status === 200 &&
  !resource.contentType.includes("text/html") &&
  resource.body.trim().length > 0

const collectSchemaTypes = ($: cheerio.CheerioAPI) => {
  const types = new Set<string>()
  const visit = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(visit)
    if (!node || typeof node !== "object") return
    const record = node as Record<string, unknown>
    const type = record["@type"]
    ;(Array.isArray(type) ? type : [type])
      .filter((value): value is string => typeof value === "string")
      .forEach((value) => types.add(value))
    Object.values(record).forEach(visit)
  }

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      visit(JSON.parse($(element).text()))
    } catch {
      // Invalid JSON-LD is reported as missing types, not as a crash.
    }
  })
  return [...types]
}

const checkPage = (html: string) => {
  const $ = cheerio.load(html)
  const title = $("title").first().text().trim()
  const description = $('meta[name="description"]').attr("content")?.trim()
  const canonical = $('link[rel="canonical"]').attr("href")?.trim()
  const schemaTypes = collectSchemaTypes($)
  $("script, style, noscript, template, svg").remove()
  const textLength = $("body").text().replace(/\s+/g, " ").trim().length

  const entityTypes = schemaTypes.filter((type) =>
    (ENTITY_SCHEMA_TYPES as readonly string[]).includes(type)
  )
  const { RENDERED_TEXT_PASS, RENDERED_TEXT_WARN } = AI_READINESS_THRESHOLDS

  return [
    textLength >= RENDERED_TEXT_PASS
      ? check(
          "SERVER_RENDERED",
          "pass",
          `${textLength.toLocaleString()} characters of text are in the HTML before any JavaScript runs.`
        )
      : check(
          "SERVER_RENDERED",
          textLength >= RENDERED_TEXT_WARN ? "warn" : "fail",
          `Only ${textLength.toLocaleString()} characters of text are in the initial HTML. Many AI crawlers do not run JavaScript, so render key content on the server.`
        ),
    title && description
      ? check("META", "pass", `Title: "${title.slice(0, 70)}".`)
      : check(
          "META",
          title || description ? "warn" : "fail",
          `Missing ${title ? "a meta description" : description ? "a title" : "both a title and a meta description"}.`
        ),
    entityTypes.length > 0
      ? check("STRUCTURED_DATA", "pass", `Found ${schemaTypes.join(", ")}.`)
      : check(
          "STRUCTURED_DATA",
          schemaTypes.length > 0 ? "warn" : "fail",
          schemaTypes.length > 0
            ? `Found ${schemaTypes.join(", ")}, but no Organization, WebSite or product entity.`
            : "No JSON-LD found. Add Organization and WebSite markup so AI tools can identify the brand."
        ),
    canonical
      ? check("CANONICAL", "pass", `Canonical: ${canonical}`)
      : check(
          "CANONICAL",
          "warn",
          "No canonical link. Add one so duplicates resolve to a single URL."
        ),
  ]
}

const checkCrawlers = (robotsTxt: string): AiCrawlerAccess[] =>
  AI_CRAWLERS.map(({ name, owner }) => ({
    name,
    owner,
    allowed: isPathAllowedForAgent(robotsTxt, name),
  }))

const crawlerCheck = (crawlers: AiCrawlerAccess[]) => {
  const blocked = crawlers
    .filter(({ allowed }) => !allowed)
    .map(({ name }) => name)
  if (blocked.length === 0) {
    return check(
      "AI_CRAWLERS",
      "pass",
      "All major AI crawlers may fetch the homepage."
    )
  }
  return check(
    "AI_CRAWLERS",
    blocked.length === crawlers.length ? "fail" : "warn",
    `Blocked: ${blocked.join(", ")}. Blocking search crawlers keeps the site out of those AI answers.`
  )
}

const scoreChecks = (checks: AiReadinessCheckResult[]) =>
  Math.round(
    checks.reduce(
      (total, result) =>
        total +
        AI_READINESS_CHECKS[result.id as AiReadinessCheckId].weight *
          AI_READINESS_THRESHOLDS.STATUS_SCORE[result.status],
      0
    )
  )

// Returns null when the homepage cannot be fetched at all, so the caller can report it as unreachable.
export const runAiReadinessCheck = async (
  siteUrl: URL
): Promise<AiReadinessReport | null> => {
  const origin = siteUrl.origin
  const [homepage, robots, llms, llmsFull, sitemap] = await Promise.all([
    fetchPublicResource(siteUrl.toString()),
    fetchPublicResource(`${origin}/robots.txt`, "text/plain"),
    fetchPublicResource(`${origin}/llms.txt`, "text/markdown,text/plain"),
    fetchPublicResource(`${origin}/llms-full.txt`, "text/markdown,text/plain"),
    fetchPublicResource(`${origin}/sitemap.xml`, "application/xml,text/xml"),
  ])

  if (!homepage || homepage.status >= 500) return null

  const homepageOk =
    homepage.status === 200 && homepage.contentType.includes("html")
  const robotsTxt = isOkText(robots) ? robots.body : ""
  const crawlers = checkCrawlers(robotsTxt)
  const sitemapInRobots = /^\s*sitemap\s*:/im.test(robotsTxt)
  const sitemapOk = sitemap?.status === 200 && sitemap.body.includes("<")

  const checks = [
    homepageOk
      ? check(
          "HOMEPAGE",
          "pass",
          `Returned HTTP 200 from ${homepage.finalUrl}.`
        )
      : check(
          "HOMEPAGE",
          "fail",
          `Returned HTTP ${homepage.status}. Crawlers need a 200 response with HTML.`
        ),
    ...(homepageOk
      ? checkPage(homepage.body)
      : (
          ["SERVER_RENDERED", "META", "STRUCTURED_DATA", "CANONICAL"] as const
        ).map((id) =>
          check(id, "fail", "Skipped because the homepage did not return HTML.")
        )),
    robotsTxt
      ? check("ROBOTS", "pass", "robots.txt found.")
      : check(
          "ROBOTS",
          "warn",
          "No robots.txt. Crawlers assume everything is allowed, but you cannot set AI crawler rules or point to a sitemap."
        ),
    crawlerCheck(crawlers),
    sitemapOk || sitemapInRobots
      ? check(
          "SITEMAP",
          "pass",
          sitemapInRobots
            ? "Sitemap declared in robots.txt."
            : "Found /sitemap.xml."
        )
      : check(
          "SITEMAP",
          "warn",
          "No sitemap at /sitemap.xml or in robots.txt."
        ),
    isOkText(llms)
      ? check(
          "LLMS_TXT",
          llms.body.trimStart().startsWith("#") ? "pass" : "warn",
          llms.body.trimStart().startsWith("#")
            ? "Found /llms.txt."
            : "Found /llms.txt, but it does not start with a Markdown H1 (# Site name)."
        )
      : check(
          "LLMS_TXT",
          "fail",
          "No /llms.txt. Add a short Markdown summary of the site with links to key pages."
        ),
    isOkText(llmsFull)
      ? check("LLMS_FULL_TXT", "pass", "Found /llms-full.txt.")
      : check(
          "LLMS_FULL_TXT",
          "warn",
          "No /llms-full.txt. It is optional, but gives AI tools your full content in one file."
        ),
  ]

  return {
    url: homepage.finalUrl,
    score: scoreChecks(checks),
    checks,
    crawlers,
    checkedAt: new Date().toISOString(),
  }
}
