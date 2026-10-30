import { TIER, type Tier } from "@/constants/plans"
import { db } from "@/db"
import { tools, products, categories, users, launches, blogs } from "@/db/schema"
import { eq, or, ilike, and, desc, sql } from "drizzle-orm"
import { generateAndSaveLaunchBlog } from "@/lib/ai/launch-blog-service"

export type AdminSubmissionItem = {
  id: string
  slug: string
  itemType: "tool" | "product"
  name: string
  tagline: string
  description: string
  websiteUrl: string
  logoUrl?: string | null
  images: string[]
  tier: Tier
  pricing: "Free" | "Freemium" | "Paid" | "Open Source"
  status: "pending" | "approved" | "rejected"
  launchYear?: number | null
  launchWeek?: number | null
  launchDate?: Date | null
  createdAt: Date
  submitterEmail?: string | null
  submitterName?: string | null
  blog?: {
    id: string
    slug: string
    title: string
    status: "draft" | "scheduled" | "published" | "archived"
    generationStatus: "pending" | "generating" | "completed" | "failed"
    generationError?: string | null
    publishedAt?: Date | null
  } | null
}

export const getAdminSubmissions = async ({
  status = "all",
  search,
}: {
  status?: "pending" | "approved" | "rejected" | "all"
  search?: string
} = {}): Promise<AdminSubmissionItem[]> => {
  const toolConditions: any[] = [eq(tools.isDeleted, false)]
  const productConditions: any[] = [eq(products.isDeleted, false)]

  if (status !== "all") {
    toolConditions.push(eq(tools.status, status))
    productConditions.push(eq(products.status, status))
  }

  if (search && search.trim()) {
    const pattern = `%${search.trim()}%`
    toolConditions.push(
      or(
        ilike(tools.name, pattern),
        ilike(tools.tagline, pattern),
        ilike(tools.slug, pattern)
      )
    )
    productConditions.push(
      or(
        ilike(products.name, pattern),
        ilike(products.tagline, pattern),
        ilike(products.slug, pattern)
      )
    )
  }

  const [toolRows, productRows] = await Promise.all([
    db
      .select({
        tool: tools,
        user: users,
        blog: blogs,
      })
      .from(tools)
      .leftJoin(users, eq(tools.submitterId, users.id))
      .leftJoin(blogs, eq(tools.id, blogs.toolId))
      .where(and(...toolConditions))
      .orderBy(desc(tools.createdAt)),
    db
      .select({
        product: products,
        user: users,
        blog: blogs,
      })
      .from(products)
      .leftJoin(users, eq(products.submitterId, users.id))
      .leftJoin(blogs, eq(products.id, blogs.productId))
      .where(and(...productConditions))
      .orderBy(desc(products.createdAt)),
  ])

  const mappedTools: AdminSubmissionItem[] = toolRows.map(({ tool, user, blog }) => ({
    id: tool.id,
    slug: tool.slug,
    itemType: "tool",
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    websiteUrl: tool.websiteUrl,
    logoUrl: tool.logoUrl,
    images: tool.images,
    tier: tool.tier,
    pricing: tool.pricing,
    status: tool.status,
    launchYear: tool.launchYear,
    launchWeek: tool.launchWeek,
    launchDate: tool.launchDate,
    createdAt: tool.createdAt,
    submitterEmail: user?.email,
    submitterName: user?.name,
    blog: blog
      ? {
          id: blog.id,
          slug: blog.slug,
          title: blog.title,
          status: blog.status,
          generationStatus: blog.generationStatus,
          generationError: blog.generationError,
          publishedAt: blog.publishedAt,
        }
      : null,
  }))

  const mappedProducts: AdminSubmissionItem[] = productRows.map(
    ({ product, user, blog }) => ({
      id: product.id,
      slug: product.slug,
      itemType: "product",
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      websiteUrl: product.websiteUrl,
      logoUrl: product.logoUrl,
      images: product.images,
      tier: product.tier,
      pricing: product.pricing,
      status: product.status,
      launchYear: product.launchYear,
      launchWeek: product.launchWeek,
      launchDate: product.launchDate,
      createdAt: product.createdAt,
      submitterEmail: user?.email,
      submitterName: user?.name,
      blog: blog
        ? {
            id: blog.id,
            slug: blog.slug,
            title: blog.title,
            status: blog.status,
            generationStatus: blog.generationStatus,
            generationError: blog.generationError,
            publishedAt: blog.publishedAt,
          }
        : null,
    })
  )

  const combined = [...mappedTools, ...mappedProducts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )

  return combined
}

export const updateSubmissionStatusAndTriggerBlog = async ({
  itemType,
  id,
  status,
}: {
  itemType: "tool" | "product"
  id: string
  status: "pending" | "approved" | "rejected"
}) => {
  const table = itemType === "tool" ? tools : products
  const now = new Date()

  // 1. Update listing status
  const [updated] = await db
    .update(table)
    .set({
      status,
      updatedAt: now,
    })
    .where(eq(table.id, id))
    .returning()

  if (!updated) {
    throw new Error(`${itemType} with id "${id}" not found.`)
  }

  // 2. Synchronize launches table status
  if (itemType === "tool") {
    await db
      .update(launches)
      .set({ status, updatedAt: now })
      .where(eq(launches.toolId, id))
  } else {
    await db
      .update(launches)
      .set({ status, updatedAt: now })
      .where(eq(launches.productId, id))
  }

  // 3. If approved and tier is premium or premium+, trigger AI blog generator
  let blogResult = null
  if (
    status === "approved" &&
    (updated.tier === TIER.PREMIUM || updated.tier === TIER.PREMIUM_PLUS)
  ) {
    blogResult = await generateAndSaveLaunchBlog({
      itemType,
      itemId: id,
      forceRegenerate: false,
    })
  }

  return {
    item: updated,
    blogResult,
  }
}

