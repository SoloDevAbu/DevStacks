export const INDEXNOW = {
  ENDPOINT: "https://api.indexnow.org/indexnow",
  MAX_URLS_PER_REQUEST: 10_000,
  KEY_PATTERN: /^[a-zA-Z0-9-]{8,128}$/,
} as const

export const INDEXNOW_STATUS = {
  SUBMITTED: "submitted",
  SKIPPED: "skipped",
  REJECTED: "rejected",
  FAILED: "failed",
} as const

export type IndexNowStatus =
  (typeof INDEXNOW_STATUS)[keyof typeof INDEXNOW_STATUS]

// 202 means the URLs were received and the key is still being validated, which IndexNow treats
// as success.
export const INDEXNOW_ACCEPTED_STATUSES: readonly number[] = [200, 202]

export const INDEXNOW_REJECTION_REASONS: Record<number, string> = {
  400: "Bad request: the submission was malformed",
  403: "Key not valid: the key file at keyLocation is missing or does not match",
  422: "URLs do not belong to the host, or the key does not match the protocol",
  429: "Too many requests: IndexNow is throttling this host",
}

export const INDEXNOW_KEY_ERRORS = {
  MISSING: "INDEXNOW_KEY is not set",
  NOT_PRODUCTION: "Site URL is not the production host",
  INVALID:
    "INDEXNOW_KEY must be 8-128 characters of a-z, A-Z, 0-9 or '-'. Rotate it with `openssl rand -hex 16`",
} as const
