import { GoogleGenAI } from "@google/genai"
import { PLATFORMS, type Platform } from "@/constants/platforms"

export interface GeminiExtractedFields {
  name: string
  tagline: string
  description: string
  problemStatement?: string
  solution?: string
  uniqueValue?: string
  useCases?: string
  platforms: string[]
  tags: string[]
  techStack: string[]
}

const ALLOWED_PLATFORMS = PLATFORMS.map((p) => p.id)

export const extractProductDetailsWithGemini = async ({
  url,
  title,
  metaDescription,
  cleanedText,
}: {
  url: string
  title: string
  metaDescription: string
  cleanedText: string
}): Promise<GeminiExtractedFields> => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the server. Please check your environment variables."
    )
  }

  const ai = new GoogleGenAI({ apiKey })

  const prompt = `You are an expert product analyst and launch copywriter for a developer tools and software directory.
Analyze the following webpage content from "${url}" and extract structured information to autofill a launch submission form.

Webpage Title: ${title || "N/A"}
Meta Description: ${metaDescription || "N/A"}
Page Content Sample:
${cleanedText || "N/A"}

Instructions:
1. "name": The clean brand/product name only (do NOT include slogans, tags, or company entity suffixes like Inc/LLC).
2. "tagline": A crisp, punchy one-liner pitch. MUST be between 10 and 60 characters long.
3. "description": A high-converting markdown overview (2-3 concise paragraphs with bullet points for key features).
4. "problemStatement": 1-2 sentences on the exact bottleneck or friction this product eliminates.
5. "solution": 1-2 sentences on how the product technically or functionally solves that problem.
6. "uniqueValue": 1-2 sentences on what differentiates this from alternatives.
7. "useCases": 1-2 sentences describing target engineering roles, workflows, or personas.
8. "platforms": Select strictly from this list of allowed platform identifiers: ${JSON.stringify(ALLOWED_PLATFORMS)}. Default to ["Web"] if it's a web app or SaaS.
9. "tags": 4 to 8 relevant lowercase keywords (e.g. ["analytics", "developer-tools", "react", "postgres"]).
10. "techStack": Detect 3 to 10 technologies, frameworks, libraries, APIs, or databases mentioned or used (e.g. ["Next.js", "Tailwind CSS", "PostgreSQL", "Supabase", "TypeScript", "Vercel", "Stripe", "Docker"]).

Return strictly a valid JSON object matching this schema:
{
  "name": "string",
  "tagline": "string",
  "description": "string",
  "problemStatement": "string",
  "solution": "string",
  "uniqueValue": "string",
  "useCases": "string",
  "platforms": ["string"],
  "tags": ["string"],
  "techStack": ["string"]
}`

  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash"

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  })

  const rawJson = response.text?.trim()
  if (!rawJson) {
    throw new Error("Gemini returned an empty response.")
  }

  try {
    const parsed = JSON.parse(rawJson) as Partial<GeminiExtractedFields>

    const validPlatforms = Array.isArray(parsed.platforms)
      ? parsed.platforms.filter((p) =>
          ALLOWED_PLATFORMS.includes(p as Platform)
        )
      : ["Web"]

    let tagline = (parsed.tagline || "").trim()
    if (tagline.length > 60) {
      tagline = tagline.slice(0, 57).trim() + "..."
    } else if (tagline.length < 10) {
      tagline = (parsed.name || "Modern software product") + " for developers"
    }

    return {
      name: (parsed.name || title || "Untitled Product").trim(),
      tagline,
      description: (
        parsed.description ||
        metaDescription ||
        "Product launch details."
      ).trim(),
      problemStatement: parsed.problemStatement?.trim() || "",
      solution: parsed.solution?.trim() || "",
      uniqueValue: parsed.uniqueValue?.trim() || "",
      useCases: parsed.useCases?.trim() || "",
      platforms: validPlatforms.length > 0 ? validPlatforms : ["Web"],
      tags: Array.isArray(parsed.tags) ? parsed.tags.map((t) => String(t)) : [],
      techStack: Array.isArray(parsed.techStack)
        ? parsed.techStack.map((t) => String(t))
        : [],
    }
  } catch {
    throw new Error("Failed to parse AI response into structured JSON.")
  }
}