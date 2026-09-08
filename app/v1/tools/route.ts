import { NextRequest, NextResponse } from "next/server"
import { getTools } from "@/db/queries/tools/list"

export const revalidate = 60

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(60, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))
  const q = searchParams.get("q") ?? undefined
  const category = searchParams.get("category") ?? undefined
  const pricing = searchParams.get("pricing") ?? undefined
  const sortParam = searchParams.get("sort")
  const sortBy =
    sortParam === "upvotes" || sortParam === "recent" || sortParam === "views"
      ? sortParam
      : "builds"

  try {
    const data = await getTools({
      q,
      category,
      pricing,
      sortBy,
      limit,
      page,
    })


    return NextResponse.json(
      {
        page,
        limit,
        count: data.length,
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
        type: "https://devstacks.io/errors/server-error",
        title: "Database Error",
        status: 500,
        detail: error instanceof Error ? error.message : "Failed to fetch tools",
      },
      { status: 500 }
    )
  }
}
