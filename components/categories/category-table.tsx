import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"

export interface CategoryTableItem {
  id: string
  name: string
  slug: string
  count: number
}

interface CategoryTableProps {
  type: "tools" | "products"
  categories: CategoryTableItem[]
}

export const CategoryTable = ({ type, categories }: CategoryTableProps) => {
  const itemLabel = type === "tools" ? "tools" : "products"
  const singularLabel = type === "tools" ? "tool" : "product"
  const hoverColor =
    type === "tools"
      ? "group-hover:text-indigo-600"
      : "group-hover:text-violet-600"

  if (categories.length === 0) {
    return (
      <div className="flex w-full items-center justify-center border-b border-dashed border-border bg-white px-6 py-16 text-center text-xs text-slate-500">
        No categories cataloged yet.
      </div>
    )
  }

  return (
    <nav
      aria-label={`${type === "tools" ? "Developer Tool" : "Software Product"} Categories`}
      className="grid w-full grid-cols-1 bg-white md:grid-cols-2"
    >
      {categories.map((cat, idx) => {
        const href =
          type === "tools"
            ? ROUTES.TOOL_CATEGORY(cat.slug)
            : ROUTES.PRODUCT_CATEGORY(cat.slug)
        const isOdd = idx % 2 === 1

        return (
          <Link
            key={cat.id}
            href={href}
            className={cn(
              "group flex items-center justify-between border-b border-dashed border-border px-6 py-4.5 transition-colors hover:bg-slate-50/80 md:px-8",
              !isOdd && "md:border-r md:border-dashed md:border-border"
            )}
          >
            <span
              className={cn(
                "text-sm font-semibold text-slate-900 transition-colors",
                hoverColor
              )}
            >
              {cat.name}
            </span>

            <span className="font-mono text-xs text-slate-500">
              <strong className="font-semibold text-slate-800">
                {cat.count}
              </strong>{" "}
              <span>{cat.count === 1 ? singularLabel : itemLabel}</span>
            </span>
          </Link>
        )
      })}

      {categories.length % 2 === 1 && (
        <div className="hidden border-b border-dashed border-border md:block" />
      )}
    </nav>
  )
}
