import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminPendingCounts } from "@/db/queries/admin/overview"
import { AdminNavLinks } from "@/components/admin/admin-nav-links"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { SITE_CONFIG } from "@/constants/site"
import { adminMain, adminShell, adminSidebar } from "@/utils/admin/styles"
import { mutedText } from "@/utils/styles"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: { default: `Admin | ${SITE_CONFIG.name}`, template: `%s | Admin` },
  robots: { index: false, follow: false },
}

// Each page under this layout also calls requireAdmin(): layouts don't re-run on client
// navigation, so the layout check alone can't guard the pages.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  const counts = await getAdminPendingCounts()

  return (
    <div className={adminShell}>
      <aside className={adminSidebar}>
        <AdminNavLinks counts={counts} />
        <p className={cn(mutedText, "mt-auto truncate")}>{admin.email}</p>
      </aside>
      <div className={adminMain}>
        <AdminMobileNav counts={counts} />
        {children}
      </div>
    </div>
  )
}
