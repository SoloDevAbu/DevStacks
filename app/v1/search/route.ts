import { NextRequest, NextResponse } from "next/server"
import { getTools } from "@/db/queries/tools/list"
import { getProducts } from "@/db/queries/products/list"

export const revalidate = 60

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim()
  const limit = Math.min(30, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)))

  if (!q || q.length < 2) {
    return NextResponse.json(
      {
        type: "https://devstacks.io/errors/invalid-query",
        title: "Missing Search Query",
        status: 400,
        detail: "Parameter 'q' is required and must be at least 2 characters.",
      },
      {
        status: 400,
        headers: {
          "Content-Type": "application/problem+json",
        },
      }
    )
  }

  try {
    const [tools, products] = await Promise.all([
      getTools({ q, limit }),
      getProducts({ q, limit }),
    ])

    return NextResponse.json(
      {
        query: q,
        total: tools.length + products.length,
        tools,
        products,
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
        title: "Search Error",
        status: 500,
        detail: error instanceof Error ? error.message : "Failed to execute search",
      },
      { status: 500 }
    )
  }
}
