export const RESEND_API_URL = "https://api.resend.com/emails"

export const MODERATION_EMAIL_KIND = {
  SUBMISSION_APPROVED: "submission_approved",
  SUBMISSION_REJECTED: "submission_rejected",
  EDIT_APPROVED: "edit_approved",
  EDIT_REJECTED: "edit_rejected",
} as const

export type ModerationEmailKind =
  (typeof MODERATION_EMAIL_KIND)[keyof typeof MODERATION_EMAIL_KIND]

interface ModerationEmailCopy {
  subject: (name: string) => string
  intro: (name: string) => string
  cta: string
  showsReason: boolean
  linksToListing: boolean
}

export const MODERATION_EMAIL_COPY: Record<ModerationEmailKind, ModerationEmailCopy> = {
  submission_approved: {
    subject: (name) => `${name} is approved on LaunchNests`,
    intro: (name) =>
      `Good news: ${name} has been approved and will go live in its launch week.`,
    cta: "View your listing",
    showsReason: false,
    linksToListing: true,
  },
  submission_rejected: {
    subject: (name) => `${name} wasn't approved on LaunchNests`,
    intro: (name) =>
      `We reviewed ${name} and couldn't approve it yet. You can fix the points below and edit the listing from your dashboard; editing resubmits it for review.`,
    cta: "Open your dashboard",
    showsReason: true,
    linksToListing: false,
  },
  edit_approved: {
    subject: (name) => `Your changes to ${name} are live`,
    intro: (name) => `Your latest edits to ${name} were approved and are now live.`,
    cta: "View your listing",
    showsReason: false,
    linksToListing: true,
  },
  edit_rejected: {
    subject: (name) => `Your changes to ${name} weren't approved`,
    intro: (name) =>
      `We reviewed your latest edits to ${name} and couldn't approve them. The current version stays live. You can submit new changes from your dashboard.`,
    cta: "Open your dashboard",
    showsReason: true,
    linksToListing: false,
  },
}
