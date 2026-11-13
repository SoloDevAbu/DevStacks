import { type NextRequest, NextResponse, after } from "next/server"
import { getAdminSession } from "@/lib/auth/admin"
import { updateSubmissionStatusAndTriggerBlog } from "@/db/queries/admin/submissions"
import { z } from "zod"
import { revalidateCatalog } from "@/lib/cache/revalidate"
import { getUsernameById } from "@/db/queries/users/get-profile"
import { isBlogLive, isPubliclyVisible } from "@/lib/catalog/visibility"
import { submitToIndexNow } from "@/lib/seo/indexnow"
import { getListingPath } from "@/utils/urls"
import { ROUTES } from "@/constants/routes"

const statusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
})

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) => {
  try {
    const { isAdmin } = await getAdminSession(req.headers)

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator permission required." },
        { status: 403 }
      )
    }

    const { type, id } = await params
    if (type !== "tool" && type !== "product") {
      return NextResponse.json(
        { error: "Invalid item type. Must be 'tool' or 'product'." },
        { status: 400 }
      )
    }

    const body = await req.json()
    const parsed = statusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Must be 'pending', 'approved', or 'rejected'.",
        },
        { status: 400 }
      )
    }

    const result = await updateSubmissionStatusAndTriggerBlog({
      itemType: type,
      id,
      status: parsed.data.status,
    })
    // The maker's profile lists this submission, and is otherwise cached for a week.
    const makerUsername = result.item.submitterId
      ? await getUsernameById(result.item.submitterId).catch(() => null)
      : null
    revalidateCatalog({
      [type === "tool" ? "toolSlug" : "productSlug"]: result.item.slug,
      blogSlug: result.blogResult?.blog?.slug,
      makerUsername: makerUsername ?? undefined,
    })

    if (isPubliclyVisible(result.item)) {
      const blog = result.blogResult?.blog
      const paths = [
        getListingPath({ itemKind: type, slug: result.item.slug }),
        ...(blog && isBlogLive(blog) ? [ROUTES.BLOG_POST(blog.slug)] : []),
      ]
      after(() => submitToIndexNow(paths))
    }

    return NextResponse.json(
      {
        success: true,
        data: result.item,
        blog: result.blogResult?.blog,
        blogError: result.blogResult?.error,
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update submission status."
    console.error("[Admin Submissions PATCH Error]:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
