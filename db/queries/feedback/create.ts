import { db } from "@/db"
import { feedbacks } from "@/db/schema"

interface CreateFeedbackParams {
  userId?: string | null
  type: "bug" | "improvement" | "feature" | "other"
  title?: string | null
  message: string
  email?: string | null
  pageUrl?: string | null
}

export const createFeedback = async ({
  userId,
  type,
  title,
  message,
  email,
  pageUrl,
}: CreateFeedbackParams) => {
  const [feedback] = await db
    .insert(feedbacks)
    .values({
      userId: userId ?? null,
      type,
      title: title?.trim() || null,
      message: message.trim(),
      email: email?.trim() || null,
      pageUrl: pageUrl?.trim() || null,
    })
    .returning()

  return feedback
}
