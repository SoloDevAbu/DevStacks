import { cn } from "@/lib/utils"
import { TIER, type Tier } from "@/constants/plans"

export const dashboardPageContainer =
  "relative flex min-h-full flex-col bg-slate-50/50"

export const dashboardNavWrapper =
  "relative flex flex-col justify-between border-b border-dashed border-border bg-linear-to-b from-slate-50/80 via-white to-white"

export const dashboardNavTabsContainer =
  "relative z-10 mt-6 -mb-px flex w-full items-center overflow-x-auto overflow-y-hidden text-xs font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

export const dashboardNavTab = (isActive: boolean) =>
  cn(
    "flex flex-1 items-center justify-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-colors shrink-0 sm:shrink",
    isActive
      ? "border-slate-900 text-slate-900 font-bold"
      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50/40"
  )

export const dashboardHeaderTitle =
  "text-xl font-bold tracking-tight text-slate-900 md:text-2xl"

export const dashboardHeaderSubtitle =
  "text-xs text-slate-500 md:text-sm max-w-2xl leading-relaxed"

export const dashboardMetricsGrid =
  "grid w-full grid-cols-2 border-b border-dashed border-border bg-white lg:grid-cols-4 [&>*:nth-child(odd)]:border-r [&>*:nth-child(odd)]:border-dashed [&>*:nth-child(odd)]:border-border [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(-n+2)]:border-dashed [&>*:nth-child(-n+2)]:border-border lg:[&>*]:border-b-0 lg:[&>*]:border-r-0 lg:divide-x lg:divide-dashed lg:divide-border"

export const dashboardMetricCell =
  "flex flex-col justify-between gap-2.5 p-5 sm:p-6 transition-colors hover:bg-slate-50/60"

export const dashboardPortalsContainer =
  "flex flex-col divide-y divide-dashed divide-border border-b border-dashed border-border bg-white"

export const dashboardPortalItem =
  "flex flex-col justify-between gap-4 px-6 py-5.5 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center md:px-8 md:py-6"

export const dashboardRow =
  "flex flex-col gap-4 border-b border-dashed border-border bg-white px-6 py-5 transition-colors hover:bg-slate-50/30 md:px-8"

export const dashboardCard =
  "group relative rounded-xl border border-dashed border-border bg-white p-5 transition-all hover:border-slate-300 hover:shadow-2xs"

export const dashboardSectionHeader =
  "flex flex-col gap-3 border-b border-dashed border-border bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8"

export const dashboardSectionTitle =
  "flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-slate-800 uppercase"

export const dashboardEmptyContainer =
  "flex flex-col items-center justify-center border-b border-dashed border-border bg-white px-6 py-16 text-center md:px-8"

export const dashboardActionGroup = "flex flex-wrap items-center gap-2"

export const dashboardFilterBar =
  "flex flex-col gap-4 border-b border-dashed border-border bg-white px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between md:px-8"

export const dashboardFormSection =
  "flex flex-col gap-5 border-b border-dashed border-border bg-white px-6 py-6 md:px-8"

export const dashboardFormSectionTitle =
  "font-mono text-xs font-bold tracking-wider text-slate-900 uppercase"

export const dashboardFormSectionSubtitle =
  "text-xs text-slate-500 max-w-xl leading-relaxed"

export const upgradeTierCard = (isSelected: boolean, isCurrent: boolean) =>
  cn(
    "relative flex flex-col justify-between rounded-xl border p-5 text-left transition-all",
    isCurrent
      ? "border-slate-200 bg-slate-50/80 opacity-75 cursor-default"
      : isSelected
        ? "border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/20 cursor-pointer"
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 cursor-pointer"
  )

export const upgradeBadge = (tier: Tier) =>
  cn(
    "font-mono text-[10px] font-bold uppercase",
    tier === TIER.PREMIUM_PLUS
      ? "bg-amber-100 text-amber-800 border-amber-300"
      : tier === TIER.PREMIUM
        ? "bg-blue-100 text-blue-800 border-blue-300"
        : "bg-slate-100 text-slate-700 border-slate-200"
  )

export const analyticsStatBox =
  "flex flex-col justify-between gap-1 rounded-xl border border-dashed border-border bg-white p-4.5 shadow-2xs"

export const analyticsTabTrigger = (isActive: boolean) =>
  cn(
    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
    isActive
      ? "bg-slate-900 text-white shadow-xs"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  )

export const visitorItemRow =
  "flex items-center justify-between gap-3 border-b border-dashed border-border bg-white px-6 py-3.5 transition-colors hover:bg-slate-50/50 md:px-8"
