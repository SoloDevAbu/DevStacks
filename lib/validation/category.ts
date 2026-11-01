import { z } from "zod"
import { getCanonicalCategory } from "@/constants/categories"

export const canonicalCategorySchema = z
  .string()
  .trim()
  .min(1, "Primary category is required")
  .refine(
    (val) => Boolean(getCanonicalCategory(val)),
    {
      message: "Invalid category. Please select an official canonical category.",
    }
  )
  .transform((val) => {
    const canonical = getCanonicalCategory(val)
    return canonical ? canonical.name : val
  })