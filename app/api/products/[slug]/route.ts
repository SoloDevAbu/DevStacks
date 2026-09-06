import { type NextRequest, NextResponse } from "next/server"
import { resolveProduct } from "@/lib/products/resolve-product"
import { GET as getNewAndRising } from "../new-and-rising/route"
import { GET as getRecentlyAdded } from "../recently-added/route"
import { GET as getRisingProducts } from "../rising-products/route"
import { GET as getRisingTools } from "../rising-tools/route"
import { GET as getPopularBuildingBlocks } from "../popular-building-blocks/route"
import { GET as getTrending } from "../trending/route"

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
    }

    if (slug === "new-and-rising") return getNewAndRising(req)
    if (slug === "recently-added") return getRecentlyAdded(req)
    if (slug === "rising-products") return getRisingProducts(req)
    if (slug === "rising-tools") return getRisingTools(req)
    if (slug === "popular-building-blocks") return getPopularBuildingBlocks(req)
    if (slug === "trending") return getTrending(req)

    const product = await resolveProduct(slug)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ data: product }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
