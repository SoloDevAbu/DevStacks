import { z } from "zod"
import {
  REVIEW_NOTE_MAX_LENGTH,
  REVIEW_NOTE_MIN_LENGTH,
  REVISION_ACTION,
  SUBMISSION_STATUS,
  SUBMISSION_STATUSES,
} from "@/constants/moderation"
import { ADMIN_AD_TARGET_STATUSES } from "@/constants/ads"

const reviewNoteSchema = z
  .string()
  .trim()
  .min(REVIEW_NOTE_MIN_LENGTH, "Give the maker a reason they can act on.")
  .max(REVIEW_NOTE_MAX_LENGTH)

export const listingItemTypeSchema = z.enum(["tool", "product"])

export const submissionReviewSchema = z
  .object({
    status: z.enum(SUBMISSION_STATUSES),
    reviewNote: reviewNoteSchema.optional(),
  })
  .refine(
    (value) => value.status !== SUBMISSION_STATUS.REJECTED || Boolean(value.reviewNote),
    { message: "A reason is required when rejecting.", path: ["reviewNote"] }
  )

export const revisionReviewSchema = z
  .object({
    action: z.enum([REVISION_ACTION.APPROVE, REVISION_ACTION.REJECT]),
    reviewNote: reviewNoteSchema.optional(),
  })
  .refine(
    (value) => value.action !== REVISION_ACTION.REJECT || Boolean(value.reviewNote),
    { message: "A reason is required when rejecting.", path: ["reviewNote"] }
  )

export const adStatusUpdateSchema = z.object({
  status: z.enum(ADMIN_AD_TARGET_STATUSES),
})

export type SubmissionReviewInput = z.infer<typeof submissionReviewSchema>
export type RevisionReviewInput = z.infer<typeof revisionReviewSchema>
export type AdStatusUpdateInput = z.infer<typeof adStatusUpdateSchema>
