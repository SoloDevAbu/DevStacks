import { cache } from "react"
import { draftMode, headers } from "next/headers"
import { getBlogBySlug } from "@/db/queries/blogs"
import { getAdminSession } from "@/lib/auth/admin"
import { auth } from "@/lib/auth"
import { isPubliclyVisible } from "@/lib/catalog/visibility"

// Published posts render statically. Only a draft-mode request (enabled by /api/blog-preview for
// admins and the post's owner) reads the session so scheduled posts can be previewed.
export const loadBlogPost = cache(async (slug: string) => {
  const { isEnabled: isPreview } = await draftMode()

  if (!isPreview) {
    const data = await getBlogBySlug(slug)
    const item = data?.tool ?? data?.product
    return data && item && isPubliclyVisible(item) ? data : null
  }

  const reqHeaders = await headers()
  const [adminAuth, session] = await Promise.all([
    getAdminSession(reqHeaders),
    auth.api.getSession({ headers: reqHeaders }).catch(() => null),
  ])

  return getBlogBySlug(slug, {
    allowScheduledPreview: true,
    isAdmin: adminAuth.isAdmin,
    viewerId: session?.user?.id ?? null,
  })
})
