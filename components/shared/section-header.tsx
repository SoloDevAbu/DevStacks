import Link from "next/link"
import { ROUTES } from "@/constants/routes"

export const SectionHeader = ({
  title,
  subtitle,
  viewAllText,
  viewAllHref = ROUTES.PRODUCTS,
}: {
  title: string
  subtitle: string
  viewAllText: string
  viewAllHref?: string
}) => {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
      <Link
        href={viewAllHref}
        className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        {viewAllText} <span className="text-slate-400">→</span>
      </Link>
    </div>
  )
}
