"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HeaderLogo } from "@/components/layout/header-logo"
import { LeftSidebar } from "@/components/shared/left-sidebar"

export const MobileNav = () => {
  const [open, setOpen] = useState(false)

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
      <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
        <SheetHeader className="border-b border-dashed border-border px-6 py-4 text-left">
          <SheetTitle>
            <HeaderLogo />
          </SheetTitle>
        </SheetHeader>
        <div className="p-2" onClick={() => setOpen(false)}>
          <LeftSidebar />
        </div>
      </SheetContent>
    </Sheet>
  )
}
