import { z } from "zod"
import { AD_PLACEMENT, AD_DURATION } from "@/constants/ads"
import { TIER } from "@/constants/plans"

export const checkoutAdSchema = z.object({
  paymentType: z.literal("ad"),
  placement: z
    .enum([AD_PLACEMENT.SIDEBAR, AD_PLACEMENT.FEED, AD_PLACEMENT.BANNER])
    .default(AD_PLACEMENT.SIDEBAR),
  duration: z
    .enum([AD_DURATION.WEEKLY, AD_DURATION.MONTHLY])
    .default(AD_DURATION.MONTHLY),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(60, "Title cannot exceed 60 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(160, "Description cannot exceed 160 characters"),
  badgeText: z.string().trim().max(20).default("PROMOTED"),
  imageUrl: z
    .string()
    .trim()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
  ctaText: z
    .string()
    .trim()
    .min(2, "CTA text too short")
    .max(30, "CTA text too long")
    .default("Learn More"),
  ctaUrl: z.string().trim().url("Must be a valid destination URL"),
})

export const checkoutListingSchema = z.object({
  paymentType: z.literal("listing"),
  itemType: z.enum(["tool", "product"]),
  itemId: z.string().min(1, "Item ID is required"),
  tier: z.enum([TIER.PREMIUM, TIER.PREMIUM_PLUS]),
})

export const checkoutRequestSchema = z.discriminatedUnion("paymentType", [
  checkoutAdSchema,
  checkoutListingSchema,
])

export type CheckoutAdInput = z.infer<typeof checkoutAdSchema>
export type CheckoutListingInput = z.infer<typeof checkoutListingSchema>
export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>
