import { type NextRequest, NextResponse } from "next/server"
import { draftMode } from "next/headers"
import { getBlogBySlug } from "@/db/queries/blogs"
import { getAdminSession } from "@/lib/auth/admin"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/constants/routes"

export const dynamic = "force-dynamic"

// Turns on draft mode for admins and the post's owner, then opens the (otherwise static) post so
// a scheduled launch story can be previewed before it is published.
export const GET = async (req: NextRequest) => {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 })
  }

  const [adminAuth, session] = await Promise.all([
    getAdminSession(req.headers),
    auth.api.getSession({ headers: req.headers }).catch(() => null),
  ])

  const post = await getBlogBySlug(slug, {
    allowScheduledPreview: true,
    isAdmin: adminAuth.isAdmin,
    viewerId: session?.user?.id ?? null,
  })
  const canPreview =
    adminAuth.isAdmin ||
    (Boolean(session?.user?.id) && post?.blog.submitterId === session?.user?.id)
  if (!post || !canPreview) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL(ROUTES.BLOG_POST(slug), req.url))
}
