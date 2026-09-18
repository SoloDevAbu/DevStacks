import Image from "next/image"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

export const HeaderLogo = () => {
  return (
    <Link
      href={ROUTES.HOME}
      className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900 transition-colors"
    >
      <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-xs transition-transform group-hover:scale-105">
        <Image
          src="/favicon.png"
          alt={`${SITE_CONFIG.name} logo`}
          width={32}
          height={32}
          className="size-full object-contain"
          priority
        />
      </div>
      <span className="flex items-center gap-1.5">
        <span>{SITE_CONFIG.name}</span>
      </span>
    </Link>
  )
}
