import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { eq, and, ne } from "drizzle-orm"

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const includePending =
      req.nextUrl.searchParams.get("includePending") === "true"

    const toolStatusFilter = includePending
      ? ne(tools.status, "rejected")
      : eq(tools.status, "approved")

    const productStatusFilter = includePending
      ? ne(products.status, "rejected")
      : eq(products.status, "approved")

    const [userTools, userProducts] = await Promise.all([
      db
        .select({
          id: tools.id,
          name: tools.name,
          tagline: tools.tagline,
          logoUrl: tools.logoUrl,
          websiteUrl: tools.websiteUrl,
          slug: tools.slug,
          tier: tools.tier,
          badgeVerified: tools.badgeVerified,
          status: tools.status,
        })
        .from(tools)
        .where(
          and(
            eq(tools.submitterId, userId),
            toolStatusFilter,
            eq(tools.isDeleted, false)
          )
        ),
      db
        .select({
          id: products.id,
          name: products.name,
          tagline: products.tagline,
          logoUrl: products.logoUrl,
          websiteUrl: products.websiteUrl,
          slug: products.slug,
          tier: products.tier,
          badgeVerified: products.badgeVerified,
          status: products.status,
        })
        .from(products)
        .where(
          and(
            eq(products.submitterId, userId),
            productStatusFilter,
            eq(products.isDeleted, false)
          )
        ),
    ])

    const submissions = [
      ...userTools.map((t) => ({ ...t, type: "tool" as const })),
      ...userProducts.map((p) => ({ ...p, type: "product" as const })),
    ]

    return NextResponse.json({ data: submissions })
  } catch (error) {
    console.error("Failed to fetch user submissions:", error)
    return NextResponse.json(
      { error: "Failed to fetch user submissions" },
      { status: 500 }
    )
  }
}
