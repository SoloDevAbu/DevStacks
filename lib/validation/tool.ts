import { z } from "zod"
import { platformEnumSchema } from "@/lib/validation/product"

const urlSchema = z.string().url("Must be a valid URL").or(z.literal(""))

export const submitToolSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  tagline: z.string().min(10, "Tagline too short").max(200),
  description: z.string().min(20, "Description too short").max(3000),
  problemStatement: z.string().max(1000).optional().or(z.literal("")),
  solution: z.string().max(1000).optional().or(z.literal("")),
  uniqueValue: z.string().max(1000).optional().or(z.literal("")),
  websiteUrl: z.string().url("Website URL must be a valid URL"),
  logoUrl: urlSchema.optional(),
  githubUrl: urlSchema.optional(),
  twitterUrl: urlSchema.optional(),
  linkedinUrl: urlSchema.optional(),
  discordUrl: urlSchema.optional(),
  appStoreUrl: urlSchema.optional(),
  playStoreUrl: urlSchema.optional(),
  chromeExtensionUrl: urlSchema.optional(),
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
  platforms: z.array(platformEnumSchema).default([]),
  pricing: z.enum(["Free", "Freemium", "Paid", "Open Source"]).default("Free"),
  images: z.array(z.string().url()).max(5).default([]),
  demoVideoUrl: urlSchema.optional(),
  useCases: z.string().max(2000).optional().or(z.literal("")),
  keywords: z.string().max(500).optional().or(z.literal("")),
  targetAudience: z.string().max(200).optional().or(z.literal("")),
  geoTarget: z.string().max(100).optional().or(z.literal("")),
  asoCategory: z.string().max(100).optional().or(z.literal("")),
  metaTitle: z.string().max(60).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  aiContext: z.string().max(1000).optional().or(z.literal("")),
  faqs: z
    .array(
      z.object({
        id: z.string().optional(),
        question: z.string().trim().min(1, "Question is required"),
        answer: z.string().trim().min(1, "Answer is required"),
      })
    )
    .optional()
    .nullable()
    .transform((val) => val ?? []),
})

export type SubmitToolInput = z.infer<typeof submitToolSchema>
