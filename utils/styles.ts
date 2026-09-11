import { cn } from "@/lib/utils"
import {
  TIER,
  PRICING_COLORS,
  type Tier,
  type Pricing,
} from "@/constants/plans"

export const tierCardBg = (tier: Tier) =>
  cn(
    tier === TIER.FREE
      ? "hover:bg-slate-50/50"
      : tier === TIER.PREMIUM
        ? "bg-blue-50/50 hover:bg-blue-100/50"
        : "bg-amber-50/50 hover:bg-amber-100/50"
  )

export const tierContentBg = (tier: Tier) =>
  tier === TIER.FREE ? "bg-white/50" : "bg-transparent"

export const tierShimmerGradient = (tier: Tier) =>
  tier === TIER.PREMIUM
    ? "bg-[linear-gradient(110deg,transparent_35%,rgba(219,234,254,0.6)_50%,transparent_65%)]"
    : "bg-[linear-gradient(110deg,transparent_35%,rgba(254,243,199,0.6)_50%,transparent_65%)]"

export const pricingBadgeColor = (pricing: Pricing) => PRICING_COLORS[pricing]

export const medalBadge = (rank: number) =>
  cn(
    "flex items-center justify-center font-bold transition-transform group-hover:scale-105",
    rank === 1
      ? "size-6.5 rounded-full bg-linear-to-b from-amber-300 via-amber-400 to-yellow-500 text-xs text-amber-950 shadow-xs ring-1 ring-amber-400/80"
      : rank === 2
        ? "size-6.5 rounded-full bg-linear-to-b from-slate-100 via-slate-200 to-slate-400 text-xs text-slate-800 shadow-xs ring-1 ring-slate-300"
        : rank === 3
          ? "size-6.5 rounded-full bg-linear-to-b from-amber-600 via-orange-600 to-orange-700 text-xs text-white shadow-xs ring-1 ring-orange-500/80"
          : "w-5 text-center text-xs font-semibold text-slate-400"
  )

export const directoryCard =
  "group relative z-0 cursor-pointer rounded-none p-0 transition-colors"

export const directoryCardContent =
  "relative flex items-center gap-4 overflow-hidden px-6 py-5 backdrop-blur-sm md:gap-6"

export const tagBadge =
  "inline-flex items-center rounded-md border border-slate-200/60 bg-slate-100/50 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors"

export const externalVisitButton =
  "relative z-10 h-8 gap-1 rounded-lg border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"

export const sectionHeaderWrapper =
  "flex items-center justify-between border-b border-dashed border-border bg-white px-6 py-4 md:px-8"

export const sectionGridWrapper =
  "grid grid-cols-1 gap-4 border-b border-dashed border-border px-6 py-6 md:px-8"

export const sectionWrapper =
  "border-b border-dashed border-border px-6 py-8 md:px-8"

export const upvoteButtonActive =
  "relative z-10 h-8 gap-1.5 rounded-lg border-amber-300 bg-amber-50 px-3 text-sm font-bold text-amber-600 hover:bg-amber-100/80 transition-colors"

export const upvoteButtonInactive =
  "relative z-10 h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"

export const bookmarkButtonActive =
  "relative z-10 size-8 rounded-lg border-indigo-300 bg-indigo-50 p-0 text-indigo-600 hover:bg-indigo-100/80 transition-colors"

export const bookmarkButtonInactive =
  "relative z-10 size-8 rounded-lg border-slate-200 bg-white p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"

export const discoveryCard =
  "group flex flex-col rounded-none bg-white transition-colors hover:border-slate-300"

export const freshBadge =
  "inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 border border-amber-200/60 uppercase"

export const momentumBadge =
  "inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 border border-emerald-200/60 uppercase"

export const filterPillActive =
  "bg-indigo-50 font-semibold text-indigo-600 hover:text-indigo-700"

export const filterPillInactive =
  "font-medium text-slate-600 hover:text-slate-900"

export const infiniteScrollLoader =
  "flex items-center justify-center gap-2 py-8 text-center text-xs font-medium text-slate-500"

export const infiniteScrollEndMessage =
  "py-8 text-center text-xs font-medium text-slate-400 border-t border-dashed border-border"

export const agentFooterWrapper =
  "border-t border-dashed border-border bg-amber-50/20 px-6 py-4 text-xs md:px-8"

export const agentFooterLabel =
  "font-mono text-xs font-bold tracking-widest text-[#a06138] uppercase"

export const agentFooterLink =
  "font-mono text-xs text-slate-600 hover:text-slate-900 transition-colors underline-offset-2 hover:underline"

export const agentFooterDot = "text-slate-300 select-none"

export const toolBuildsBadge =
  "inline-flex items-center gap-1 rounded-md border border-blue-200/80 bg-blue-50/80 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-100/80 transition-colors"

export const toolViewsPill =
  "inline-flex items-center gap-1 text-xs font-medium text-slate-400"

export const toolHeroBadge =
  "inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-[11px] font-semibold text-indigo-700 backdrop-blur-xs"

export const toolHeroStatPill =
  "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs backdrop-blur-xs"

export const heroStatPill = toolHeroStatPill

export const toolFilterButton =
  "relative z-10 h-7.5 gap-1.5 rounded-lg px-2.5 text-xs transition-colors"

export const sidebarHeading =
  "font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase"

export const sidebarNavItem =
  "group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all"

export const sidebarNavItemActive =
  "bg-slate-100 text-slate-900 font-semibold border border-slate-200/80 shadow-2xs"


export const sidebarNavItemInactive =
  "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950"

export const sidebarBadgeHot =
  "rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-700 border border-amber-500/20"

export const sidebarBadgeNew =
  "rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700 border border-emerald-500/20"

export const sidebarBadgeNeutral =
  "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 border border-slate-200"

export const quickStackChip =
  "inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"

export const quickStackChipActive =
  "border-indigo-200 bg-indigo-50 font-semibold text-indigo-700"

export const spotlightCard =
  "group relative rounded-xl border border-dashed border-border bg-linear-to-b from-slate-50/60 via-white to-white p-4 transition-all hover:border-slate-300 hover:shadow-2xs"

export const sponsorCard =
  "relative overflow-hidden rounded-xl border border-dashed border-indigo-200/80 bg-linear-to-br from-indigo-50/50 via-white to-violet-50/40 p-4 transition-all hover:border-indigo-300 hover:shadow-2xs"

export const trendingDevtoolRow =
  "group flex items-center justify-between gap-3 rounded-lg border border-transparent p-2 transition-all hover:border-slate-200/80 hover:bg-slate-50"

export const navbarSearchWrapper =
  "relative flex w-full max-w-sm items-center transition-all"

export const navbarSearchInput =
  "h-9 w-full rounded-lg border border-dashed border-slate-200 bg-slate-50/70 pr-12 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-0 shadow-2xs transition-all"

export const navbarNavLink =
  "shrink-0 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-950"

export const navbarNavLinkActive =
  "text-slate-950 font-bold"

export const siteFooterWrapper =
  "border-t border-dashed border-border bg-slate-50/40"

export const siteFooterGrid =
  "grid grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 md:grid-cols-4 md:px-8 md:py-12 lg:grid-cols-5"

export const siteFooterColHeading =
  "font-mono text-xs font-bold tracking-wider text-slate-900 uppercase"

export const siteFooterLink =
  "text-xs text-slate-600 hover:text-slate-950 transition-colors"

export const agentProtocolTray =
  "flex flex-wrap items-center gap-x-2.5 gap-y-2 border-t border-dashed border-border bg-amber-50/40 px-6 py-5 font-mono text-xs text-slate-700 md:px-8 md:py-6"

export const siteFooterBottomStrip =
  "flex flex-col items-start justify-between gap-2.5 border-t border-dashed border-border bg-white px-6 pt-6 pb-12 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:gap-4 md:px-8 md:pt-8 md:pb-14"

export const footerAiSection =
  "flex flex-col gap-3 border-b border-dashed border-border px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-8"

export const footerAiTrayLabel =
  "font-mono text-xs font-bold tracking-wider text-slate-700 uppercase"

export const footerAiButton =
  "relative z-10 flex items-center justify-center gap-1.5 rounded-md border border-slate-200/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-2xs"

