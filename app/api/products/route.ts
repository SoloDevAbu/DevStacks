import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/db/queries/products/list"
import { createProduct } from "@/db/queries/products/create"
import { submitProductSchema } from "@/lib/validation/product"
import { TRENDING_PRODUCTS } from "@/constants/products"
import { z } from "zod"

const listQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  pricing: z.enum(["Free", "Freemium", "Paid", "Open Source"]).optional(),
  tier: z.enum(["free", "premium", "premium+"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.enum(["upvotes", "builds", "recent", "views"]).default("upvotes"),
})

export const GET = async (req: NextRequest) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = listQuerySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    try {
      const products = await getProducts(parsed.data)
      if (products && products.length > 0) {
        return NextResponse.json({ data: products }, { status: 200 })
      }
    } catch {
      // Fall back to constants
    }

    const fallback = TRENDING_PRODUCTS.slice(0, parsed.data.limit).map((p, i) => ({
      id: p.id,
      slug: p.name.toLowerCase().replace(/\s+/g, "-"),
      name: p.name,
      tagline: p.tagline,
      tags: p.tags,
      upvotesCount: p.upvotes,
      buildsCount: p.builds,
      commentsCount: p.comments,
      viewsCount: Math.round(p.upvotes * 11.6),
      pricing: "Free" as const,
      tier: (i % 3 === 0 ? "free" : i % 3 === 1 ? "premium" : "premium+") as "free" | "premium" | "premium+",
      logoUrl: null,
      category: p.tags[0] ?? null,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    return NextResponse.json({ data: fallback }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const parsed = submitProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { tags, ...rest } = parsed.data
    const product = await createProduct({
      ...rest,
      tags: Array.isArray(tags) ? tags : [],
      platforms: rest.platforms ?? [],
    })

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message.includes("unique")) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
