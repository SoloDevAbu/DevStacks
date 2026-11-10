import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { directoryLinkChecks } from "@/db/schema"
import { DIRECTORY_CHECK } from "@/constants/directories"
import type { DirectoryCheck, DirectoryCheckResult } from "@/types/directory"

const toDirectoryCheck = (
  row: typeof directoryLinkChecks.$inferSelect
): DirectoryCheck => ({
  directorySlug: row.directorySlug,
  outcome: row.outcome as DirectoryCheck["outcome"],
  rel: row.rel,
  linkPath: row.linkPath as DirectoryCheck["linkPath"],
  httpStatus: row.httpStatus,
  checkedAt: row.checkedAt,
})

export const getLatestDirectoryChecks = async (): Promise<
  Map<string, DirectoryCheck>
> => {
  const rows = await db
    .selectDistinctOn([directoryLinkChecks.directorySlug])
    .from(directoryLinkChecks)
    .orderBy(
      directoryLinkChecks.directorySlug,
      desc(directoryLinkChecks.checkedAt)
    )

  return new Map(rows.map((row) => [row.directorySlug, toDirectoryCheck(row)]))
}

export const getDirectoryCheckHistory = async (
  directorySlug: string
): Promise<DirectoryCheck[]> => {
  const rows = await db
    .select()
    .from(directoryLinkChecks)
    .where(eq(directoryLinkChecks.directorySlug, directorySlug))
    .orderBy(desc(directoryLinkChecks.checkedAt))
    .limit(DIRECTORY_CHECK.HISTORY_LIMIT)

  return rows.map(toDirectoryCheck)
}

export const saveDirectoryCheck = async (
  directorySlug: string,
  result: DirectoryCheckResult,
  checkedAt: Date
) => {
  await db
    .insert(directoryLinkChecks)
    .values({ directorySlug, ...result, checkedAt })
}
