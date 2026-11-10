import { revalidatePath } from "next/cache"
import { DIRECTORY_CHECK } from "@/constants/directories"
import { LAUNCH_DIRECTORIES } from "@/constants/launch-directories"
import { ROUTES } from "@/constants/routes"
import {
  getLatestDirectoryChecks,
  saveDirectoryCheck,
} from "@/db/queries/directories"
import { checkDirectoryListing } from "@/lib/directories/check-listing"
import type { LaunchDirectory } from "@/types/directory"
import { DAY_MS } from "@/utils/date"

const checkDirectory = async (directory: LaunchDirectory, checkedAt: Date) => {
  const result = await checkDirectoryListing(directory.sample!)
  await saveDirectoryCheck(directory.slug, result, checkedAt)
  return { slug: directory.slug, ...result }
}

// Runs from the daily cron but only re-checks directories whose last check is older than
// INTERVAL_DAYS, so each one is checked about once a week.
export const recheckDueDirectories = async (now = new Date()) => {
  const latest = await getLatestDirectoryChecks()
  const cutoff = now.getTime() - DIRECTORY_CHECK.INTERVAL_DAYS * DAY_MS
  const due = LAUNCH_DIRECTORIES.filter(
    (directory) =>
      directory.sample &&
      (latest.get(directory.slug)?.checkedAt.getTime() ?? 0) < cutoff
  )

  const results: Awaited<ReturnType<typeof checkDirectory>>[] = []
  for (let i = 0; i < due.length; i += DIRECTORY_CHECK.CONCURRENCY) {
    const batch = due.slice(i, i + DIRECTORY_CHECK.CONCURRENCY)
    results.push(
      ...(await Promise.all(batch.map((item) => checkDirectory(item, now))))
    )
  }

  if (results.length > 0) {
    revalidatePath(ROUTES.DIRECTORIES)
    results.forEach(({ slug }) => revalidatePath(ROUTES.DIRECTORY(slug)))
  }

  return results
}
