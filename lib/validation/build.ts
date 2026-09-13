import { z } from "zod"
import { submitProductSchema } from "@/lib/validation/product"

export const submitBuildSchema = submitProductSchema.extend({
  authorId: z.string().optional(),
  tools: z.string().optional().or(z.literal("")),
  logoText: z.string().max(4).optional().or(z.literal("")),
  logoBg: z.string().optional().or(z.literal("")),
})

export type SubmitBuildInput = z.input<typeof submitBuildSchema>
export type SubmitBuildData = z.output<typeof submitBuildSchema>
