import { cn } from "@/lib/utils"
import { STATUS_BADGE_VARIANTS } from "@/constants/admin"

export const adminPageContainer =
  "relative flex min-h-screen flex-col bg-slate-50/50"

export const adminHeaderWrapper =
  "relative flex flex-col justify-between border-b border-dashed border-border bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-6 py-6 md:px-8"

export const adminHeaderTitle =
  "text-xl font-bold tracking-tight text-white md:text-2xl flex items-center gap-2.5"

export const adminHeaderSubtitle =
  "text-xs text-slate-400 md:text-sm max-w-2xl leading-relaxed mt-1"

export const adminStatsGrid =
  "grid w-full grid-cols-2 border-b border-dashed border-border bg-white sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-dashed divide-border"

export const adminStatCell = (active: boolean) =>
  cn(
    "flex flex-col justify-between gap-2 p-5 sm:p-6 transition-all cursor-pointer text-left select-none",
    active
      ? "bg-slate-100/90 ring-2 ring-inset ring-slate-900"
      : "hover:bg-slate-50/80 bg-white"
  )

export const adminStatLabel =
  "font-mono text-[11px] font-bold tracking-wider uppercase text-slate-500 flex items-center justify-between"

export const adminStatValue =
  "font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"

export const adminStatSub =
  "text-[11px] text-slate-400 font-medium"

export const adminFilterBar =
  "flex flex-col gap-3.5 border-b border-dashed border-border bg-white px-6 py-3.5 lg:flex-row lg:items-center lg:justify-between md:px-8"

export const adminSearchWrapper =
  "relative flex flex-1 max-w-md items-center"

export const adminFilterGroup =
  "flex flex-wrap items-center gap-2"

export const adminSubmissionList =
  "flex flex-col divide-y divide-dashed divide-border bg-white"

export const adminSubmissionCard = (selected: boolean) =>
  cn(
    "group relative flex flex-col gap-4 p-5 sm:p-6 transition-all",
    selected
      ? "bg-indigo-50/30"
      : "bg-white hover:bg-slate-50/40"
  )

export const adminBulkBar =
  "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/95 px-5 py-2.5 text-white shadow-2xl backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-5 duration-200"

export const adminItemTypeBadge = (type: "tool" | "product") =>
  cn(
    "font-mono text-[10px] font-bold uppercase rounded-md border px-2 py-0.5 inline-flex items-center gap-1",
    type === "tool"
      ? "border-sky-300 bg-sky-50 text-sky-800"
      : "border-violet-300 bg-violet-50 text-violet-800"
  )

export const adminStatusBadge = (status: "pending" | "approved" | "rejected") =>
  cn(
    "font-mono text-[10px] font-bold uppercase rounded-md border px-2 py-0.5 inline-flex items-center gap-1",
    STATUS_BADGE_VARIANTS[status] || "border-slate-300 bg-slate-50 text-slate-800"
  )

export const adminEmptyContainer =
  "flex flex-col items-center justify-center border-b border-dashed border-border bg-white px-6 py-20 text-center md:px-8"

export const adminActionRow =
  "flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-slate-100"
