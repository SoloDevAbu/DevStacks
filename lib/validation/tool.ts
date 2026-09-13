import { z } from "zod"

export const submitToolSchema = z.object({
  name: z.string().min(2).max(100),
  tagline: z.string().min(10).max(200),
  description: z.string().min(20),
  websiteUrl: z.string().url(),
  logoUrl: z.string().optional(),
  githubUrl: z.string().url().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  pricing: z.enum(["Free", "Freemium", "Paid", "Open Source"]).default("Free"),
  images: z.array(z.string().url()).max(5).default([]),
  demoVideoUrl: z.string().url().optional().or(z.literal("")),
  useCases: z.string().max(2000).optional().or(z.literal("")),
})

export type SubmitToolInput = z.infer<typeof submitToolSchema>
