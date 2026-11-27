import { isValidElement, type ReactNode } from "react"
import { NOFOLLOW_LINK_REL } from "@/utils/urls"
import { humanizeFieldName } from "@/utils/admin/format"
import {
  adminFieldGrid,
  adminFieldLabel,
  adminFieldValue,
  adminSection,
  adminSectionHeader,
} from "@/utils/admin/styles"
import { inlineTextLink, monoLabel } from "@/utils/styles"

export interface AdminFieldRow {
  label?: string
  field?: string
  value: unknown
  isLink?: boolean
}

const isEmpty = (value: unknown) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0)

const renderValue = ({ value, isLink }: AdminFieldRow): ReactNode => {
  if (isValidElement(value)) return value
  const text = Array.isArray(value) ? value.join(", ") : String(value)
  if (isLink) {
    return (
      <a href={text} target="_blank" rel={NOFOLLOW_LINK_REL} className={inlineTextLink}>
        {text} ↗
      </a>
    )
  }
  return text
}

// Label/value rows for an admin detail page. Empty values are left out.
export const AdminFieldList = ({
  title,
  rows,
  embedded = false,
}: {
  title?: string
  rows: AdminFieldRow[]
  embedded?: boolean
}) => {
  const visible = rows.filter((row) => !isEmpty(row.value))
  const grid = (
    <dl className={adminFieldGrid}>
      {visible.map((row) => {
        const label = row.label ?? humanizeFieldName(row.field ?? "")
        return (
          <div key={label} className="contents">
            <dt className={adminFieldLabel}>
              <span className={monoLabel}>{label}</span>
            </dt>
            <dd className={adminFieldValue}>{renderValue(row)}</dd>
          </div>
        )
      })}
    </dl>
  )

  if (embedded) return grid
  if (visible.length === 0) return null

  return (
    <section className={adminSection}>
      <div className={adminSectionHeader}>
        <h2 className={monoLabel}>{title}</h2>
      </div>
      {grid}
    </section>
  )
}
