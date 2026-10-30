import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { normalizeUrl, isSafeUrl, fetchHtmlSafely } from "@/lib/ai/url-security"
import { parseHtmlContent } from "@/lib/ai/html-parser"
import { extractProductDetailsWithGemini } from "@/lib/ai/gemini-extractor"
import { matchDetectedTechToTools } from "@/lib/ai/tool-matcher"
import { getCachedUrlAiData, upsertUrlAiCache } from "@/db/queries/ai/url-cache"
import { rateLimit } from "@/lib/rate-limit"
import type { ExtractedAiData } from "@/db/schema"
import { z } from "zod"

const autofillRequestSchema = z.object({
  url: z.string().min(1, "URL is required"),
  forceRefresh: z.boolean().optional().default(false),
})

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required to use AI autofill." },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await req.json()
    const parsed = autofillRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { url, forceRefresh } = parsed.data

    const safety = isSafeUrl(url)
    if (!safety.safe) {
      return NextResponse.json(
        { error: safety.reason || "The provided URL is not allowed." },
        { status: 400 }
      )
    }

    const normalizedUrl = normalizeUrl(url)

    // 1. Check Cache First (Zero token cost, does not consume rate limits)
    if (!forceRefresh) {
      const cachedData = await getCachedUrlAiData(normalizedUrl)
      if (cachedData) {
        return NextResponse.json(
          {
            success: true,
            cached: true,
            data: cachedData,
          },
          { status: 200 }
        )
      }
    }

    // 2. Fetch HTML safely FIRST to verify accessibility before touching LLM or quota
    let html: string
    try {
      const res = await fetchHtmlSafely(normalizedUrl)
      html = res.html
    } catch (fetchErr: unknown) {
      const errorMsg =
        fetchErr instanceof Error
          ? fetchErr.message
          : "Unable to access the website. Please ensure it is publicly online."
      return NextResponse.json({ error: errorMsg }, { status: 422 })
    }

    // 3. Deterministic HTML parsing & check for readable content
    const parsedHtml = parseHtmlContent(html, normalizedUrl)
    if (!parsedHtml.cleanedText || parsedHtml.cleanedText.length < 30) {
      return NextResponse.json(
        {
          error:
            "Could not extract sufficient text content from this website. Please fill in the details manually.",
        },
        { status: 422 }
      )
    }

    // 4. Rate Limiting (Only applied when we are actually calling the LLM)
    const cooldownResult = rateLimit(`ai-autofill:cooldown:${userId}`, 1, 5_000)
    if (!cooldownResult.success) {
      return NextResponse.json(
        {
          error: "Please wait 5 seconds before triggering another AI request.",
        },
        { status: 429 }
      )
    }

    const dailyResult = rateLimit(
      `ai-autofill:daily:${userId}`,
      5,
      24 * 60 * 60 * 1000
    )
    if (!dailyResult.success) {
      return NextResponse.json(
        {
          error:
            "Daily AI autofill limit reached (5 fresh URLs per day). Try again tomorrow.",
        },
        { status: 429 }
      )
    }

    const monthlyResult = rateLimit(
      `ai-autofill:monthly:${userId}`,
      30,
      30 * 24 * 60 * 60 * 1000
    )
    if (!monthlyResult.success) {
      return NextResponse.json(
        {
          error: "Monthly AI autofill limit reached (30 URLs per month).",
        },
        { status: 429 }
      )
    }

    // 5. Gemini structured extraction with server-side logging and user-safe error
    let geminiData
    try {
      geminiData = await extractProductDetailsWithGemini({
        url: normalizedUrl,
        title: parsedHtml.title,
        metaDescription: parsedHtml.metaDescription,
        cleanedText: parsedHtml.cleanedText,
      })
    } catch (aiErr: unknown) {
      console.error("[AI Autofill - Gemini API Error]:", aiErr)
      return NextResponse.json(
        {
          error:
            "AI generation service is temporarily unavailable. Please try again or fill in the form manually.",
        },
        { status: 502 }
      )
    }

    // 6. Match tech stack to directory tools
    const builtWithTools = await matchDetectedTechToTools(geminiData.techStack)

    // 7. Assemble payload
    const assembledData: ExtractedAiData = {
      name: geminiData.name,
      tagline: geminiData.tagline,
      description: geminiData.description,
      problemStatement: geminiData.problemStatement,
      solution: geminiData.solution,
      uniqueValue: geminiData.uniqueValue,
      useCases: geminiData.useCases,
      platforms: geminiData.platforms,
      tags: geminiData.tags,
      builtWithTools,
      githubUrl: parsedHtml.socialLinks.githubUrl,
      twitterUrl: parsedHtml.socialLinks.twitterUrl,
      linkedinUrl: parsedHtml.socialLinks.linkedinUrl,
      discordUrl: parsedHtml.socialLinks.discordUrl,
      appStoreUrl: parsedHtml.socialLinks.appStoreUrl,
      playStoreUrl: parsedHtml.socialLinks.playStoreUrl,
      chromeExtensionUrl: parsedHtml.socialLinks.chromeExtensionUrl,
    }

    // 8. Cache in Postgres
    await upsertUrlAiCache({
      normalizedUrl,
      extractedData: assembledData,
      userId,
    })

    return NextResponse.json(
      {
        success: true,
        cached: false,
        data: assembledData,
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    console.error("[AI Autofill - Unexpected Error]:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred while analyzing the website." },
      { status: 500 }
    )
  }
}

