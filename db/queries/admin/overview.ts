import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import { countFreeLaunchesBooked } from "@/db/queries/launches/availability"
import { countPendingSubmissions } from "@/db/queries/admin/submissions"
import { countPendingRevisions } from "@/db/queries/admin/revisions"
import { sumSucceededPaymentsSince } from "@/db/queries/admin/payments"
import { getAdminAuditLog } from "@/db/queries/admin/audit"
import { getISOWeek, getISOWeekRange } from "@/utils/iso-weeks"

const RECENT_AUDIT_ENTRIES = 8

export const getAdminPendingCounts = async () => {
  const [submissions, edits] = await Promise.all([
    countPendingSubmissions(),
    countPendingRevisions(),
  ])
  return { submissions, edits }
}

export type AdminPendingCounts = Awaited<ReturnType<typeof getAdminPendingCounts>>

export const getAdminOverview = async (now: Date = new Date()) => {
  const { isoYear, isoWeek } = getISOWeek(now)
  const { startDate: weekStart } = getISOWeekRange(isoYear, isoWeek)
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  const [pending, freeSlotsUsed, revenueWeek, revenueMonth, audit] =
    await Promise.all([
      getAdminPendingCounts(),
      countFreeLaunchesBooked(isoYear, isoWeek),
      sumSucceededPaymentsSince(weekStart),
      sumSucceededPaymentsSince(monthStart),
      getAdminAuditLog({ pageSize: RECENT_AUDIT_ENTRIES }),
    ])

  return {
    pending,
    week: { isoYear, isoWeek, freeSlotsUsed, freeSlotsTotal: MAX_FREE_LAUNCHES_PER_WEEK },
    revenueWeek,
    revenueMonth,
    recentAudit: audit.rows,
  }
}
