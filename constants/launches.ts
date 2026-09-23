export const MAX_FREE_LAUNCHES_PER_WEEK = 25
export const LAUNCH_HORIZON_WEEKS = 8

export const LAUNCH_ITEM_TYPE = {
  TOOL: "tool",
  PRODUCT: "product",
} as const

export type LaunchItemType =
  (typeof LAUNCH_ITEM_TYPE)[keyof typeof LAUNCH_ITEM_TYPE]

export const LAUNCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const

export type LaunchStatus =
  (typeof LAUNCH_STATUS)[keyof typeof LAUNCH_STATUS]
