import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckOutcomeBadge } from "@/components/directories/check-outcome-badge"
import { DIRECTORY_COPY, LINK_PATH } from "@/constants/directories"
import { ROUTES } from "@/constants/routes"
import type { DirectoryCheck, LaunchDirectory } from "@/types/directory"
import { comparisonTableCard } from "@/utils/styles"

const COLUMNS = [
  "Directory",
  "Free option",
  "Paid options",
  "Review time",
  "Measured link",
] as const

const MeasuredLink = ({
  directory,
  check,
}: {
  directory: LaunchDirectory
  check?: DirectoryCheck
}) => {
  if (!directory.sample) {
    return <span className="text-slate-500">{DIRECTORY_COPY.NOT_MEASURED}</span>
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <CheckOutcomeBadge check={check} />
      {check?.linkPath === LINK_PATH.REDIRECT && (
        <span className="text-[11px] text-slate-500">via redirect</span>
      )}
    </div>
  )
}

export const DirectoryTable = ({
  directories,
  checks,
}: {
  directories: readonly LaunchDirectory[]
  checks: ReadonlyMap<string, DirectoryCheck>
}) => (
  <div className={comparisonTableCard}>
    <Table containerClassName="overflow-x-auto" className="text-xs">
      <TableHeader className="bg-slate-50">
        <TableRow>
          {COLUMNS.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {directories.map((directory) => (
          <TableRow key={directory.slug}>
            <TableCell className="min-w-36 align-top font-semibold text-slate-900">
              <Link
                href={ROUTES.DIRECTORY(directory.slug)}
                className="hover:text-blue-600 hover:underline"
              >
                {directory.name}
              </Link>
            </TableCell>
            <TableCell className="min-w-48 align-top whitespace-normal text-slate-600">
              {directory.freeOption ?? DIRECTORY_COPY.NOT_STATED}
            </TableCell>
            <TableCell className="min-w-48 align-top whitespace-normal text-slate-600">
              {directory.paidOptions ?? DIRECTORY_COPY.NOT_STATED}
            </TableCell>
            <TableCell className="min-w-40 align-top whitespace-normal text-slate-600">
              {directory.reviewTime ?? DIRECTORY_COPY.NOT_STATED}
            </TableCell>
            <TableCell className="align-top">
              <MeasuredLink
                directory={directory}
                check={checks.get(directory.slug)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)
