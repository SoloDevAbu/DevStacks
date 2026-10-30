import type { Metadata } from "next"
import { listPublishedBlogs } from "@/db/queries/blogs"
import { BlogDirectoryContent } from "./blog-content"
import { SITE_CONFIG } from "@/constants/site"
import {
  blogDirectoryContainer,
  blogDirectoryHero,
  blogDirectoryTitle,
  blogDirectorySubtitle,
} from "@/utils/blog/styles"
import {
  safeJsonLd,
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
} from "@/lib/seo/schema"

export const revalidate = 60

export const generateMetadata = async (props: {
  searchParams: Promise<{
    page?: string
  }>
}): Promise<Metadata> => {
  const searchParams = await props.searchParams
  const pageStr = searchParams?.page
  const parsedPage = pageStr ? parseInt(pageStr, 10) : 1
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1

  const title =
    currentPage > 1
      ? `Launch Stories & Tech Architecture Spotlights (Page ${currentPage}) | ${SITE_CONFIG.name}`
      : `Launch Stories & Tech Architecture Spotlights | ${SITE_CONFIG.name}`

  const canonicalUrl =
    currentPage > 1
      ? `${SITE_CONFIG.url}/blog?page=${currentPage}`
      : `${SITE_CONFIG.url}/blog`

  return {
    title,
    description:
      "In-depth technical launch reviews, software architecture breakdowns, and vetted developer tools spotlights published on LaunchNests.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description:
        "Explore deep-dive technical reviews of developer tools and modern software launches.",
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [{ url: SITE_CONFIG.ogImageUrl }],
      type: "website",
    },
  }
}

const BlogIndexPage = async (props: {
  searchParams: Promise<{
    page?: string
  }>
}) => {
  const searchParams = await props.searchParams
  const pageStr = searchParams?.page
  const parsedPage = pageStr ? parseInt(pageStr, 10) : 1
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1

  const { items, totalCount, totalPages } = await listPublishedBlogs({
    page: currentPage,
    limit: 20,
  })

  const canonicalUrl =
    currentPage > 1
      ? `${SITE_CONFIG.url}/blog?page=${currentPage}`
      : `${SITE_CONFIG.url}/blog`

  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Launch Stories", url: `${SITE_CONFIG.url}/blog` },
    ]),
    collectionPageSchema({
      name:
        currentPage > 1
          ? `Launch Stories & Tech Architecture Spotlights (Page ${currentPage}) | ${SITE_CONFIG.name}`
          : `Launch Stories & Tech Architecture Spotlights | ${SITE_CONFIG.name}`,
      description:
        "In-depth technical launch reviews, software architecture breakdowns, and vetted developer tools spotlights published on LaunchNests.",
      url: canonicalUrl,
      items: items.map((item) => ({
        name: item.blog.title,
        url: `${SITE_CONFIG.url}/blog/${item.blog.slug}`,
        description: item.blog.metaDescription || item.blog.excerpt || "",
      })),
    }),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className={blogDirectoryContainer}>
        {/* Full-Width Header */}
        <div className={blogDirectoryHero}>
          <h1 className={blogDirectoryTitle}>Blogs</h1>

          <p className={blogDirectorySubtitle}>
            In-depth architectural breakdowns, technical spotlights, and launch stories of developer tools and modern products.
          </p>
        </div>

        {/* Telemetry Bar, Blog Rows & Infinite Scroll / Load More */}
        <BlogDirectoryContent
          initialPage={currentPage}
          totalPages={totalPages}
          initialBlogs={items}
          totalCount={totalCount}
        />
      </div>
    </>
  )
}

export default BlogIndexPage
