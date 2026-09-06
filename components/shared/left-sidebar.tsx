"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SIDEBAR_NAV } from "@/constants/navigation"
import { ROUTES } from "@/constants/routes"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"

export const LeftSidebar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { openAuthModal } = useAuthModal()

  return (
    <div className="flex flex-col gap-8 p-8 xl:p-10">
      {SIDEBAR_NAV.map((section) => (
        <div key={section.label} className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {section.label}
          </h3>
          <nav className="mt-2 flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== ROUTES.HOME && pathname.startsWith(item.href)) ||
                (item.href === ROUTES.TOOLS &&
                  (pathname === "/tool" || pathname.startsWith("/tool/"))) ||
                (item.href === ROUTES.PRODUCTS &&
                  (pathname === "/product" || pathname.startsWith("/product/")))

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
                      "flex w-full items-center gap-3 py-1.5 transition-colors hover:text-foreground text-left cursor-pointer",
                      isActive && "text-foreground font-semibold"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.name}
                  </button>
                )
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 py-1.5 transition-colors hover:text-foreground",
                    isActive && "text-foreground font-semibold"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      ))}
    </div>
  )
}
