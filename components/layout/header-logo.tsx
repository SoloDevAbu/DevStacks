import { Blocks } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

export const HeaderLogo = () => {
  return (
    <Link
      href={ROUTES.HOME}
      className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900 transition-colors"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-xs ring-1 ring-slate-800/80 transition-transform group-hover:scale-105">
        <Blocks className="size-4.5 text-indigo-300" />
      </div>
      <span className="flex items-center gap-1.5">
        <span>{SITE_CONFIG.name}</span>
      </span>
    </Link>
  )
}
