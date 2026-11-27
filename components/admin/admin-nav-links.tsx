"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ADMIN_NAV } from "@/constants/admin"
import { ROUTES } from "@/constants/routes"
import type { AdminPendingCounts } from "@/db/queries/admin/overview"
import {
  sidebarHeading,
  sidebarNavItem,
  sidebarNavItemActive,
  sidebarNavItemInactive,
  sidebarNavSection,
} from "@/utils/styles"
import { adminSidebarCount } from "@/utils/admin/styles"

const isActiveHref = (pathname: string, href: string) =>
  href === ROUTES.ADMIN ? pathname === href : pathname.startsWith(href)

export const AdminNavLinks = ({
  counts,
  onNavigate,
}: {
  counts: AdminPendingCounts
  onNavigate?: () => void
}) => {
  const pathname = usePathname()

  return (
    <>
      {ADMIN_NAV.map((section) => (
        <div key={section.label} className={sidebarNavSection}>
          <p className={sidebarHeading}>{section.label}</p>
          <nav aria-label={section.label} className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const count = item.countKey ? counts[item.countKey] : 0
              const isActive = isActiveHref(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    sidebarNavItem,
                    isActive ? sidebarNavItemActive : sidebarNavItemInactive
                  )}
                >
                  <span>{item.label}</span>
                  {count > 0 && <span className={adminSidebarCount}>{count}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      ))}
    </>
  )
}
