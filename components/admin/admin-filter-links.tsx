import Link from "next/link"
import { cn } from "@/lib/utils"
import { buildPageHref } from "@/utils/pagination"
import {
  adminFilterGroup,
  adminFilterLink,
  adminFilterLinkActive,
  adminFilterLinkInactive,
} from "@/utils/admin/styles"

interface FilterOption {
  value: string
  label: string
}

// Filters are plain links so the server renders each view and the URL is shareable.
export const AdminFilterLinks = ({
  label,
  basePath,
  paramKey,
  options,
  current,
  params,
}: {
  label: string
  basePath: string
  paramKey: string
  options: readonly FilterOption[]
  current: string
  params: Record<string, string | undefined>
}) => (
  <nav aria-label={label} className={adminFilterGroup}>
    {options.map((option) => {
      const isActive = option.value === current
      return (
        <Link
          key={option.value}
          href={buildPageHref(basePath, 1, { ...params, [paramKey]: option.value })}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            adminFilterLink,
            isActive ? adminFilterLinkActive : adminFilterLinkInactive
          )}
        >
          {option.label}
        </Link>
      )
    })}
  </nav>
)
