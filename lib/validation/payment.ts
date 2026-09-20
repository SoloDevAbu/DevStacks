import { z } from "zod"
import { AD_PLACEMENT } from "@/constants/ads"
import { TIER } from "@/constants/plans"

export const checkoutAdSchema = z
  .object({
    paymentType: z.literal("ad"),
    placement: z.enum([AD_PLACEMENT.SIDEBAR, AD_PLACEMENT.FEED]),
    toolId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    selectedWeeks: z
      .array(
        z.object({
          isoYear: z.number().int().min(2024).max(2030),
          isoWeek: z.number().int().min(1).max(53),
        })
      )
      .min(1, "Select at least one week")
      .max(6, "Maximum 6 weeks allowed"),
    ctaText: z
      .string()
      .trim()
      .min(2, "CTA text too short")
      .max(30, "CTA text too long")
      .default("Learn More"),
  })
  .refine((d) => d.toolId || d.productId, {
    message: "Either toolId or productId must be provided",
  })

export const checkoutListingSchema = z.object({
  paymentType: z.literal("listing"),
  itemType: z.enum(["tool", "product"]),
  itemId: z.uuid("Item ID must be a valid UUID"),
  tier: z.enum([TIER.PREMIUM, TIER.PREMIUM_PLUS]),
})

export const checkoutRequestSchema = z.discriminatedUnion("paymentType", [
  checkoutAdSchema,
  checkoutListingSchema,
])

export type CheckoutAdInput = z.infer<typeof checkoutAdSchema>
export type CheckoutListingInput = z.infer<typeof checkoutListingSchema>
export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>
