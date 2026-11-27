import { type NextRequest, NextResponse, after } from "next/server"
import { resolveProduct } from "@/lib/products/resolve-product"
import { auth } from "@/lib/auth"
import { submitProductEdit } from "@/lib/listings/submit-edit"
import { softDeleteProduct } from "@/db/queries/products/delete"
import { updateProductSchema } from "@/lib/validation/product"
import { revalidateCatalog } from "@/lib/cache/revalidate"
import { pingListingChange } from "@/lib/seo/listing-indexnow"

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
      return NextResponse.json(
        { error: "Missing product slug" },
        { status: 400 }
      )
    }

    const parsed = updateProductSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const result = await submitProductEdit(slug, session.user.id, parsed.data)
    if (result.queued) {
      return NextResponse.json(
        { data: result.item, revisionPending: true },
        { status: 202 }
      )
    }

    revalidateCatalog({ productSlug: slug })
    after(() => pingListingChange("product", result.item))
    return NextResponse.json({ data: result.item }, { status: 200 })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update product"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to delete this product." },
        { status: 401 }
      )
    }

    const { slug } = await params
    if (!slug) {
      return NextResponse.json(
        { error: "Missing product slug" },
        { status: 400 }
      )
    }

    const deleted = await softDeleteProduct(slug, session.user.id)
    revalidateCatalog({ productSlug: slug })
    after(() => pingListingChange("product", deleted))
    return NextResponse.json({ data: deleted }, { status: 200 })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete product"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
