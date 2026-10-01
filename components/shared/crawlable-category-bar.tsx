import Link from "next/link"
import { Layers } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import type { DbCategoryItem } from "@/db/queries/categories/list"

interface CrawlableCategoryBarProps {
  type: "tools" | "products"
  categories: DbCategoryItem[]
  activeCategory?: string
  className?: string
}

export const CrawlableCategoryBar = ({
  type,
  categories,
  activeCategory,
  className,
}: CrawlableCategoryBarProps) => {
  const basePath = type === "tools" ? ROUTES.TOOLS : ROUTES.PRODUCTS
  const isAllActive = !activeCategory || activeCategory.toLowerCase() === "all"

  return (
    <nav
      aria-label={`${type === "tools" ? "Tool" : "Product"} categories`}
      className={cn(
        "flex w-full scrollbar-none items-center gap-2 overflow-x-auto border-b border-dashed border-border bg-slate-50/60 px-6 py-2.5 md:px-8",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Layers className="size-3.5 text-slate-400" />
        <span className="hidden sm:inline">Browse:</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Link
          href={basePath}
          className={cn(
            "inline-flex shrink-0 items-center rounded-md border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all",
            isAllActive
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          All
        </Link>

        {categories.map((cat) => {
          const isActive =
            activeCategory?.toLowerCase() === cat.name.toLowerCase() ||
            activeCategory?.toLowerCase() === cat.slug.toLowerCase()

          return (
            <Link
              key={cat.id}
              href={`${basePath}?category=${encodeURIComponent(cat.name)}`}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all",
                isActive
                  ? "border-slate-900 bg-slate-900 font-semibold text-white"
                  : "border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span>{cat.name}</span>
              <span
                className={cn(
                  "py-0.2 rounded px-1 font-mono text-[10px]",
                  isActive
                    ? "bg-slate-800 text-slate-200"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {cat.count}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
