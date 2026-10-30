import { SITE_CONFIG } from "@/constants/site"

export interface RotatingHeadlineOption {
  text: string
  colorClass?: string
}

export const HOME_HERO_ROTATING_OPTIONS: readonly RotatingHeadlineOption[] = [
  { text: "Developers", colorClass: "text-blue-600 dark:text-blue-400" },
  { text: "Potential Users", colorClass: "text-blue-600 dark:text-blue-400" },
  { text: "Google", colorClass: "text-blue-600 dark:text-blue-400" },
  { text: "AI Search", colorClass: "text-blue-600 dark:text-blue-400" },
  { text: "Early Adopters", colorClass: "text-blue-600 dark:text-blue-400" },
  { text: "AI Assistants", colorClass: "text-blue-600 dark:text-blue-400" },
] as const

export const HOME_HERO_PREFIX = "Get your product discovered by"

export const HOME_ROTATION_INTERVAL_MS = 3000

export const HOME_HERO_DESCRIPTION =
  `Launch your product on ${SITE_CONFIG.name} to reach more people. Get a permanent product page, quality backlinks, and discoverability across search engines and AI platforms.`

export const HOME_HERO_BADGES = [
  "Free to launch",
  "Permanent product page",
  "Search & AI visibility",
] as const
