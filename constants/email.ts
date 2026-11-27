export const RESEND_API_URL = "https://api.resend.com/emails"

// Aliases of the published Resend templates. Subject and body copy live in Resend; edit them there.
export const EMAIL_TEMPLATE = {
  SUBMISSION_RECEIVED: "submission-received",
  SUBMISSION_RECEIVED_FREE: "submission-received-free",
  SUBMISSION_APPROVED_LIVE: "submission-approved",
  SUBMISSION_APPROVED_SCHEDULED: "submission-approved-scheduled",
  SUBMISSION_REJECTED: "submission-rejected",
  EDIT_APPROVED: "edit-approved",
  EDIT_REJECTED: "edit-rejected",
} as const

export type EmailTemplate = (typeof EMAIL_TEMPLATE)[keyof typeof EMAIL_TEMPLATE]

export const MODERATION_EMAIL_KIND = {
  SUBMISSION_APPROVED: "submission_approved",
  SUBMISSION_REJECTED: "submission_rejected",
  EDIT_APPROVED: "edit_approved",
  EDIT_REJECTED: "edit_rejected",
} as const

export type ModerationEmailKind =
  (typeof MODERATION_EMAIL_KIND)[keyof typeof MODERATION_EMAIL_KIND]

export const EMAIL_FALLBACK = {
  REVIEW_NOTE: "No details were given.",
  LAUNCH_WEEK: "Not scheduled yet",
  FREE_PLAN_SUFFIX: " (free)",
} as const
