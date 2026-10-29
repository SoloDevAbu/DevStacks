export const FEEDBACK_TYPES = {
  IMPROVEMENT: "improvement",
  BUG: "bug",
  FEATURE: "feature",
  OTHER: "other",
} as const

export type FeedbackType =
  (typeof FEEDBACK_TYPES)[keyof typeof FEEDBACK_TYPES]

export interface FeedbackTypeOption {
  value: FeedbackType
  label: string
  description: string
}

export const FEEDBACK_TYPE_OPTIONS: FeedbackTypeOption[] = [
  {
    value: FEEDBACK_TYPES.IMPROVEMENT,
    label: "Improvement",
    description: "Suggestions to make the experience better",
  },
  {
    value: FEEDBACK_TYPES.BUG,
    label: "Bug Report",
    description: "Something is broken or not working as expected",
  },
  {
    value: FEEDBACK_TYPES.FEATURE,
    label: "Feature Request",
    description: "New capability or tool you'd like to see added",
  },
  {
    value: FEEDBACK_TYPES.OTHER,
    label: "Other",
    description: "General thoughts, questions, or message",
  },
]

export const FEEDBACK_LIMITS = {
  TITLE_MAX: 100,
  MESSAGE_MIN: 5,
  MESSAGE_MAX: 2000,
} as const
