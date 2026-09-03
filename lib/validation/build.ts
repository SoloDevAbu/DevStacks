import { z } from "zod"

export const submitBuildSchema = z.object({
  authorId: z.string().min(1, "User ID required"),
  name: z.string().min(2, "Project name too short").max(100),
  description: z.string().min(10, "Description too short").max(1000),
  logoText: z.string().min(1).max(4),
  logoBg: z.string().min(1, "Logo background class required"),
  productIds: z.array(z.string().uuid()).min(1, "Select at least one product"),
})

export type SubmitBuildInput = z.input<typeof submitBuildSchema>
export type SubmitBuildData = z.output<typeof submitBuildSchema>
