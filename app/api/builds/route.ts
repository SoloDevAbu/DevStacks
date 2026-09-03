import { type NextRequest, NextResponse } from "next/server"
import { getBuilds } from "@/db/queries/builds/list"
import { createBuild } from "@/db/queries/builds/create"
import { submitBuildSchema } from "@/lib/validation/build"
import { z } from "zod"

const listQuerySchema = z.object({
  productId: z.string().uuid().optional(),
  authorId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
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

    const builds = await getBuilds(parsed.data)
    return NextResponse.json({ data: builds }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch builds" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const parsed = submitBuildSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { productIds, ...buildData } = parsed.data
    const build = await createBuild(buildData, productIds)

    return NextResponse.json({ data: build }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create build" },
      { status: 500 }
    )
  }
}
