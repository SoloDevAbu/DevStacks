import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getProductComments } from "@/db/queries/comments/list"
import { createProductComment } from "@/db/queries/comments/create"
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
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await params
    const body = await req.json()
    const parsed = createCommentSchema.safeParse(body)

    if (!parsed.success) {
      const errorMsg =
        parsed.error.issues[0]?.message ?? "Validation failed"
      return NextResponse.json(
        { error: errorMsg, details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const product = await getProductBySlug(slug)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const comment = await createProductComment(
      product.id,
      session.user.id,
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
