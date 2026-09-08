import { z } from "zod"

const urlSchema = z.string().url("Must be a valid URL").or(z.literal(""))

export const submitProductSchema = z.object({
  submitterId: z.string().min(1, "User ID required"),

  // General
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  tagline: z
    .string()
    .min(10, "Tagline too short")
    .max(60, "Tagline max 60 characters"),
  description: z.string().min(20, "Description too short").max(2000),

  // Deep Dive (optional)
  problemStatement: z.string().max(1000).optional().or(z.literal("")),
  solution: z.string().max(1000).optional().or(z.literal("")),
  uniqueValue: z.string().max(1000).optional().or(z.literal("")),

  // Links
  websiteUrl: z.string().url("Website URL must be a valid URL"),
  logoUrl: urlSchema.optional(),
  githubUrl: urlSchema.optional(),
  twitterUrl: urlSchema.optional(),
  linkedinUrl: urlSchema.optional(),
  discordUrl: urlSchema.optional(),

  // Discoverability / SEO/AEO/GEO/ASO
  keywords: z.string().max(500).optional().or(z.literal("")),
  targetAudience: z.string().max(200).optional().or(z.literal("")),
  metaTitle: z.string().max(60).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  aiContext: z.string().max(1000).optional().or(z.literal("")),
  geoTarget: z.string().max(200).optional().or(z.literal("")),
  asoCategory: z.string().max(100).optional().or(z.literal("")),

  // Internal
  category: z.string().max(100).optional().or(z.literal("")),
  tags: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    )
    .or(z.array(z.string()))
    .default([]),
  platforms: z.array(z.string()).default([]),
  pricing: z.enum(["Free", "Freemium", "Paid", "Open Source"]).default("Free"),
})

export type SubmitProductInput = z.input<typeof submitProductSchema>
export type SubmitProductData = z.output<typeof submitProductSchema>
