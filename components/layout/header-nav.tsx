"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GlobalSearchCommand } from "@/components/shared/global-search-command"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { navbarNavLink, navbarNavLinkActive } from "@/utils/styles"

export const HeaderNav = () => {
  const pathname = usePathname()
  const isPricingActive = pathname === ROUTES.PRICING

  return (
    <nav className="flex items-center gap-6">
      <GlobalSearchCommand />

      <Link
        href={ROUTES.PRICING}
        className={cn(
          navbarNavLink,
          isPricingActive && navbarNavLinkActive
        )}
      >
        Pricing
      </Link>
    </nav>
  )
}

