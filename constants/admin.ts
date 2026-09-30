export const ADMIN_PRIMARY_EMAIL = "abubakkar2502@gmail.com"

const envEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export const ADMIN_EMAILS = Array.from(
  new Set([ADMIN_PRIMARY_EMAIL.toLowerCase(), ...envEmails])
)

export const ADMIN_STATUS_FILTERS = {
  ALL: "all",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const

export type AdminStatusFilter =
  (typeof ADMIN_STATUS_FILTERS)[keyof typeof ADMIN_STATUS_FILTERS]

export const ADMIN_ITEM_TYPE_FILTERS = {
  ALL: "all",
  TOOL: "tool",
  PRODUCT: "product",
} as const

export type AdminItemTypeFilter =
  (typeof ADMIN_ITEM_TYPE_FILTERS)[keyof typeof ADMIN_ITEM_TYPE_FILTERS]

export const ADMIN_SORT_OPTIONS = {
  RECENT: "recent",
  NAME: "name",
} as const

export type AdminSortOption =
  (typeof ADMIN_SORT_OPTIONS)[keyof typeof ADMIN_SORT_OPTIONS]

export const STATUS_BADGE_VARIANTS = {
  pending: "border-amber-300 bg-amber-50 text-amber-800",
  approved: "border-emerald-300 bg-emerald-50 text-emerald-800",
  rejected: "border-rose-300 bg-rose-50 text-rose-800",
} as const
