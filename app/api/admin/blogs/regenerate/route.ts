import { NextResponse, after } from "next/server"
import { z } from "zod"
import { withAdmin } from "@/lib/auth/with-admin"
import { generateAndSaveLaunchBlog } from "@/lib/ai/launch-blog-service"
import { recordAdminAction } from "@/db/queries/admin/audit"
import { revalidateCatalog } from "@/lib/cache/revalidate"
import { isBlogLive } from "@/lib/catalog/visibility"
import { submitToIndexNow } from "@/lib/seo/indexnow"
import { listingItemTypeSchema } from "@/lib/validation/admin"
import { ROUTES } from "@/constants/routes"
import { ADMIN_AUDIT_ACTION } from "@/constants/admin"

const regenerateSchema = z.object({
  itemType: listingItemTypeSchema,
  itemId: z.string().uuid("Invalid item ID"),
})

export const POST = withAdmin(async (req, { admin }) => {
  const parsed = regenerateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload.", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { itemType, itemId } = parsed.data
  const result = await generateAndSaveLaunchBlog({
    itemType,
    itemId,
    forceRegenerate: true,
  })

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Blog generation failed." },
      { status: 502 }
    )
  }

  await recordAdminAction({
    adminId: admin.id,
    action: ADMIN_AUDIT_ACTION.BLOG_REGENERATED,
    targetType: itemType,
    targetId: itemId,
    metadata: { blogSlug: result.blog?.slug ?? null },
  })
  revalidateCatalog({ blogSlug: result.blog?.slug })

  const blog = result.blog
  if (blog && isBlogLive(blog)) {
    after(() => submitToIndexNow([ROUTES.BLOG_POST(blog.slug)]))
  }

  return NextResponse.json({ success: true, blog: result.blog })
})
