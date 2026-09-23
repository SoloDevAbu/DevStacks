import { type NextRequest, NextResponse } from "next/server"
import { resolveProduct } from "@/lib/products/resolve-product"
import { auth } from "@/lib/auth"
import { updateProduct } from "@/db/queries/products/update"
import { submitProductSchema } from "@/lib/validation/product"

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
    }

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

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to edit this product." },
        { status: 401 }
      )
    }

    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ error: "Missing product slug" }, { status: 400 })
    }

    const body = await req.json()
    const updateSchema = submitProductSchema
      .omit({ submitterId: true })
      .partial()

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const updated = await updateProduct(slug, session.user.id, parsed.data)
    return NextResponse.json({ data: updated }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
