import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/db/queries/products/list"
import { createProduct } from "@/db/queries/products/create"
import { submitProductSchema } from "@/lib/validation/product"
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

    const products = await getProducts(parsed.data)
    return NextResponse.json({ data: products }, { status: 200 })
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
