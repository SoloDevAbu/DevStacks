"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SIDEBAR_NAV,
  QUICK_STACKS,
  type NavItemBadge,
} from "@/constants/navigation"
import { ROUTES } from "@/constants/routes"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import {
  sidebarHeading,
  sidebarNavItem,
  sidebarNavItemActive,
  sidebarNavItemInactive,
  sidebarBadgeHot,
  sidebarBadgeNew,
  sidebarBadgeNeutral,
  quickStackChip,
  quickStackChipActive,
} from "@/utils/styles"

const renderBadge = (badge?: NavItemBadge) => {
  if (!badge) return null
  const badgeClass =
    badge.variant === "hot"
      ? sidebarBadgeHot
      : badge.variant === "new"
        ? sidebarBadgeNew
        : sidebarBadgeNeutral
  return <span className={badgeClass}>{badge.text}</span>
}

export const LeftSidebar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { openAuthModal } = useAuthModal()

  return (
    <div className="flex h-full flex-col justify-between p-6 xl:p-7">
      <div className="flex flex-col gap-7">
        {SIDEBAR_NAV.map((section) => (
          <div key={section.label} className="flex flex-col gap-2">
            <h3 className={sidebarHeading}>{section.label}</h3>
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== ROUTES.HOME && pathname.startsWith(item.href))

                const requiresAuth = item.href === ROUTES.SHOWCASE

                if (requiresAuth && !session?.user) {
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() =>
                        openAuthModal({
                          defaultTab: "signup",
                          redirectTo: item.href,
                          title: "Sign in with Google",
                          description:
                            "Sign in with your Google account to showcase your projects to the developer community.",
                        })
                      }
                      className={cn(
                        sidebarNavItem,
                        isActive ? sidebarNavItemActive : sidebarNavItemInactive
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <item.icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            isActive
                              ? "text-slate-900"
                              : "text-slate-400 group-hover:text-slate-700"
                          )}
                        />
                        <span>{item.name}</span>
                      </span>
                      {renderBadge(item.badge)}
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      sidebarNavItem,
                      isActive ? sidebarNavItemActive : sidebarNavItemInactive
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          isActive
                            ? "text-slate-900"
                            : "text-slate-400 group-hover:text-slate-700"
                        )}
                      />
                      <span>{item.name}</span>
                    </span>
                    {renderBadge(item.badge)}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}

        {/* Popular Stacks Quick-Filter */}
        <div className="flex flex-col gap-2.5 pt-2">
          <h3 className={sidebarHeading}>Popular Stacks</h3>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_STACKS.map((stack) => {
              const isStackActive = pathname.includes(
                encodeURIComponent(stack.name)
              )
              return (
                <Link
                  key={stack.name}
                  href={stack.href}
                  className={cn(
                    quickStackChip,
                    isStackActive && quickStackChipActive
                  )}
                >
                  {stack.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Ecosystem Promo & Status */}
      <div className="mt-8 flex flex-col gap-4 border-t border-dashed border-border pt-6">
        <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-linear-to-b from-slate-50/90 to-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="size-3.5" />
            </div>
            <span className="rounded-md border border-indigo-200/80 bg-indigo-50/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700">
              FREE
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-slate-900">
            Launch Your Product
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Join 500+ tools and showcase your stack to modern builders.
          </p>
          <Link
            href={ROUTES.SUBMIT}
            className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Submit Tool
            <ArrowUpRight className="size-3" />
          </Link>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center justify-between px-1 font-mono text-[11px] text-slate-400 select-none">
          <span className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-slate-600">Ecosystem Online</span>
          </span>
          <span>v1.0</span>
        </div>
      </div>
    </div>
  )
}
