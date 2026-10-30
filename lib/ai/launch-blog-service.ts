import { TIER } from "@/constants/plans"
import { db } from "@/db"
import {
  tools,
  products,
  categories,
  productTools,
  productFaqs,
  toolFaqs,
  blogs,
  type Blog,
} from "@/db/schema"
import { eq, and } from "drizzle-orm"
import {
  generateLaunchBlog,
  type LaunchItemData,
} from "@/lib/ai/blog-generator"
import { slugify } from "@/utils/slug"
import { resolveUniqueBlogSlug } from "@/db/queries/blogs"

export interface GenerateBlogOptions {
  itemType: "tool" | "product"
  itemId: string
  forceRegenerate?: boolean
}

export const generateAndSaveLaunchBlog = async ({
  itemType,
  itemId,
  forceRegenerate = false,
}: GenerateBlogOptions): Promise<{
  success: boolean
  blog?: Blog
  error?: string
}> => {
  try {
    // 1. Fetch item from database
    let itemData: LaunchItemData | null = null
    let launchDate: Date | null = null
    let submitterId: string | null = null
    let rawTier: string = "free"

    if (itemType === "tool") {
      const [tool] = await db
        .select()
        .from(tools)
        .where(eq(tools.id, itemId))
        .limit(1)

      if (!tool) {
        return { success: false, error: `Tool with id ${itemId} not found.` }
      }

      rawTier = tool.tier
      launchDate = tool.launchDate
      submitterId = tool.submitterId

      let categoryName: string | null = null
      if (tool.categoryId) {
        const [cat] = await db
          .select({ name: categories.name })
          .from(categories)
          .where(eq(categories.id, tool.categoryId))
          .limit(1)
        categoryName = cat?.name ?? null
      }

      const faqsList = await db
        .select({
          question: toolFaqs.question,
          answer: toolFaqs.answer,
        })
        .from(toolFaqs)
        .where(eq(toolFaqs.toolId, tool.id))

      itemData = {
        itemType: "tool",
        name: tool.name,
        tagline: tool.tagline,
        description: tool.description,
        websiteUrl: tool.websiteUrl,
        problemStatement: tool.problemStatement,
        solution: tool.solution,
        uniqueValue: tool.uniqueValue,
        targetAudience: tool.targetAudience,
        useCases: tool.useCases,
        keywords: tool.keywords,
        pricing: tool.pricing,
        tier: tool.tier,
        categoryName,
        tags: tool.tags,
        platforms: tool.platforms,
        builtWithTools: [],
        images: tool.images,
        demoVideoUrl: tool.demoVideoUrl,
        githubUrl: tool.githubUrl,
        faqs: faqsList,
      }
    } else {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, itemId))
        .limit(1)

      if (!product) {
        return { success: false, error: `Product with id ${itemId} not found.` }
      }

      rawTier = product.tier
      launchDate = product.launchDate
      submitterId = product.submitterId

      let categoryName: string | null = null
      if (product.categoryId) {
        const [cat] = await db
          .select({ name: categories.name })
          .from(categories)
          .where(eq(categories.id, product.categoryId))
          .limit(1)
        categoryName = cat?.name ?? null
      }

      const [faqsList, linkedTools] = await Promise.all([
        db
          .select({
            question: productFaqs.question,
            answer: productFaqs.answer,
          })
          .from(productFaqs)
          .where(eq(productFaqs.productId, product.id)),
        db
          .select({
            name: productTools.name,
          })
          .from(productTools)
          .where(eq(productTools.productId, product.id)),
      ])

      itemData = {
        itemType: "product",
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        websiteUrl: product.websiteUrl,
        problemStatement: product.problemStatement,
        solution: product.solution,
        uniqueValue: product.uniqueValue,
        targetAudience: product.targetAudience,
        useCases: product.useCases,
        keywords: product.keywords,
        pricing: product.pricing,
        tier: product.tier,
        categoryName,
        tags: product.tags,
        platforms: product.platforms,
        builtWithTools: linkedTools.map((t) => t.name),
        images: product.images,
        demoVideoUrl: product.demoVideoUrl,
        githubUrl: product.githubUrl,
        faqs: faqsList,
      }
    }

    // 2. Validate tier eligibility: only Premium and Premium+ are eligible
    if (rawTier !== TIER.PREMIUM && rawTier !== TIER.PREMIUM_PLUS) {
      return {
        success: false,
        error: `Item tier "${rawTier}" is not eligible for automated launch blog generation. Upgrade to Premium or Premium+.`,
      }
    }

    // 3. Check for existing blog record
    const blogCondition =
      itemType === "tool"
        ? eq(blogs.toolId, itemId)
        : eq(blogs.productId, itemId)

    const [existingBlog] = await db.select().from(blogs).where(blogCondition).limit(1)

    if (
      existingBlog &&
      existingBlog.generationStatus === "completed" &&
      !forceRegenerate
    ) {
      return { success: true, blog: existingBlog }
    }

    const effectiveLaunchDate = launchDate || new Date()
    const isFuture = effectiveLaunchDate > new Date()
    const blogStatus = isFuture ? "scheduled" : "published"

    // 4. Upsert initial "generating" placeholder record
    let currentBlogId = existingBlog?.id

    if (!existingBlog) {
      const initialSlug = await resolveUniqueBlogSlug(
        `${slugify(itemData.name, "blog")}-generating`
      )
      const [inserted] = await db
        .insert(blogs)
        .values({
          slug: initialSlug,
          title: `${itemData.name}: ${itemData.tagline.slice(0, 50)}`,
          metaTitle: `${itemData.name}: ${itemData.tagline.slice(0, 40)} | LaunchNests`,
          metaDescription: `Discover ${itemData.name}: ${itemData.tagline}. Full architecture, workflows, and developer breakdown.`,
          excerpt: itemData.tagline,
          content: "Generating technical architecture spotlight with AI...",
          coverImageUrl: itemData.images?.[0] || null,
          itemType,
          toolId: itemType === "tool" ? itemId : null,
          productId: itemType === "product" ? itemId : null,
          submitterId,
          status: blogStatus,
          generationStatus: "generating",
          generationError: null,
          publishedAt: effectiveLaunchDate,
        })
        .returning()
      currentBlogId = inserted.id
    } else {
      await db
        .update(blogs)
        .set({
          generationStatus: "generating",
          generationError: null,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, existingBlog.id))
    }

    // 5. Run AI Generation
    try {
      const generated = await generateLaunchBlog(itemData)
      const resolvedSlug = await resolveUniqueBlogSlug(
        generated.slug,
        currentBlogId
      )

      // 6. Update blog record with full generated content
      const [completedBlog] = await db
        .update(blogs)
        .set({
          slug: resolvedSlug,
          title: generated.title,
          metaTitle: generated.metaTitle,
          metaDescription: generated.metaDescription,
          excerpt: generated.excerpt,
          content: generated.contentMarkdown,
          verdictRating: String(generated.verdictRating),
          verdictSummary: generated.verdictSummary,
          pros: generated.pros,
          cons: generated.cons,
          faqs: generated.faqs,
          readingTimeMinutes: generated.readingTimeMinutes,
          coverImageUrl: itemData.images?.[0] || null,
          status: blogStatus,
          generationStatus: "completed",
          generationError: null,
          publishedAt: effectiveLaunchDate,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, currentBlogId!))
        .returning()

      return { success: true, blog: completedBlog }
    } catch (genErr) {
      const errorMsg =
        genErr instanceof Error ? genErr.message : "AI blog generation failed."
      console.error("[LaunchBlogService - Generation Error]:", genErr)

      await db
        .update(blogs)
        .set({
          generationStatus: "failed",
          generationError: errorMsg,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, currentBlogId!))

      return { success: false, error: errorMsg }
    }
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Unexpected error in launch blog service."
    console.error("[LaunchBlogService - Unexpected Error]:", err)
    return { success: false, error: errorMsg }
  }
}

