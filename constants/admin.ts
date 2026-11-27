import { ROUTES } from "@/constants/routes"
import { ADMIN_FILTER_ANY } from "@/constants/moderation"

export const ADMIN_AUDIT_ACTION = {
  SUBMISSION_APPROVED: "submission.approved",
  SUBMISSION_REJECTED: "submission.rejected",
  SUBMISSION_RESET: "submission.reset",
  REVISION_APPROVED: "revision.approved",
  REVISION_REJECTED: "revision.rejected",
  BLOG_REGENERATED: "blog.regenerated",
  INDEXNOW_SUBMITTED: "indexnow.submitted",
  AD_STATUS_CHANGED: "ad.status_changed",
} as const

export type AdminAuditAction =
  (typeof ADMIN_AUDIT_ACTION)[keyof typeof ADMIN_AUDIT_ACTION]

export const ADMIN_AUDIT_TARGET = {
  TOOL: "tool",
  PRODUCT: "product",
  REVISION: "revision",
  BLOG: "blog",
  AD: "ad",
  PATHS: "paths",
} as const

export type AdminAuditTarget =
  (typeof ADMIN_AUDIT_TARGET)[keyof typeof ADMIN_AUDIT_TARGET]

export const ADMIN_NAV_COUNT_KEY = {
  SUBMISSIONS: "submissions",
  EDITS: "edits",
} as const

export type AdminNavCountKey =
  (typeof ADMIN_NAV_COUNT_KEY)[keyof typeof ADMIN_NAV_COUNT_KEY]

export interface AdminNavItem {
  label: string
  href: string
  countKey?: AdminNavCountKey
}

export interface AdminNavSection {
  label: string
  items: readonly AdminNavItem[]
}

export const ADMIN_NAV: readonly AdminNavSection[] = [
  {
    label: "Moderation",
    items: [
      { label: "Overview", href: ROUTES.ADMIN },
      {
        label: "Submissions",
        href: ROUTES.ADMIN_SUBMISSIONS,
        countKey: ADMIN_NAV_COUNT_KEY.SUBMISSIONS,
      },
      { label: "Edit requests", href: ROUTES.ADMIN_EDITS, countKey: ADMIN_NAV_COUNT_KEY.EDITS },
      { label: "Launches", href: ROUTES.ADMIN_LAUNCHES },
    ],
  },
  {
    label: "Revenue",
    items: [
      { label: "Payments", href: ROUTES.ADMIN_PAYMENTS },
      { label: "Ads", href: ROUTES.ADMIN_ADS },
    ],
  },
  {
    label: "System",
    items: [{ label: "Audit log", href: ROUTES.ADMIN_AUDIT }],
  },
]

export const ADMIN_PAYMENT_STATUS_OPTIONS = [
  { value: ADMIN_FILTER_ANY, label: "All" },
  { value: "succeeded", label: "Succeeded" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "cancelled", label: "Cancelled" },
] as const

export const ADMIN_PAYMENT_TYPE_OPTIONS = [
  { value: ADMIN_FILTER_ANY, label: "All types" },
  { value: "listing", label: "Listings" },
  { value: "ad", label: "Ads" },
] as const

export const ADMIN_AD_STATUS_OPTIONS = [
  { value: ADMIN_FILTER_ANY, label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "pending_payment", label: "Awaiting payment" },
  { value: "expired", label: "Expired" },
  { value: "rejected", label: "Rejected" },
] as const
