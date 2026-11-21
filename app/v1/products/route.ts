import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/db/queries/products/list"
import { SITE_CONFIG } from "@/constants/site"
import { V1_LIMIT, V1_PAGE } from "@/constants/api"
import { parseBoundedInt, pickOption } from "@/utils/api-params"

export const revalidate = 3600

const PRODUCT_SORTS = ["likes", "recent", "views"] as const

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const page = parseBoundedInt(searchParams.get("page"), V1_PAGE)
  const limit = parseBoundedInt(searchParams.get("limit"), V1_LIMIT)
  const q = searchParams.get("q") ?? undefined
  const category = searchParams.get("category") ?? undefined
  const pricing = searchParams.get("pricing") ?? undefined
  const sort = pickOption(searchParams.get("sort"), PRODUCT_SORTS, "likes")

  try {
    const data = await getProducts({
      q,
      category,
      pricing,
      page,
      limit,
      sortBy: sort,
    })

    return NextResponse.json(
      {
        page,
        limit,
        count: data.length,
        hasMore: data.length === limit,
        data,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        type: `${SITE_CONFIG.url}/errors/server-error`,
        title: "Database Error",
        status: 500,
        detail:
          error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 }
    )
  }
}
