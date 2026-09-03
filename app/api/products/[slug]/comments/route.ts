import { type NextRequest, NextResponse } from "next/server"
import { getProductComments } from "@/db/queries/comments/list"
import { createComment } from "@/db/queries/comments/create"
import { getProductBySlug } from "@/db/queries/products/get"
import { createCommentSchema } from "@/lib/validation/comment"

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const commentList = await getProductComments(product.id)
    return NextResponse.json({ data: commentList }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params
    const body = await req.json()
    const parsed = createCommentSchema.safeParse(body)

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

    const comment = await createComment(
      product.id,
      parsed.data.userId,
      parsed.data.body
    )

    return NextResponse.json({ data: comment }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}
