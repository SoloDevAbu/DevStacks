import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getTools } from "@/db/queries/tools/list"
import { createTool } from "@/db/queries/tools/create"
import { z } from "zod"

const listQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  pricing: z.enum(["Free", "Freemium", "Paid", "Open Source"]).optional(),
  tier: z.enum(["free", "premium", "premium+"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.enum(["upvotes", "builds", "recent", "views"]).default("upvotes"),
})

const submitToolSchema = z.object({
  name: z.string().min(2).max(100),
  tagline: z.string().min(10).max(200),
  description: z.string().min(20),
  websiteUrl: z.string().url(),
  logoUrl: z.string().optional(),
  githubUrl: z.string().url().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  pricing: z.enum(["Free", "Freemium", "Paid", "Open Source"]).default("Free"),
})

export const GET = async (req: NextRequest) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = listQuerySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const tools = await getTools(parsed.data)
    return NextResponse.json({ data: tools ?? [] }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to submit a tool." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = submitToolSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const tool = await createTool({
      ...parsed.data,
      submitterId: session.user.id,
      tags: parsed.data.tags ?? [],
      platforms: parsed.data.platforms ?? [],
    })

    return NextResponse.json({ data: tool }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message.includes("unique")) {
      return NextResponse.json(
        { error: "A tool with this name already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
  }
}
