import { Fragment } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  name: string
  href?: string
}

export const PageBreadcrumb = ({
  items,
}: {
  items: readonly BreadcrumbItem[]
}) => (
  <nav
    aria-label="Breadcrumb"
    className="border-b border-dashed border-border bg-white px-6 py-3 text-xs font-medium text-slate-500 md:px-8"
  >
    <ol className="flex flex-wrap items-center gap-2">
      {items.map(({ name, href }, index) => (
        <Fragment key={name}>
          {index > 0 && (
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
          )}
          <li className="flex items-center">
            {href ? (
              <Link href={href} className="hover:text-slate-900">
                {name}
              </Link>
            ) : (
              <span
                className="font-semibold text-slate-900"
                aria-current="page"
              >
                {name}
              </span>
            )}
          </li>
        </Fragment>
      ))}
    </ol>
  </nav>
)
