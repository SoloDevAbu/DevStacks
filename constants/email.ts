export const RESEND_API_URL = "https://api.resend.com/emails"

export const MODERATION_EMAIL_KIND = {
  SUBMISSION_APPROVED: "submission_approved",
  SUBMISSION_REJECTED: "submission_rejected",
  EDIT_APPROVED: "edit_approved",
  EDIT_REJECTED: "edit_rejected",
} as const

export type ModerationEmailKind =
  (typeof MODERATION_EMAIL_KIND)[keyof typeof MODERATION_EMAIL_KIND]

interface ModerationEmailTemplate {
  alias: string
  showsReason: boolean
  linksToListing: boolean
}

// Subject and body copy live in the published Resend templates; edit them in the Resend dashboard.
export const MODERATION_EMAIL_TEMPLATE: Record<ModerationEmailKind, ModerationEmailTemplate> = {
  submission_approved: { alias: "submission-approved", showsReason: false, linksToListing: true },
  submission_rejected: { alias: "submission-rejected", showsReason: true, linksToListing: false },
  edit_approved: { alias: "edit-approved", showsReason: false, linksToListing: true },
  edit_rejected: { alias: "edit-rejected", showsReason: true, linksToListing: false },
}
