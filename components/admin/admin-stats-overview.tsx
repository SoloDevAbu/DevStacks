"use client"

import { Clock, CheckCircle2, XCircle, Layers } from "lucide-react"
import {
  adminStatsGrid,
  adminStatCell,
  adminStatLabel,
  adminStatValue,
  adminStatSub,
} from "@/utils/styles"
import type { AdminSubmissionsStats } from "@/db/queries/admin/submissions"
import type { AdminStatusFilter } from "@/constants/admin"

export type AdminStatsOverviewProps = {
  stats: AdminSubmissionsStats
  activeFilter: AdminStatusFilter
  onSelectFilter: (filter: AdminStatusFilter) => void
}

export const AdminStatsOverview = ({
  stats,
  activeFilter,
  onSelectFilter,
}: AdminStatsOverviewProps) => {
  return (
    <div className={adminStatsGrid}>
      <button
        type="button"
        onClick={() => onSelectFilter("pending")}
        className={adminStatCell(activeFilter === "pending")}
      >
        <span className={adminStatLabel}>
          <span>Pending Review</span>
          <Clock className="size-4 text-amber-500" />
        </span>
        <span className={`${adminStatValue} text-amber-600`}>
          {stats.totalPending}
        </span>
        <span className={adminStatSub}>
          {stats.toolsPending} tools · {stats.productsPending} products
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectFilter("approved")}
        className={adminStatCell(activeFilter === "approved")}
      >
        <span className={adminStatLabel}>
          <span>Approved Listings</span>
          <CheckCircle2 className="size-4 text-emerald-500" />
        </span>
        <span className={`${adminStatValue} text-emerald-600`}>
          {stats.totalApproved}
        </span>
        <span className={adminStatSub}>Live on public directory</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectFilter("rejected")}
        className={adminStatCell(activeFilter === "rejected")}
      >
        <span className={adminStatLabel}>
          <span>Rejected Items</span>
          <XCircle className="size-4 text-rose-500" />
        </span>
        <span className={`${adminStatValue} text-rose-600`}>
          {stats.totalRejected}
        </span>
        <span className={adminStatSub}>Hidden from directory</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectFilter("all")}
        className={adminStatCell(activeFilter === "all")}
      >
        <span className={adminStatLabel}>
          <span>Total Database</span>
          <Layers className="size-4 text-indigo-500" />
        </span>
        <span className={adminStatValue}>{stats.totalAll}</span>
        <span className={adminStatSub}>All submitted records</span>
      </button>
    </div>
  )
}
