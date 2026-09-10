import { type NextRequest, NextResponse } from "next/server"
import {
  getToolCategories,
  getProductCategories,
  getAllCategories,
} from "@/db/queries/categories/list"
import { z } from "zod"

const querySchema = z.object({
  q: z.string().optional(),
  type: z.enum(["tools", "products", "all"]).default("all"),
})

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams)
  const parsed = querySchema.safeParse(params)
  const { q, type } = parsed.success
    ? parsed.data
    : { q: undefined, type: "all" as const }

  try {
    let categoriesList
    if (type === "tools") {
      categoriesList = await getToolCategories(q)
    } else if (type === "products") {
      categoriesList = await getProductCategories(q)
    } else {
      categoriesList = await getAllCategories(q)
    }

    return NextResponse.json(
      { data: categoriesList },
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
