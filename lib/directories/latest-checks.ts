import { getLatestDirectoryChecks } from "@/db/queries/directories"
import type { DirectoryCheck } from "@/types/directory"

// The table may not exist yet while a deploy prerenders these pages, so a failed read
// renders "not checked yet" instead of failing the build.
export const loadLatestDirectoryChecks = () =>
  getLatestDirectoryChecks().catch(() => new Map<string, DirectoryCheck>())
