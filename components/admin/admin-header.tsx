"use client"

import Link from "next/link"
import { ShieldCheck, ArrowLeft, LayoutDashboard, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/routes"
import {
  adminHeaderWrapper,
  adminHeaderTitle,
  adminHeaderSubtitle,
} from "@/utils/styles"

export type AdminHeaderProps = {
  adminEmail?: string | null
  onRefresh?: () => void
  isRefreshing?: boolean
}

export const AdminHeader = ({
  adminEmail,
  onRefresh,
  isRefreshing,
}: AdminHeaderProps) => {
  return (
    <div className={adminHeaderWrapper}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={adminHeaderTitle}>
              <ShieldCheck className="size-6 text-emerald-400" />
              Submissions Moderation Portal
            </h1>
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-[10px] uppercase tracking-wider"
            >
              Admin Mode
            </Badge>
          </div>
          <p className={adminHeaderSubtitle}>
            Moderate pending tools & products submissions, inspect maker
            payloads, approve or reject listings, and edit live metadata without
            touching the database directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {adminEmail ? (
            <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-slate-400">
                {adminEmail}
              </span>
            </div>
          ) : null}

          {onRefresh ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-slate-700 bg-slate-800/80 text-xs text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <RefreshCw
                className={`size-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Sync
            </Button>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={ROUTES.DASHBOARD} />}
            className="border-slate-700 bg-slate-800/80 text-xs text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            <LayoutDashboard className="size-3.5 mr-1.5" />
            Dashboard
          </Button>

          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={ROUTES.HOME} />}
            className="border-slate-700 bg-slate-800/80 text-xs text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="size-3.5 mr-1.5" />
            Live Directory
          </Button>
        </div>
      </div>
    </div>
  )
}
