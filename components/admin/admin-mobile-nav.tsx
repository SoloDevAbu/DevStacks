"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AdminNavLinks } from "@/components/admin/admin-nav-links"
import type { AdminPendingCounts } from "@/db/queries/admin/overview"
import { adminMobileBar } from "@/utils/admin/styles"
import { monoLabel } from "@/utils/styles"

export const AdminMobileNav = ({ counts }: { counts: AdminPendingCounts }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={adminMobileBar}>
      <span className={monoLabel}>Admin</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline" size="sm" />}>Menu</SheetTrigger>
        <SheetContent side="left" className="flex flex-col gap-5 p-5">
          <SheetHeader className="p-0">
            <SheetTitle>Admin</SheetTitle>
          </SheetHeader>
          <AdminNavLinks counts={counts} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
