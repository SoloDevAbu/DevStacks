import {
  DIRECTORY_CHECK_OUTCOME_META,
  DIRECTORY_FACTS_CHECKED_ON,
  DIRECTORY_KIND_LABELS,
} from "@/constants/directories"
import { LAUNCH_DIRECTORIES } from "@/constants/launch-directories"
import { ROUTES } from "@/constants/routes"
import type { DirectoryCheck, LaunchDirectory } from "@/types/directory"
import { formatFactsCheckedOn } from "@/utils/alternatives"
import { buildDirectoryReviewTitle } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"

const describeCheck = (check: DirectoryCheck | undefined) =>
  check
    ? `${DIRECTORY_CHECK_OUTCOME_META[check.outcome].label} (checked ${check.checkedAt.toISOString().slice(0, 10)}): ${DIRECTORY_CHECK_OUTCOME_META[check.outcome].description}`
    : "Not checked yet."

const factLine = (label: string, value: string | null | undefined) =>
  value ? [`- **${label}:** ${value}`] : []

export const buildDirectoryMarkdown = (
  directory: LaunchDirectory,
  latestCheck: DirectoryCheck | undefined
) =>
  [
    `# ${buildDirectoryReviewTitle(directory.name)}`,
    "",
    `> ${directory.summary}`,
    "",
    `Canonical page: ${toAbsoluteUrl(ROUTES.DIRECTORY(directory.slug))}`,
    `Facts checked on ${formatFactsCheckedOn(DIRECTORY_FACTS_CHECKED_ON)}.`,
    "",
    "## Facts",
    "",
    ...factLine("Type", DIRECTORY_KIND_LABELS[directory.kind]),
    ...factLine("Website", directory.url),
    ...factLine("Free option", directory.freeOption),
    ...factLine("Paid options", directory.paidOptions),
    ...factLine("Stated link policy", directory.statedLinkPolicy),
    ...factLine("Review time", directory.reviewTime),
    "",
    "## Measured link check",
    "",
    describeCheck(latestCheck),
    ...(directory.sample
      ? [
          "",
          `- Sample listing: ${directory.sample.listingUrl}`,
          `- Product linked: ${directory.sample.targetUrl}`,
        ]
      : directory.unmeasuredReason
        ? ["", directory.unmeasuredReason]
        : []),
    "",
    "## Sources",
    "",
    ...directory.sources.map(({ label, url }) => `- [${label}](${url})`),
    ...(directory.comparisonPath
      ? [
          "",
          `Full comparison with LaunchNests: ${toAbsoluteUrl(directory.comparisonPath)}`,
        ]
      : []),
    "",
  ].join("\n")

export const buildDirectoriesHubMarkdown = (
  latestChecks: Map<string, DirectoryCheck>
) =>
  [
    "# Launch Directory Database",
    "",
    "> Prices, review times, stated link policies and a weekly machine check of the link each launch directory gives a real listing.",
    "",
    `Canonical page: ${toAbsoluteUrl(ROUTES.DIRECTORIES)}`,
    `Facts checked on ${formatFactsCheckedOn(DIRECTORY_FACTS_CHECKED_ON)}.`,
    "",
    "| Directory | Type | Free option | Paid options | Latest link check |",
    "|---|---|---|---|---|",
    ...LAUNCH_DIRECTORIES.map((directory) => {
      const check = latestChecks.get(directory.slug)
      const cells = [
        `[${directory.name}](${toAbsoluteUrl(ROUTES.DIRECTORY(directory.slug))})`,
        DIRECTORY_KIND_LABELS[directory.kind],
        directory.freeOption ?? "None",
        directory.paidOptions ?? "None",
        check ? DIRECTORY_CHECK_OUTCOME_META[check.outcome].label : "Not checked",
      ]
      return `| ${cells.map((cell) => cell.replace(/\|/g, "/")).join(" | ")} |`
    }),
    "",
    `Link check report: ${toAbsoluteUrl(ROUTES.DIRECTORIES_LINK_CHECK_REPORT)}`,
    "",
  ].join("\n")
