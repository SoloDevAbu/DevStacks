import { BADGE_CHECK } from "@/constants/badges"

export const DIRECTORY_FACTS_CHECKED_ON = "2026-11-10"

export const DIRECTORY_KIND = {
  LAUNCH_PLATFORM: "launch-platform",
  SOFTWARE_DIRECTORY: "software-directory",
  AI_DIRECTORY: "ai-directory",
} as const

export type DirectoryKind = (typeof DIRECTORY_KIND)[keyof typeof DIRECTORY_KIND]

export const DIRECTORY_KIND_LABELS: Record<DirectoryKind, string> = {
  "launch-platform": "Launch platform",
  "software-directory": "Software directory",
  "ai-directory": "AI tool directory",
}

export const DIRECTORY_KIND_PLURAL_LABELS: Record<DirectoryKind, string> = {
  "launch-platform": "Launch platforms",
  "software-directory": "Software directories",
  "ai-directory": "AI tool directories",
}

export const DIRECTORY_CHECK_OUTCOME = {
  DOFOLLOW: "dofollow",
  NOFOLLOW: "nofollow",
  LINK_NOT_FOUND: "link_not_found",
  BLOCKED: "blocked",
  PAGE_GONE: "page_gone",
  ERROR: "error",
} as const

export type DirectoryCheckOutcome =
  (typeof DIRECTORY_CHECK_OUTCOME)[keyof typeof DIRECTORY_CHECK_OUTCOME]

export const LINK_PATH = {
  DIRECT: "direct",
  REDIRECT: "redirect",
} as const

export type LinkPath = (typeof LINK_PATH)[keyof typeof LINK_PATH]

export const DIRECTORY_CHECK_OUTCOME_META: Record<
  DirectoryCheckOutcome,
  {
    label: string
    description: string
    tone: "positive" | "negative" | "neutral"
  }
> = {
  dofollow: {
    label: "Dofollow",
    description:
      "The sample listing links to the product without nofollow, ugc or sponsored.",
    tone: "positive",
  },
  nofollow: {
    label: "Nofollow",
    description:
      "The sample listing's link carries nofollow, ugc or sponsored, or the page tells search engines not to follow its links.",
    tone: "negative",
  },
  link_not_found: {
    label: "Link not in HTML",
    description:
      "The page loaded but its HTML has no link to the product. The link is probably added by JavaScript, so we can't read its rel.",
    tone: "neutral",
  },
  blocked: {
    label: "Blocked our checker",
    description:
      "The site refused or challenged our request, so we couldn't read the page.",
    tone: "neutral",
  },
  page_gone: {
    label: "Sample removed",
    description:
      "The sample listing returned 404 or 410. We need a new sample for this directory.",
    tone: "neutral",
  },
  error: {
    label: "Check failed",
    description: "The page timed out or returned a server error.",
    tone: "neutral",
  },
}

export const DIRECTORY_CHECK = {
  INTERVAL_DAYS: 7,
  CONCURRENCY: 4,
  TIMEOUT_MS: 15_000,
  USER_AGENT: BADGE_CHECK.USER_AGENT,
  MAX_REDIRECT_CANDIDATES: 3,
  MAX_REDIRECT_HOPS: 4,
  HISTORY_LIMIT: 8,
} as const

export const DIRECTORY_COPY = {
  NOT_STATED: "Not stated",
  NOT_MEASURED: "Not measured",
  NOT_CHECKED: "Not checked yet",
} as const

export const LINK_PATH_LABELS: Record<LinkPath, string> = {
  direct: "Direct link to the product",
  redirect: "Through the directory's own redirect",
}
