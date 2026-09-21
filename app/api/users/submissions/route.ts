import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

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
        })
        .from(tools)
        .where(and(eq(tools.submitterId, userId), eq(tools.status, "approved"))),
      db
        .select({
          id: products.id,
          name: products.name,
          tagline: products.tagline,
          logoUrl: products.logoUrl,
          websiteUrl: products.websiteUrl,
          slug: products.slug,
          tier: products.tier,
        })
        .from(products)
        .where(
          and(eq(products.submitterId, userId), eq(products.status, "approved"))
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
