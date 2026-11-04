import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { sectionHeaderWrapper, sectionHeaderCtaButton } from "@/utils/styles"

interface SectionHeaderProps {
  title: string
  viewAllText?: string
  viewAllHref?: string
  action?: React.ReactNode
  className?: string
}

export const SectionHeader = ({
  title,
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
      </div>
      {action ? (
        action
      ) : viewAllText ? (
        <Link href={viewAllHref} className={sectionHeaderCtaButton}>
          {viewAllText} <span className="text-slate-400">→</span>
        </Link>
      ) : null}
    </div>
  )
}
