import { db } from "@/db"
import { tools, toolFaqs } from "@/db/schema"
import { getOrCreateCategory } from "@/db/queries/categories/list"
import { getFaviconUrl } from "@/utils/urls"
import { eq, and } from "drizzle-orm"
import type { SubmitToolInput } from "@/lib/validation/tool"

export const updateTool = async (
  slug: string,
  userId: string,
  data: Partial<SubmitToolInput>
) => {
  const [existing] = await db
    .select()
    .from(tools)
    .where(and(eq(tools.slug, slug), eq(tools.submitterId, userId)))
    .limit(1)

  if (!existing) {
    throw new Error("Tool not found or you are not authorized to edit it.")
  }

  const { category, faqs, tags, platforms, ...rest } = data

  let categoryId = existing.categoryId
  if (category !== undefined) {
    if (category && category.trim()) {
      categoryId = await getOrCreateCategory(category)
    } else {
      categoryId = null
    }
  }

  let logoUrl = rest.logoUrl ?? existing.logoUrl
  if (!logoUrl && rest.websiteUrl) {
    logoUrl = getFaviconUrl(rest.websiteUrl)
  }

  const updatedFields: Record<string, any> = {
    updatedAt: new Date(),
  }

  if (rest.name !== undefined) updatedFields.name = rest.name.trim()
  if (rest.tagline !== undefined) updatedFields.tagline = rest.tagline.trim()
  if (rest.description !== undefined) updatedFields.description = rest.description.trim()
  if (rest.problemStatement !== undefined) updatedFields.problemStatement = rest.problemStatement?.trim() || null
  if (rest.solution !== undefined) updatedFields.solution = rest.solution?.trim() || null
  if (rest.uniqueValue !== undefined) updatedFields.uniqueValue = rest.uniqueValue?.trim() || null
  if (rest.websiteUrl !== undefined) updatedFields.websiteUrl = rest.websiteUrl.trim()
  if (logoUrl !== undefined) updatedFields.logoUrl = logoUrl
  if (rest.githubUrl !== undefined) updatedFields.githubUrl = rest.githubUrl?.trim() || null
  if (rest.twitterUrl !== undefined) updatedFields.twitterUrl = rest.twitterUrl?.trim() || null
  if (rest.linkedinUrl !== undefined) updatedFields.linkedinUrl = rest.linkedinUrl?.trim() || null
  if (rest.discordUrl !== undefined) updatedFields.discordUrl = rest.discordUrl?.trim() || null
  if (rest.appStoreUrl !== undefined) updatedFields.appStoreUrl = rest.appStoreUrl?.trim() || null
  if (rest.playStoreUrl !== undefined) updatedFields.playStoreUrl = rest.playStoreUrl?.trim() || null
  if (rest.chromeExtensionUrl !== undefined) updatedFields.chromeExtensionUrl = rest.chromeExtensionUrl?.trim() || null
  if (rest.demoVideoUrl !== undefined) updatedFields.demoVideoUrl = rest.demoVideoUrl?.trim() || null
  if (rest.useCases !== undefined) updatedFields.useCases = rest.useCases?.trim() || null
  if (rest.keywords !== undefined) updatedFields.keywords = rest.keywords?.trim() || null
  if (rest.targetAudience !== undefined) updatedFields.targetAudience = rest.targetAudience?.trim() || null
  if (rest.metaTitle !== undefined) updatedFields.metaTitle = rest.metaTitle?.trim() || null
  if (rest.metaDescription !== undefined) updatedFields.metaDescription = rest.metaDescription?.trim() || null
  if (rest.aiContext !== undefined) updatedFields.aiContext = rest.aiContext?.trim() || null
  if (rest.geoTarget !== undefined) updatedFields.geoTarget = rest.geoTarget?.trim() || null
  if (rest.asoCategory !== undefined) updatedFields.asoCategory = rest.asoCategory?.trim() || null
  if (rest.images !== undefined) updatedFields.images = rest.images
  if (rest.pricing !== undefined) updatedFields.pricing = rest.pricing
  if (tags !== undefined) {
    updatedFields.tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? (tags as string).split(",").map((t: string) => t.trim()).filter(Boolean)
        : []
  }
  if (platforms !== undefined) updatedFields.platforms = platforms
  if (category !== undefined) updatedFields.categoryId = categoryId

  const [updated] = await db
    .update(tools)
    .set(updatedFields)
    .where(eq(tools.id, existing.id))
    .returning()

  if (Array.isArray(faqs)) {
    await db.delete(toolFaqs).where(eq(toolFaqs.toolId, existing.id))
    if (faqs.length > 0) {
      await db.insert(toolFaqs).values(
        faqs.map((faq, index) => ({
          toolId: existing.id,
          question: faq.question.trim(),
          answer: faq.answer.trim(),
          sortOrder: index,
        }))
      )
    }
  }

  return updated
}
