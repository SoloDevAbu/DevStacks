import { cn } from "@/lib/utils"
import { humanizeFieldName } from "@/utils/admin/format"
import {
  adminDiffAfter,
  adminDiffBefore,
  adminDiffCell,
  adminDiffGrid,
  adminEmptyState,
} from "@/utils/admin/styles"
import { monoLabel } from "@/utils/styles"

interface Faq {
  question: string
  answer: string
}

const isFaqList = (value: unknown): value is Faq[] =>
  Array.isArray(value) &&
  value.every((entry) => typeof entry === "object" && entry !== null && "question" in entry)

const toolName = (entry: unknown) =>
  typeof entry === "string" ? entry : ((entry as { name?: string })?.name ?? "")

// Values are normalised to text so "Before" and "After" compare like for like.
const formatDiffValue = (field: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—"
  if (isFaqList(value)) {
    return value.length
      ? value.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n")
      : "—"
  }
  if (field === "builtWithTools" && Array.isArray(value)) {
    return value.map(toolName).join(", ") || "—"
  }
  if (Array.isArray(value)) return value.join("\n") || "—"
  if (typeof value === "object") return JSON.stringify(value, null, 2)
  return String(value)
}

const LIVE_FIELD_ALIASES: Record<string, string> = { category: "categoryName" }

export const RevisionDiff = ({
  payload,
  live,
}: {
  payload: Record<string, unknown>
  live: Record<string, unknown>
}) => {
  const rows = Object.entries(payload)
    .map(([field, proposed]) => ({
      field,
      before: formatDiffValue(field, live[LIVE_FIELD_ALIASES[field] ?? field]),
      after: formatDiffValue(field, proposed),
    }))
    .filter((row) => row.before !== row.after)

  if (rows.length === 0) {
    return <p className={adminEmptyState}>The proposed values match the live listing.</p>
  }

  return (
    <div>
      <div className={cn(adminDiffGrid, "hidden md:grid")}>
        <span className={cn(adminDiffCell, monoLabel)}>Field</span>
        <span className={cn(adminDiffCell, monoLabel)}>Live</span>
        <span className={cn(adminDiffCell, monoLabel)}>Proposed</span>
      </div>
      {rows.map((row) => (
        <div key={row.field} className={adminDiffGrid}>
          <span className={cn(adminDiffCell, monoLabel)}>{humanizeFieldName(row.field)}</span>
          <span className={cn(adminDiffCell, adminDiffBefore)}>{row.before}</span>
          <span className={cn(adminDiffCell, adminDiffAfter)}>{row.after}</span>
        </div>
      ))}
    </div>
  )
}
