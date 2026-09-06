import { type NextRequest, NextResponse } from "next/server"
import { getDbCategories } from "@/db/queries/categories/list"
import { z } from "zod"

const querySchema = z.object({
  q: z.string().optional(),
})

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams)
  const parsed = querySchema.safeParse(params)
  const q = parsed.success ? parsed.data.q : undefined

  try {
    const categories = await getDbCategories(q)
    return NextResponse.json(
      { data: categories },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
