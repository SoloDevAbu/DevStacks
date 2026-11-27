export const SUBMISSION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const

export type SubmissionStatus =
  (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS]

export const SUBMISSION_STATUSES = Object.values(SUBMISSION_STATUS) as [
  SubmissionStatus,
  ...SubmissionStatus[],
]

// "all" is stripped from URLs by buildPageHref, so the admin filters use "any".
export const ADMIN_FILTER_ANY = "any"

export const SUBMISSION_STATUS_FILTER_ALL = ADMIN_FILTER_ANY

export type SubmissionStatusFilter =
  | SubmissionStatus
  | typeof SUBMISSION_STATUS_FILTER_ALL

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
}

export const REVISION_ACTION = {
  APPROVE: "approve",
  REJECT: "reject",
} as const

export type RevisionAction =
  (typeof REVISION_ACTION)[keyof typeof REVISION_ACTION]

export const REVIEW_NOTE_MIN_LENGTH = 5
export const REVIEW_NOTE_MAX_LENGTH = 1000

export const ADMIN_PAGE_SIZE = 25

export const LISTING_EDIT_MESSAGE = {
  APPLIED: "Changes saved. Redirecting…",
  QUEUED:
    "Changes sent for review. Your current listing stays live until an admin approves them. Redirecting…",
  PENDING_EDIT:
    "You have changes waiting for review. They're shown below; saving again updates the same request.",
  PENDING_LISTING: "This listing is waiting for review. Edits apply straight away.",
  REJECTED_LISTING: "This listing wasn't approved. Saving your edits resubmits it for review.",
  REJECTED_EDIT: "Your last edit request wasn't approved.",
} as const
