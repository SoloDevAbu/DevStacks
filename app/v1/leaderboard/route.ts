import { NextRequest, NextResponse } from "next/server"
import { getTools } from "@/db/queries/tools/list"
import { getTrending } from "@/lib/rankings/trending"
import { SITE_CONFIG } from "@/constants/site"
import { V1_LEADERBOARD_LIMIT } from "@/constants/api"
import { parseBoundedInt } from "@/utils/api-params"

export const revalidate = 3600

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const limit = parseBoundedInt(
    searchParams.get("limit"),
    V1_LEADERBOARD_LIMIT
  )

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
        type: `${SITE_CONFIG.url}/errors/server-error`,
        title: "Leaderboard Error",
        status: 500,
        detail:
          error instanceof Error
            ? error.message
            : "Failed to fetch leaderboard",
      },
      { status: 500 }
    )
  }
}
