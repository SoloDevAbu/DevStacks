import { type NextRequest, NextResponse } from "next/server"
import { toggleProductLike } from "@/db/queries/products/toggle-like"
import { getProductBySlug } from "@/db/queries/products/get"
import { z } from "zod"

const likeSchema = z.object({
  userId: z.string().min(1, "User ID required"),
})

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params
    const body = await req.json()
    const parsed = likeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const product = await getProductBySlug(slug)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const result = await toggleProductLike(product.id, parsed.data.userId)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}
