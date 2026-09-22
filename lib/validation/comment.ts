import { z } from "zod"

export const URL_REGEX =
  /(https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.(com|org|net|io|co|app|dev|ai|xyz|me|tech|info|biz|site|online|cloud|software|agency)[^\s]*/i

export const containsLink = (text: string): boolean => URL_REGEX.test(text)

export const createCommentSchema = z.object({
  userId: z.string().optional(),
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long (max 1000 characters)")
    .refine((val) => !URL_REGEX.test(val), {
      message: "Links are not allowed in comments",
    })
    .transform((val) =>
      val
        .replace(/<[^>]*>/g, "")
        .trim()
    ),
})

export const deleteCommentSchema = z.object({
  userId: z.string().min(1, "User ID required"),
})

export type CreateCommentInput = z.input<typeof createCommentSchema>
export type CreateCommentData = z.output<typeof createCommentSchema>
