import { DIRECTORY_CHECK_OUTCOME } from "@/constants/directories"
import type { DirectoryCheck, LaunchDirectory } from "@/types/directory"

export interface DirectoryCheckSummary {
  total: number
  dofollow: number
  nofollow: number
  unmeasured: number
  withFreeOption: number
  lastCheckedAt: Date | null
}

export const summarizeDirectoryChecks = (
  directories: readonly LaunchDirectory[],
  checks: ReadonlyMap<string, DirectoryCheck>
): DirectoryCheckSummary => {
  const results = directories.flatMap(({ slug }) => {
    const check = checks.get(slug)
    return check ? [check] : []
  })
  const count = (outcome: DirectoryCheck["outcome"]) =>
    results.filter((check) => check.outcome === outcome).length
  const dofollow = count(DIRECTORY_CHECK_OUTCOME.DOFOLLOW)
  const nofollow = count(DIRECTORY_CHECK_OUTCOME.NOFOLLOW)

  return {
    total: directories.length,
    dofollow,
    nofollow,
    unmeasured: directories.length - dofollow - nofollow,
    withFreeOption: directories.filter(({ freeOption }) => Boolean(freeOption))
      .length,
    lastCheckedAt: results.reduce<Date | null>(
      (latest, { checkedAt }) =>
        !latest || checkedAt > latest ? checkedAt : latest,
      null
    ),
  }
}

export const toPercent = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 100) : 0
