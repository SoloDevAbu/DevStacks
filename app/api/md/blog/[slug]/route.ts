import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getBlogBySlug } from "@/db/queries/blogs"
import { getAdminSession } from "@/lib/auth/admin"
import { auth } from "@/lib/auth"
import {
  generateBlogMarkdown,
  createMarkdownResponse,
} from "@/lib/seo/markdown-twins"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const revalidate = 3600

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const reqHeaders = await headers()

  // Authenticate viewer for scheduled preview check
  const [adminAuth, session] = await Promise.all([
    getAdminSession(reqHeaders),
    auth.api.getSession({ headers: reqHeaders }).catch(() => null),
  ])

  const isAdmin = adminAuth.isAdmin
  const viewerId = session?.user?.id || null

  const data = await getBlogBySlug(slug, {
    allowScheduledPreview: true,
    isAdmin,
    viewerId,
  })

  if (!data) {
    return new NextResponse(
      `# 404 Not Found\n\nLaunch story "${slug}" does not exist on ${SITE_CONFIG.name}.`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    )
  }

  const { blog, tool, product, submitter } = data
  const item = tool || product

  const itemCanonicalUrl = product
    ? `${SITE_CONFIG.url}${ROUTES.PRODUCT(product.slug)}`
    : tool
      ? `${SITE_CONFIG.url}${ROUTES.TOOL(tool.slug)}`
      : undefined

  const markdown = generateBlogMarkdown({
    title: blog.title,
    slug: blog.slug,
    metaDescription: blog.metaDescription,
    excerpt: blog.excerpt,
    verdictRating: blog.verdictRating,
    verdictSummary: blog.verdictSummary,
    pros: blog.pros,
    cons: blog.cons,
    content: blog.content,
    readingTimeMinutes: blog.readingTimeMinutes,
    publishedAt: blog.publishedAt,
    updatedAt: blog.updatedAt,
    faqs: blog.faqs,
    authorName: submitter?.name || SITE_CONFIG.creator,
    item: item
      ? {
          name: item.name,
          tagline: item.tagline,
          websiteUrl: item.websiteUrl,
          canonicalUrl: itemCanonicalUrl,
          pricing: item.pricing,
          tier: item.tier,
        }
      : null,
  })

  return createMarkdownResponse(
    markdown,
    `${SITE_CONFIG.url}/blog/${blog.slug}`
  )
}

