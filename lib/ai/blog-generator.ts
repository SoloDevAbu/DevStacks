import { GoogleGenAI } from "@google/genai"
import dns from "node:dns"
import { normalizeUrl, isSafeUrl, fetchHtmlSafely } from "@/lib/ai/url-security"

try {
  dns.setDefaultResultOrder("ipv4first")
} catch {
  // Ignore in environments where setDefaultResultOrder is not supported
}
import { parseHtmlContent } from "@/lib/ai/html-parser"
import { getCachedUrlAiData } from "@/db/queries/ai/url-cache"
import { SITE_CONFIG } from "@/constants/site"
import { slugify } from "@/utils/slug"
import type { Tool, Product } from "@/db/schema"
export interface GeneratedBlogData {
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  excerpt: string
  verdictSummary: string
  verdictRating: number
  pros: string[]
  cons: string[]
  readingTimeMinutes: number
  contentMarkdown: string
  faqs: Array<{ question: string; answer: string }>
}

export interface LaunchItemData {
  itemType: "tool" | "product"
  name: string
  tagline: string
  description: string
  websiteUrl: string
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  targetAudience?: string | null
  useCases?: string | null
  keywords?: string | null
  pricing?: string | null
  tier?: string | null
  categoryName?: string | null
  tags?: string[]
  platforms?: string[]
  builtWithTools?: string[]
  images?: string[]
  demoVideoUrl?: string | null
  githubUrl?: string | null
  faqs?: Array<{ question: string; answer: string }>
}

export const generateLaunchBlog = async (
  item: LaunchItemData
): Promise<GeneratedBlogData> => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the server. Please check your environment variables."
    )
  }

  // 1. Hybrid Grounding: Scrape web content if cache is missing or item details are minimal
  let scrapedTitle = ""
  let scrapedDescription = ""
  let scrapedContent = ""
  let detectedTech: string[] = []

  const normalizedUrl = normalizeUrl(item.websiteUrl)
  const isMinimal =
    !item.problemStatement && !item.solution && !item.uniqueValue

  // Check cache first
  try {
    const cached = await getCachedUrlAiData(normalizedUrl)
    if (cached) {
      scrapedTitle = cached.name || ""
      scrapedDescription = cached.description || ""
      detectedTech = cached.builtWithTools?.map((t) => t.name) || []
    }
  } catch (err) {
    console.warn("[Blog Gen - Cache lookup warning]:", err)
  }

  // If minimal or missing scraped text, fetch and parse HTML safely
  if (isMinimal || !scrapedDescription) {
    try {
      const safety = isSafeUrl(normalizedUrl)
      if (safety.safe) {
        const { html } = await fetchHtmlSafely(normalizedUrl)
        const parsed = parseHtmlContent(html, normalizedUrl)
        scrapedTitle = parsed.title
        scrapedDescription = parsed.metaDescription
        scrapedContent = parsed.cleanedText.slice(0, 4000) // Keep context concise and high-signal
      }
    } catch (crawlErr) {
      console.warn(
        `[Blog Gen - Scrape fallback skipped for ${item.websiteUrl}]:`,
        crawlErr
      )
    }
  }

  // 2. Combine tech stack signals
  const mergedTechStack = Array.from(
    new Set([
      ...(item.builtWithTools || []),
      ...detectedTech,
      ...(item.tags || []).filter((t) =>
        [
          "react",
          "next.js",
          "tailwind",
          "typescript",
          "postgres",
          "postgresql",
          "supabase",
          "prisma",
          "drizzle",
          "node",
          "python",
          "go",
          "rust",
          "docker",
          "stripe",
          "aws",
          "cloudflare",
          "vercel",
        ].includes(t.toLowerCase())
      ),
    ])
  )

  // 3. Assemble prompt context
  const context = {
    brandName: item.name,
    tagline: item.tagline,
    officialUrl: item.websiteUrl,
    pricing: item.pricing || "Free",
    tier: item.tier || "premium",
    category: item.categoryName || "Developer Tools & Software",
    platforms: item.platforms || ["Web"],
    techStack:
      mergedTechStack.length > 0 ? mergedTechStack : ["Modern Web Stack"],
    problemStatement:
      item.problemStatement || "Modern developers need streamlined workflows.",
    solution: item.solution || item.description,
    uniqueValue: item.uniqueValue || "High performance and developer focus.",
    useCases:
      item.useCases || "Engineering teams, indie hackers, and SaaS builders.",
    targetAudience:
      item.targetAudience || "Software engineers and product builders.",
    existingFaqs: item.faqs || [],
    scrapedWebTitle: scrapedTitle,
    scrapedWebDescription: scrapedDescription,
    scrapedWebContentSample: scrapedContent || "N/A",
    screenshotsCount: (item.images || []).length,
    demoVideoAvailable: Boolean(item.demoVideoUrl),
    githubAvailable: Boolean(item.githubUrl),
  }

  const systemPrompt = `You are a Senior Technical Editor, Staff Software Architect, and Technical Writer for ${SITE_CONFIG.name} (${SITE_CONFIG.domain}).
Your task is to write an in-depth, highly personalized, and objective Technical Architecture Spotlight & Launch Breakdown for "${context.brandName}".

AUDIENCE: Software engineers, technical founders, CTOs, and modern product builders.

STRICT EDITORIAL RULES:
1. STRICT ANTI-HALLUCINATION & FACTUAL GROUNDING:
   - Never invent nonexistent features, enterprise certifications, or fake integrations.
   - Base all claims strictly on the provided facts, scraped website data, and detected tech stack.
   - If a specific metric or architectural detail is unstated, speak accurately about the design pattern rather than making up numbers.

2. FORBIDDEN AI CLICHÉS (STRICTLY PROHIBITED):
   - Do NOT use phrases like: "In today's fast-paced digital world", "In the rapidly evolving landscape", "game-changer", "testament to", "delve into", "unleash the power", "revolutionary", "look no further", "beacon of hope".
   - Adopt a direct, analytical, developer-first voice. Write like an experienced principal engineer analyzing software architecture on Hacker News, The New Stack, or LogRocket Blog.

3. TITLE & SLUG NAMING CONVENTIONS (CRITICAL):
   - "title": MUST strictly follow the format: "${context.brandName}: <What It Actually Is>"
     * Examples:
       - "LaunchNests Ship: Directory Playbook & Automated Agent Submission"
       - "DevPulse: Real-Time Next.js Telemetry & Performance Monitoring"
       - "Supabase: Open Source Firebase Alternative on Postgres"
     * STRICTLY FORBIDDEN: NEVER include the word "Review" or "Review:" or "Hands-On Review" in the title or metaTitle. Anchor directly on what the product actually is, its core mechanism, and primary value proposition.
   - "slug": MUST be lowercase kebab-case in the format: "<brand-name>-<short-descriptive-what-it-is-or-capability>"
     * Examples:
       - "${slugify(context.brandName, "blog")}-ai-native-distribution"
       - "${slugify(context.brandName, "blog")}-directory-playbook"
       - "${slugify(context.brandName, "blog")}-telemetry-monitoring"
     * STRICTLY FORBIDDEN: NEVER include the word "review", "-review-", or year numbers (e.g. "-2026") in the slug. Keep it clean, semantic, and focused strictly on the product's function.
   - "metaTitle": Max 60 characters. Format: "${context.brandName}: <Concise Core Value> | ${SITE_CONFIG.name}". NEVER include the word "Review".
   - "metaDescription": 140-160 characters summary explaining what the product does, its tech architecture, and key benefits.

4. ARTICLE STRUCTURE (Full Markdown formatted body in "contentMarkdown"):
   - # [Main Title: e.g., ${context.brandName}: Features & Technical Breakdown]
   - ## Executive Summary & Quick Verdict (40–60 word self-contained summary answering: What is it, who is it for, and does it deliver?)
   - ## The Core Problem: Why Modern Workflows Break (Analyze friction based on the problem statement)
   - ## Architecture & Tech Stack Spotlight (Examine the technology: ${context.techStack.join(", ")}, discussing performance, developer experience, and deployment)
   - ## Deep-Dive: Key Capabilities & Workflows (Detailed walkthrough of 3-4 flagship capabilities)
   - ## Who Is It Built For? (Specific use cases for ${context.targetAudience})
   - ## Transparent Tradeoffs & Considerations (Objective Pros and Cons; no software is perfect)
   - ## Pricing & Value Assessment (Analyze ${context.pricing} tier against industry alternatives)
   - ## Final Verdict & The ${SITE_CONFIG.name} Recommendation

5. STRUCTURED DATA & RATING:
   - Provide a realistic verdict rating between 4.2 and 4.9.
   - Provide 3-4 concrete pros and 2-3 honest limitations/considerations.
   - Provide 3-5 technical FAQs formatted as clean question-and-answer pairs.

RETURN STRICTLY A VALID JSON OBJECT MATCHING THIS SCHEMA:
{
  "title": "string (MUST be: '${context.brandName}: <What It Is>', strictly NO 'Review', 50-70 chars)",
  "slug": "string (kebab-case: '${slugify(context.brandName, "blog")}-<short-capability-or-what-it-is>', strictly NO 'review', NO year)",
  "metaTitle": "string (Max 60 chars, format: '${context.brandName}: <Core Value> | ${SITE_CONFIG.name}', NO 'Review')",
  "metaDescription": "string (140-160 characters summary of what it does and why it matters)",
  "excerpt": "string (1-2 sentences summarizing what the product is and its main capability)",
  "verdictSummary": "string (40-60 words concise technical verdict)",
  "verdictRating": 4.7,
  "pros": ["string", "string", "string"],
  "cons": ["string", "string"],
  "readingTimeMinutes": 6,
  "contentMarkdown": "string (Rich markdown with H2, H3, lists, bold text, code blocks if applicable)",
  "faqs": [
    { "question": "string", "answer": "string" }
  ]
}

DATA CONTEXT:
${JSON.stringify(context, null, 2)}`

  const ai = new GoogleGenAI({ apiKey })
  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite"

  const response = await ai.models.generateContent({
    model: modelName,
    contents: systemPrompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.25,
    },
  })

  const rawJson = response.text?.trim()
  if (!rawJson) {
    throw new Error(
      "Gemini returned an empty response for the blog generation."
    )
  }

  let parsed: Partial<GeneratedBlogData>
  try {
    parsed = JSON.parse(rawJson)
  } catch (parseErr) {
    console.error("[Blog Gen - JSON parse failed]:", rawJson)
    throw new Error("Failed to parse Gemini blog output into structured JSON.")
  }

  let rawSlug = parsed.slug?.trim() || ""
  if (!rawSlug) {
    const descriptivePart = slugify(
      item.tagline?.slice(0, 35) ||
        item.description?.slice(0, 35) ||
        "architecture",
      "blog"
    )
    rawSlug = `${slugify(item.name, "blog")}-${descriptivePart}`
  }

  // Strip any accidental "-review-" or "-review" or year numbers from slug
  let cleanSlug = slugify(rawSlug, "blog")
    .replace(/-review-/g, "-")
    .replace(/-review$/g, "")
    .replace(/-202\d/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "")

  if (!cleanSlug.startsWith(slugify(item.name, "blog"))) {
    cleanSlug = `${slugify(item.name, "blog")}-${cleanSlug}`
  }

  const finalSlug = cleanSlug

  // Clean title: remove any accidental "Review:" or " Review", normalize colons & spaces
  const cleanTitle = (
    parsed.title?.trim() ||
    `${item.name}: ${item.tagline || "Technical Architecture & Deep-Dive"}`
  )
    .replace(/\s+Review:?\s*/gi, ": ")
    .replace(/:\s*Review\s*:/gi, ": ")
    .replace(/:\s*:/g, ":")
    .replace(/\s{2,}/g, " ")
    .trim()

  // Clean metaTitle: remove any accidental "Review", normalize colons & spaces
  const cleanMetaTitle = (
    parsed.metaTitle?.trim() ||
    `${item.name}: ${item.tagline?.slice(0, 35) || "Technical Breakdown"} | ${SITE_CONFIG.name}`
  )
    .replace(/\s+Review:?\s*/gi, ": ")
    .replace(/:\s*Review\s*:/gi, ": ")
    .replace(/:\s*:/g, ":")
    .replace(/\s{2,}/g, " ")
    .trim()

  return {
    title: cleanTitle,
    slug: finalSlug,
    metaTitle: cleanMetaTitle,
    metaDescription:
      parsed.metaDescription?.trim() ||
      `In-depth technical architecture breakdown of ${item.name}. Features, workflows, and developer verdict.`,
    excerpt:
      parsed.excerpt?.trim() ||
      parsed.verdictSummary?.trim() ||
      `${item.name} architecture spotlight and technical breakdown on ${SITE_CONFIG.name}.`,
    verdictSummary:
      parsed.verdictSummary?.trim() ||
      `${item.name} provides a modern solution for developer teams with high performance and streamlined workflows.`,
    verdictRating:
      typeof parsed.verdictRating === "number" &&
      parsed.verdictRating >= 1 &&
      parsed.verdictRating <= 5
        ? parsed.verdictRating
        : 4.7,
    pros:
      Array.isArray(parsed.pros) && parsed.pros.length > 0
        ? parsed.pros.map(String)
        : [
            "Streamlined developer experience",
            "Modern architecture and performance",
            "Focused feature set",
          ],
    cons:
      Array.isArray(parsed.cons) && parsed.cons.length > 0
        ? parsed.cons.map(String)
        : [
            "Early ecosystem maturity",
            "Advanced customization may require developer setup",
          ],
    readingTimeMinutes:
      typeof parsed.readingTimeMinutes === "number" &&
      parsed.readingTimeMinutes > 0
        ? parsed.readingTimeMinutes
        : 6,
    contentMarkdown: parsed.contentMarkdown?.trim() || "",
    faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
  }
}
