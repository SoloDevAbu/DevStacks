import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { sectionHeaderWrapper } from "@/utils/styles"

interface SectionHeaderProps {
  title: string
  subtitle: string
  viewAllText: string
  viewAllHref?: string
  className?: string
}

export const SectionHeader = ({
  title,
  subtitle,
  viewAllText,
  viewAllHref = ROUTES.PRODUCTS,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={cn(sectionHeaderWrapper, className)}>
      <div>
        <h2 className="text-base font-bold text-slate-900 md:text-lg">
          {title}
        </h2>
        <p className="text-xs font-medium text-slate-500 md:text-sm">
          {subtitle}
        </p>
      </div>
      <Link
        href={viewAllHref}
        className="flex items-center gap-1 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 md:text-sm"
      >
        {viewAllText} <span className="text-slate-400">→</span>
      </Link>
    </div>
  )
}
