"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HeaderLogo } from "@/components/layout/header-logo"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { useSearchCommand } from "@/hooks/shared/use-search-command"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import { ROUTES } from "@/constants/routes"

export const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const router = useRouter()
  const { openSearch } = useSearchCommand()
  const { requireAuth } = useAuthModal()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isPlatformMac =
        navigator.platform?.toUpperCase().indexOf("MAC") >= 0 ||
        navigator.userAgent?.toUpperCase().indexOf("MAC") >= 0
      setIsMac(isPlatformMac)
    }
  }, [])

  const handleSearchClick = () => {
    setOpen(false)
    openSearch()
  }

  const handleLaunchToolClick = () => {
    setOpen(false)
    requireAuth(() => router.push(ROUTES.SUBMIT), {
      redirectTo: ROUTES.SUBMIT,
      title: "Sign in with Google to add a tool",
      description:
        "Sign in with your Google account to list your developer tool, library, or API.",
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-slate-600 hover:text-slate-900 lg:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-75 flex-col overflow-y-auto p-0">
        <SheetHeader className="border-b border-dashed border-border px-6 py-4 text-left">
          <SheetTitle>
            <HeaderLogo showText={true} hideTextOnMobile={false} />
          </SheetTitle>
        </SheetHeader>

        {/* Search & Launch Tool on mobile sidebar */}
        <div className="flex flex-col gap-2.5 border-b border-dashed border-border px-6 py-4">
          <button
            type="button"
            onClick={handleSearchClick}
            className="group flex h-9 w-full items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 text-xs text-slate-500 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Search tools, APIs, products"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="size-3.5 shrink-0 text-slate-400 group-hover:text-slate-600" />
              <span className="truncate">Search tools, APIs, products...</span>
            </div>
            <Kbd className="shrink-0 border border-slate-200 bg-white px-1 font-mono text-[10px] text-slate-400 shadow-2xs">
              {isMac ? "⌘K" : "Ctrl+K"}
            </Kbd>
          </button>

          <Button
            className="h-9 w-full justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-[0.98]"
            onClick={handleLaunchToolClick}
          >
            <PlusCircle className="mr-1.5 size-3.5" />
            Launch Tool
          </Button>
        </div>

        <div className="flex-1 p-2" onClick={() => setOpen(false)}>
          <LeftSidebar />
        </div>
      </SheetContent>
    </Sheet>
  )
}
