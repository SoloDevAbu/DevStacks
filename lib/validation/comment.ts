import { z } from "zod"

export const createCommentSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long (max 1000 characters)")
    .transform((val) =>
      val
        .replace(/<[^>]*>/g, "") // strip HTML tags
        .trim()
    ),
})

export const deleteCommentSchema = z.object({
  userId: z.string().min(1, "User ID required"),
})

export type CreateCommentInput = z.input<typeof createCommentSchema>
export type CreateCommentData = z.output<typeof createCommentSchema>
