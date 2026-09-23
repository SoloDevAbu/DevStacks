import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { sectionHeaderWrapper } from "@/utils/styles"

interface SectionHeaderProps {
  title: string
  subtitle: string
  viewAllText?: string
  viewAllHref?: string
  action?: React.ReactNode
  className?: string
}

export const SectionHeader = ({
  title,
  subtitle,
  viewAllText,
  viewAllHref = ROUTES.PRODUCTS,
  action,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={cn(sectionHeaderWrapper, className)}>
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-bold text-slate-900 sm:text-base md:text-lg">
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] font-medium text-slate-500 sm:text-xs md:text-sm">
          {subtitle}
        </p>
      </div>
      {action ? (
        action
      ) : viewAllText ? (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 md:text-sm"
        >
          {viewAllText} <span className="text-slate-400">→</span>
        </Link>
      ) : null}
    </div>
  )
}
