import { z } from "zod"

const optionalUrlSchema = (label: string) =>
  z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || !val.trim()) return ""
      const trimmed = val.trim()
      if (/^https?:\/\//i.test(trimmed)) return trimmed
      return `https://${trimmed}`
    })
    .refine(
      (val) => {
        if (!val) return true
        try {
          const parsed = new URL(val)
          return parsed.protocol === "http:" || parsed.protocol === "https:"
        } catch {
          return false
        }
      },
      { message: `Please enter a valid ${label} URL` }
    )

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Display name cannot be empty")
    .max(100, "Display name must be 100 characters or less")
    .optional(),
  username: z
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-z0-9_-]+$/i,
      "Username can only contain letters, numbers, hyphens, and underscores"
    )
    .transform((val) => val.toLowerCase().replace(/^@/, ""))
    .optional(),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or less")
    .optional()
    .nullable()
    .or(z.literal("")),
  description: z
    .string()
    .max(5000, "Description must be 5000 characters or less")
    .optional()
    .nullable()
    .or(z.literal("")),
  websiteUrl: optionalUrlSchema("website"),
  twitterUrl: optionalUrlSchema("Twitter/X"),
  githubUrl: optionalUrlSchema("GitHub"),
  linkedinUrl: optionalUrlSchema("LinkedIn"),
  faqs: z
    .array(
      z.object({
        id: z.string().optional(),
        question: z
          .string()
          .trim()
          .min(1, "Question cannot be empty")
          .max(300, "Question must be 300 characters or less"),
        answer: z
          .string()
          .trim()
          .min(1, "Answer cannot be empty")
          .max(3000, "Answer must be 3000 characters or less"),
      })
    )
    .optional()
    .default([]),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
