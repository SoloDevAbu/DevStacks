import { db } from "@/db"
import { users, makerFaqs } from "@/db/schema"
import { eq } from "drizzle-orm"

export interface UpdateUserProfileInput {
  name?: string
  username?: string
  bio?: string | null
  description?: string | null
  websiteUrl?: string | null
  twitterUrl?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  faqs?: Array<{
    question: string
    answer: string
  }>
}

export const updateUserProfile = async (
  userId: string,
  data: UpdateUserProfileInput
) => {
  const updateValues: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (typeof data.name === "string" && data.name.trim()) {
    updateValues.name = data.name.trim()
  }

  if (typeof data.username === "string" && data.username.trim()) {
    updateValues.username = data.username.trim().toLowerCase()
  }

  if (data.bio !== undefined) {
    updateValues.bio = data.bio?.trim() || null
  }

  if (data.description !== undefined) {
    updateValues.description = data.description?.trim() || null
  }

  if (data.websiteUrl !== undefined) {
    updateValues.websiteUrl = data.websiteUrl?.trim() || null
  }

  if (data.twitterUrl !== undefined) {
    updateValues.twitterUrl = data.twitterUrl?.trim() || null
  }

  if (data.githubUrl !== undefined) {
    updateValues.githubUrl = data.githubUrl?.trim() || null
  }

  if (data.linkedinUrl !== undefined) {
    updateValues.linkedinUrl = data.linkedinUrl?.trim() || null
  }

  const [updatedUser] = await db
    .update(users)
    .set(updateValues)
    .where(eq(users.id, userId))
    .returning()

  if (data.faqs !== undefined && Array.isArray(data.faqs)) {
    // Delete existing FAQs and insert new ordered set only when faqs is explicitly provided
    await db.delete(makerFaqs).where(eq(makerFaqs.userId, userId))

    if (data.faqs.length > 0) {
      const rowsToInsert = data.faqs
        .filter((f) => f.question?.trim() && f.answer?.trim())
        .map((f, idx) => ({
          userId,
          question: f.question.trim(),
          answer: f.answer.trim(),
          sortOrder: idx,
        }))

      if (rowsToInsert.length > 0) {
        await db.insert(makerFaqs).values(rowsToInsert)
      }
    }
  }

  return updatedUser
}
