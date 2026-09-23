import Image from "next/image"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { cn } from "@/lib/utils"

export interface HeaderLogoProps {
  showText?: boolean
  hideTextOnMobile?: boolean
  className?: string
}

export const HeaderLogo = ({
  showText = true,
  hideTextOnMobile = false,
  className,
}: HeaderLogoProps) => {
  return (
    <Link
      href={ROUTES.HOME}
      className={cn(
        "group flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900 transition-colors",
        className
      )}
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
      {showText && (
        <span
          className={cn(
            "flex items-center gap-1.5",
            hideTextOnMobile && "hidden sm:inline"
          )}
        >
          <span>{SITE_CONFIG.name}</span>
        </span>
      )}
    </Link>
  )
}
