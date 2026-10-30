import { type NextRequest, NextResponse } from "next/server"
import { listPublishedBlogs } from "@/db/queries/blogs"
import { z } from "zod"

const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export const GET = async (req: NextRequest) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = listBlogsQuerySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { items, totalCount, totalPages } = await listPublishedBlogs(parsed.data)
    return NextResponse.json(
      { data: items, totalCount, totalPages, page: parsed.data.page },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to fetch blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}

