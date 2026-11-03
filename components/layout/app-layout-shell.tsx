"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
// The sidebars and footer are rendered on the server by the root layout and passed in as slots,
// so only the route check below ships as client code.
interface AppLayoutShellProps {
  children: React.ReactNode
  left: React.ReactNode
  right: React.ReactNode
  footer: React.ReactNode
}

/**
 * Returns true if the current path should render as a standalone
 * full-width page without left or right sidebars.
 */
export const isStandaloneComparisonRoute = (pathname: string): boolean => {
  if (!pathname) return false
  return (
    pathname === "/producthunt-alternative" ||
    pathname.endsWith("-alternative") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/blog/") ||
    pathname === "/pricing" ||
    pathname.startsWith("/pricing/")
  )
}

export const AppLayoutShell = ({
  children,
  left,
  right,
  footer,
}: AppLayoutShellProps) => {
  const pathname = usePathname()
  const isFullWidth = isStandaloneComparisonRoute(pathname)

  if (isFullWidth) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full flex-1 flex-col justify-between bg-white">
        <main className="w-full flex-1">{children}</main>
        {footer}
      </div>
    )
  }

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_380px]">
      {/* Bottom Left (Sidebar) */}
      <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] flex-col overflow-hidden border-r border-dashed border-border bg-white lg:flex">
        {left}
      </aside>

      {/* Bottom Center (Main) */}
      <main className="relative flex min-h-[calc(100vh-64px)] min-w-0 flex-col justify-between bg-white">
        <div className="flex-1">{children}</div>
        {footer}
      </main>

      {/* Bottom Right (Sidebar) */}
      <aside className="sticky top-16 hidden h-[calc(100vh-64px)] scrollbar-thin flex-col overflow-y-auto border-l border-dashed border-border bg-white xl:flex">
        {right}
      </aside>
    </div>
  )
}
