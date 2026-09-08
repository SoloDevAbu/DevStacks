import { NextRequest, NextResponse } from "next/server"
import { getTools } from "@/db/queries/tools/list"
import { getTrending } from "@/lib/rankings/trending"

export const revalidate = 60

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))

  try {
    const [topTools, trendingProducts] = await Promise.all([
      getTools({ sortBy: "builds", limit }),
      getTrending(limit),
    ])

    return NextResponse.json(
      {
        count: {
          tools: topTools.length,
          products: trendingProducts.length,
        },
        tools: topTools,
        products: trendingProducts,
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
        title: "Leaderboard Error",
        status: 500,
        detail: error instanceof Error ? error.message : "Failed to fetch leaderboard",
      },
      { status: 500 }
    )
  }
}
