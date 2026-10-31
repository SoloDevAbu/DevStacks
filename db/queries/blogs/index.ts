import { TIER } from "@/constants/plans"
import { cache } from "react"
import { db } from "@/db"
import { blogs, tools, products, users } from "@/db/schema"
import type { Blog, NewBlog } from "@/db/schema"
import type { BlogListItem } from "@/types/blog"
import { and, desc, eq, lte, ne, or, sql, inArray } from "drizzle-orm"

export interface ListPublishedBlogsOptions {
  page?: number
  limit?: number
}

export const createBlog = async (data: NewBlog): Promise<Blog> => {
  const [created] = await db.insert(blogs).values(data).returning()
  return created
}

export const getBlogById = async (id: string): Promise<Blog | null> => {
  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)
  return blog ?? null
}

export const getBlogByItem = async (
  itemType: "tool" | "product",
  itemId: string
): Promise<Blog | null> => {
  const condition =
    itemType === "tool"
      ? eq(blogs.toolId, itemId)
      : eq(blogs.productId, itemId)

  const [blog] = await db.select().from(blogs).where(condition).limit(1)
  return blog ?? null
}

export const getBlogBySlug = cache(
  async (
    slug: string,
    options?: {
      allowScheduledPreview?: boolean
      viewerId?: string | null
      isAdmin?: boolean
    }
  ): Promise<{
    blog: Blog
    tool?: typeof tools.$inferSelect | null
    product?: typeof products.$inferSelect | null
    submitter?: typeof users.$inferSelect | null
  } | null> => {
    const now = new Date()

    const [result] = await db
      .select({
        blog: blogs,
        tool: tools,
        product: products,
        submitter: users,
      })
      .from(blogs)
      .leftJoin(tools, eq(blogs.toolId, tools.id))
      .leftJoin(products, eq(blogs.productId, products.id))
      .leftJoin(users, eq(blogs.submitterId, users.id))
      .where(eq(blogs.slug, slug))
      .limit(1)

    if (!result || !result.blog) {
      return null
    }

    const { blog, tool, product, submitter } = result

    // Gating check:
    // Blog is live if status is "published" OR (status is "scheduled" and publishedAt <= now)
    const isLive =
      blog.status === "published" ||
      (blog.status === "scheduled" &&
        blog.publishedAt !== null &&
        blog.publishedAt <= now)

    if (isLive) {
      return { blog, tool, product, submitter }
    }

    // If not live yet, allow access only if explicitly permitted (admin or the submitter)
    if (options?.allowScheduledPreview) {
      if (options.isAdmin) {
        return { blog, tool, product, submitter }
      }
      if (options.viewerId && blog.submitterId === options.viewerId) {
        return { blog, tool, product, submitter }
      }
    }

    return null
  }
)

export const listPublishedBlogs = async ({
  page = 1,
  limit = 20,
}: ListPublishedBlogsOptions = {}): Promise<{
  items: BlogListItem[]
  totalCount: number
  totalPages: number
}> => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(5000, Math.max(1, limit))
  const offset = (safePage - 1) * safeLimit
  const now = new Date()

  const liveCondition = or(
    eq(blogs.status, "published"),
    and(eq(blogs.status, "scheduled"), lte(blogs.publishedAt, now))
  )

  const tierOrderSql = sql`
    CASE 
      WHEN COALESCE(${products.tier}, ${tools.tier}) = ${TIER.PREMIUM_PLUS} THEN 1
      WHEN COALESCE(${products.tier}, ${tools.tier}) = ${TIER.PREMIUM} THEN 2
      ELSE 3
    END ASC
  `

  const [countResult, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(${blogs.id})::int` })
      .from(blogs)
      .where(liveCondition),
    db
      .select({
        blog: blogs,
        tool: tools,
        product: products,
        submitter: users,
      })
      .from(blogs)
      .leftJoin(tools, eq(blogs.toolId, tools.id))
      .leftJoin(products, eq(blogs.productId, products.id))
      .leftJoin(users, eq(blogs.submitterId, users.id))
      .where(liveCondition)
      .orderBy(tierOrderSql, desc(blogs.publishedAt), desc(blogs.createdAt))
      .limit(safeLimit)
      .offset(offset),
  ])

  const totalCount = countResult[0]?.count ?? 0
  const totalPages = Math.ceil(totalCount / safeLimit)

  return {
    items,
    totalCount,
    totalPages,
  }
}

export const updateBlog = async (
  id: string,
  updates: Partial<NewBlog>
): Promise<Blog | null> => {
  const [updated] = await db
    .update(blogs)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(blogs.id, id))
    .returning()

  return updated ?? null
}

export const deleteBlog = async (id: string): Promise<boolean> => {
  const [deleted] = await db
    .delete(blogs)
    .where(eq(blogs.id, id))
    .returning({ id: blogs.id })

  return Boolean(deleted)
}

export const resolveUniqueBlogSlug = async (
  desiredSlug: string,
  currentBlogId?: string
): Promise<string> => {
  let slug = desiredSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: blogs.id })
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1)

    if (!existing || (currentBlogId && existing.id === currentBlogId)) {
      return slug
    }

    counter++
    slug = `${desiredSlug}-${counter}`
  }
}

export const getSimilarBlogs = async ({
  currentBlogId,
  categoryId,
  limit = 3,
}: {
  currentBlogId: string
  categoryId?: string | null
  limit?: number
}): Promise<BlogListItem[]> => {
  const now = new Date()
  const safeLimit = Math.max(1, Math.min(10, limit))

  const liveCondition = and(
    ne(blogs.id, currentBlogId),
    or(
      eq(blogs.status, "published"),
      and(eq(blogs.status, "scheduled"), lte(blogs.publishedAt, now))
    )
  )

  const categoryMatchSql = categoryId
    ? sql`
        CASE 
          WHEN ${products.categoryId} = ${categoryId}::uuid OR ${tools.categoryId} = ${categoryId}::uuid THEN 1
          ELSE 2
        END ASC
      `
    : sql`1 ASC`

  const tierOrderSql = sql`
    CASE 
      WHEN COALESCE(${products.tier}, ${tools.tier}) = ${TIER.PREMIUM_PLUS} THEN 1
      WHEN COALESCE(${products.tier}, ${tools.tier}) = ${TIER.PREMIUM} THEN 2
      ELSE 3
    END ASC
  `

  const items = await db
    .select({
      blog: blogs,
      tool: tools,
      product: products,
      submitter: users,
    })
    .from(blogs)
    .leftJoin(tools, eq(blogs.toolId, tools.id))
    .leftJoin(products, eq(blogs.productId, products.id))
    .leftJoin(users, eq(blogs.submitterId, users.id))
    .where(liveCondition)
    .orderBy(
      categoryMatchSql,
      tierOrderSql,
      desc(blogs.publishedAt),
      desc(blogs.createdAt)
    )
    .limit(safeLimit)

  return items
}


