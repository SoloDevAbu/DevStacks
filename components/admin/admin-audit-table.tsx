import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminAuditRow } from "@/db/queries/admin/audit"
import { formatAdminDateTime } from "@/utils/admin/format"
import { adminCellMeta, adminEmptyState } from "@/utils/admin/styles"

const describeMetadata = (metadata: Record<string, unknown> | null) => {
  if (!metadata) return ""
  const name = typeof metadata.name === "string" ? metadata.name : null
  const note = typeof metadata.reviewNote === "string" ? metadata.reviewNote : null
  const change =
    typeof metadata.from === "string" && typeof metadata.to === "string"
      ? `${metadata.from} → ${metadata.to}`
      : null
  return [name, change, note && `“${note}”`].filter(Boolean).join(" · ")
}

export const AdminAuditTable = ({ rows }: { rows: AdminAuditRow[] }) => {
  if (rows.length === 0) {
    return <p className={adminEmptyState}>No admin actions recorded yet.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          <TableHead>Admin</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className={adminCellMeta}>{formatAdminDateTime(row.createdAt)}</TableCell>
            <TableCell>{row.adminEmail}</TableCell>
            <TableCell className="font-mono">{row.action}</TableCell>
            <TableCell className={adminCellMeta}>
              {row.targetType} · {row.targetId.slice(0, 8)}
            </TableCell>
            <TableCell className="max-w-md truncate">{describeMetadata(row.metadata)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
