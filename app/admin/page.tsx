import type { Metadata } from "next"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminOverview } from "@/db/queries/admin/overview"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminAuditTable } from "@/components/admin/admin-audit-table"
import { ROUTES } from "@/constants/routes"
import { formatCents } from "@/utils/admin/format"
import {
  adminSection,
  adminSectionHeader,
  adminStatCell,
  adminStatGrid,
  adminStatValue,
} from "@/utils/admin/styles"
import { inlineTextLink, monoLabel, mutedText } from "@/utils/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Overview" }

export default async function AdminOverviewPage() {
  await requireAdmin()
  const overview = await getAdminOverview()

  const stats = [
    {
      label: "Pending submissions",
      value: overview.pending.submissions,
      href: ROUTES.ADMIN_SUBMISSIONS,
    },
    { label: "Pending edits", value: overview.pending.edits, href: ROUTES.ADMIN_EDITS },
    {
      label: `Free slots · W${overview.week.isoWeek}`,
      value: `${overview.week.freeSlotsUsed}/${overview.week.freeSlotsTotal}`,
      href: ROUTES.ADMIN_LAUNCHES,
    },
    {
      label: "Revenue this month",
      value: formatCents(overview.revenueMonth),
      meta: `${formatCents(overview.revenueWeek)} this week`,
      href: ROUTES.ADMIN_PAYMENTS,
    },
  ]

  return (
    <>
      <AdminPageHeader title="Overview" description="What needs attention right now." />
      <div className={adminStatGrid}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className={adminStatCell}>
            <span className={monoLabel}>{stat.label}</span>
            <span className={adminStatValue}>{stat.value}</span>
            {stat.meta && <span className={mutedText}>{stat.meta}</span>}
          </Link>
        ))}
      </div>
      <section className={adminSection}>
        <div className={adminSectionHeader}>
          <h2 className={monoLabel}>Recent admin activity</h2>
          <Link href={ROUTES.ADMIN_AUDIT} className={inlineTextLink}>
            Full audit log →
          </Link>
        </div>
        <AdminAuditTable rows={overview.recentAudit} />
      </section>
    </>
  )
}
