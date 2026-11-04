import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { revalidateVote } from "@/lib/cache/revalidate"
import { setProductLike } from "@/db/queries/products/set-like"
import { getProductIdBySlug } from "@/db/queries/products/get"

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (typeof body?.liked !== "boolean") {
      return NextResponse.json(
        { error: "liked must be a boolean" },
        { status: 400 }
      )
    }

    const { slug } = await params
    const productId = await getProductIdBySlug(slug)
    if (!productId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const result = await setProductLike(productId, session.user.id, body.liked)
    revalidateVote({ productSlug: slug })
    return NextResponse.json({ data: result }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to save like" }, { status: 500 })
  }
}
