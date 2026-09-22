import { cn } from "@/lib/utils"
import {
  TIER,
  PRICING_COLORS,
  type Tier,
  type Pricing,
} from "@/constants/plans"
import { ITEM_KIND, type ItemKind } from "@/constants/items"

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
  "border-b border-dashed border-border px-6 py-8 md:px-8 md:py-10"

export const DETAIL_SECTION_THEMES = {
  blue: {
    headerBg: "bg-linear-to-r from-blue-50/80 via-indigo-50/20 to-transparent",
    titleColor: "text-blue-700",
    subtitleColor: "text-blue-600/75",
    iconColor: "text-blue-600",
  },
  emerald: {
    headerBg: "bg-linear-to-r from-emerald-50/80 via-teal-50/20 to-transparent",
    titleColor: "text-emerald-700",
    subtitleColor: "text-emerald-600/75",
    iconColor: "text-emerald-600",
  },
  amber: {
    headerBg: "bg-linear-to-r from-amber-50/80 via-orange-50/20 to-transparent",
    titleColor: "text-amber-800",
    subtitleColor: "text-amber-700/75",
    iconColor: "text-amber-600",
  },
  orange: {
    headerBg: "bg-linear-to-r from-orange-50/80 via-amber-50/20 to-transparent",
    titleColor: "text-orange-700",
    subtitleColor: "text-orange-600/75",
    iconColor: "text-orange-600",
  },
  sky: {
    headerBg: "bg-linear-to-r from-sky-50/80 via-blue-50/20 to-transparent",
    titleColor: "text-sky-700",
    subtitleColor: "text-sky-600/75",
    iconColor: "text-sky-600",
  },
  violet: {
    headerBg:
      "bg-linear-to-r from-violet-50/80 via-purple-50/20 to-transparent",
    titleColor: "text-violet-700",
    subtitleColor: "text-violet-600/75",
    iconColor: "text-violet-600",
  },
  indigo: {
    headerBg:
      "bg-linear-to-r from-indigo-50/80 via-violet-50/20 to-transparent",
    titleColor: "text-indigo-700",
    subtitleColor: "text-indigo-600/75",
    iconColor: "text-indigo-600",
  },
  teal: {
    headerBg: "bg-linear-to-r from-teal-50/85 via-cyan-50/25 to-transparent",
    titleColor: "text-teal-800",
    subtitleColor: "text-teal-700/75",
    iconColor: "text-teal-600",
  },
  cyan: {
    headerBg: "bg-linear-to-r from-cyan-50/80 via-sky-50/20 to-transparent",
    titleColor: "text-cyan-800",
    subtitleColor: "text-cyan-700/75",
    iconColor: "text-cyan-600",
  },
  purple: {
    headerBg: "bg-linear-to-r from-purple-50/80 via-pink-50/20 to-transparent",
    titleColor: "text-purple-700",
    subtitleColor: "text-purple-600/75",
    iconColor: "text-purple-600",
  },
  slate: {
    headerBg: "bg-linear-to-r from-slate-100/90 via-slate-50/50 to-transparent",
    titleColor: "text-slate-800",
    subtitleColor: "text-slate-500",
    iconColor: "text-slate-600",
  },
} as const

export type DetailSectionThemeKey = keyof typeof DETAIL_SECTION_THEMES

export const detailSectionHeaderBase =
  "flex flex-col gap-1 border-b border-dashed border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8"

export const detailSectionHeading =
  "flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase sm:text-sm"

export const detailSectionSubtitle = "text-xs font-medium"

export const detailSectionContent = "px-6 py-6 md:px-8 bg-white"

export const detailSectionText =
  "max-w-4xl text-xs sm:text-sm leading-relaxed wrap-break-word whitespace-pre-line text-slate-700"

export const sectionHeadingTitle =
  "flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-slate-900 uppercase sm:text-sm"

export const sectionHeadingSubtitle = "text-xs text-slate-500"

export const sectionHeaderBox =
  "flex flex-col gap-1 border-b border-dashed border-border bg-slate-50/50 px-6 py-4.5 md:px-8"

export const sectionContentBox = "px-6 py-6 md:px-8"

export const specContainer =
  "flex flex-col divide-y divide-dashed divide-border bg-white"

export const specRow =
  "flex flex-col gap-2 px-6 py-4.5 transition-colors hover:bg-slate-50/30 sm:flex-row sm:items-center sm:justify-between md:px-8"

export const specRowHeader = "flex items-center gap-2.5"

export const specBadge =
  "inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-slate-100 font-mono text-[10px] font-bold text-slate-700"

export const specRowTitle =
  "font-mono text-xs font-bold tracking-wider text-slate-900 uppercase"

export const specRowValue = "text-xs font-bold text-slate-900 sm:text-sm"

export const productSpecsContainer = specContainer
export const toolSpecsContainer = specContainer
export const specItemBox = specRow
export const specItemLabel = specRowTitle
export const specItemValue = specRowValue

export const toolDeepDiveContainer =
  "flex flex-col divide-y divide-dashed divide-border bg-white"

export const deepDiveSectionTitle = sectionHeadingTitle

export const deepDiveItem =
  "flex flex-col gap-2 px-6 py-5 transition-colors hover:bg-slate-50/30 md:px-8"

export const deepDiveItemHeader = "flex items-center gap-2.5"

export const deepDiveItemTitle =
  "flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-slate-900 uppercase"

export const deepDiveItemText = detailSectionText

export const deepDiveSubSection = deepDiveItem
export const deepDiveSubSectionHeader = deepDiveItemHeader
export const deepDiveSubHeading = deepDiveItemTitle
export const deepDiveSubSubtitle = "text-[11px] text-slate-500"
export const deepDiveSubSectionBody = "bg-transparent"
export const deepDiveSubSectionText = detailSectionText

export const faqContainer =
  "flex flex-col divide-y divide-dashed divide-border bg-white"

export const faqItem =
  "flex flex-col gap-2 px-6 py-5 transition-colors hover:bg-slate-50/30 md:px-8"

export const faqQuestionHeader = "flex items-center gap-2.5"

export const faqQuestionText = "text-xs sm:text-sm font-bold text-slate-900"

export const faqAnswerBody = "bg-transparent"

export const faqAnswerText =
  "max-w-4xl text-xs sm:text-sm leading-relaxed wrap-break-word whitespace-pre-line text-slate-600"

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

export const cardCommentIcon =
  "size-3.5 shrink-0 text-slate-400 transition-colors group-hover/comment:text-slate-600"
export const cardCommentGroup =
  "group/comment inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"

export const cardTagIcon = "size-3.5 shrink-0 text-slate-400"
export const cardTagsGroup = "flex flex-wrap items-center gap-1.5"
export const cardTagBadge =
  "rounded-md border border-slate-200/80 bg-slate-100/70 px-2 py-0.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200/60"

export const socialIconButton =
  "flex size-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50"
export const socialIconImage = "size-4 object-contain"

export const specPlatformBadge =
  "inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 text-xs font-medium text-slate-700"

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

export const sidebarSocialLink =
  "flex size-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"

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
  "group/sponsor relative rounded-none border border-dashed border-indigo-200/90 bg-linear-to-br from-indigo-50/60 via-white to-violet-50/40 p-4 transition-all hover:border-indigo-400 hover:shadow-xs"

export const trendingDevtoolRow =
  "group flex items-center justify-between gap-3 rounded-lg border border-transparent p-2 transition-all hover:border-slate-200/80 hover:bg-slate-50"

export const navbarSearchWrapper =
  "relative flex w-full max-w-sm items-center transition-all"

export const navbarSearchInput =
  "h-9 w-full rounded-lg border border-dashed border-slate-200 bg-slate-50/70 pr-12 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-0 shadow-2xs transition-all"

export const navbarNavLink =
  "shrink-0 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-950"

export const navbarNavLinkActive = "text-slate-950 font-bold"

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

export const makerBadge =
  "inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-50/70 px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-100/80 transition-colors"

export const mediaGalleryGrid =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"

export const mediaThumbnail =
  "group relative overflow-hidden rounded-lg border border-dashed border-border bg-slate-100 aspect-video"

export const videoContainer =
  "relative w-full overflow-hidden rounded-xl border border-dashed border-border aspect-video bg-black/90 shadow-sm"

export const profileHeaderWrapper =
  "flex flex-col gap-6 border-b border-dashed border-border bg-linear-to-b from-slate-50/70 via-white to-white px-6 py-8 md:px-8 md:py-10"

export const submitSectionHeaderRequired =
  "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-rose-100/60 via-amber-50/50 to-white px-6 py-6 md:px-8"

export const submitSectionHeaderOptional =
  "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-emerald-100/50 via-teal-50/40 to-white px-6 py-6 md:px-8"

export const submitSectionHeaderDiscoverability =
  "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-indigo-100/50 via-violet-50/40 to-white px-6 py-6 md:px-8"

export const socialInputWrapper = "relative"

export const socialInputIconContainer =
  "pointer-events-none absolute top-2.5 left-3 flex size-4 items-center justify-center"

export const socialInputWithIcon = "pl-9"

export const submissionStatusBadge = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700"
    default:
      return "border-slate-200 bg-slate-50 text-slate-700"
  }
}

export * from "@/utils/dashboard/styles"

export const launchPromoBannerWrapper =
  "relative z-50 flex w-full items-center justify-between border-b border-amber-200/80 bg-linear-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 px-4 py-2 text-xs text-amber-950 transition-colors"

export const launchPromoBadge =
  "inline-flex items-center gap-1 rounded-md border border-amber-300/80 bg-amber-100/60 px-2 py-0.5 text-[11px] font-semibold text-amber-900 shadow-2xs"

export const launchPromoCard =
  "relative overflow-hidden rounded-xl border border-dashed border-amber-300/80 bg-linear-to-br from-amber-50/70 via-white to-yellow-50/50 p-5 shadow-xs"

export const launchPromoFullWidthSection =
  "border-b border-dashed border-border bg-linear-to-r from-amber-50/50 via-amber-50/20 to-white px-6 py-6 md:px-8"

export const launchPromoFullWidthPerksGrid =
  "mt-5 grid grid-cols-1 gap-2.5 border-t border-dashed border-amber-200/80 pt-4 sm:grid-cols-2 lg:grid-cols-4"

export const launchPromoCardList = "mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"

export const launchPromoCardItem =
  "flex items-center gap-2 text-xs font-medium text-slate-700"

export const faqCategoryHeaders = {
  launching:
    "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-rose-100/60 via-amber-50/50 to-white px-6 py-5 md:px-8",
  sponsorship:
    "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-amber-100/60 via-orange-50/40 to-white px-6 py-5 md:px-8",
  seo: "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-indigo-100/50 via-violet-50/40 to-white px-6 py-5 md:px-8",
  agents:
    "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-emerald-100/50 via-teal-50/40 to-white px-6 py-5 md:px-8",
} as const

export const faqSectionTitle =
  "font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-900 uppercase"

export const faqSectionSubtitle = "text-xs text-slate-500"

export const faqRowItem =
  "flex flex-col gap-2.5 border-b border-dashed border-border bg-white px-6 py-5.5 transition-colors hover:bg-slate-50/40 md:px-8"

export const faqRowHeader = "flex items-start gap-2.5"

export const faqRowIconBox =
  "flex size-5 shrink-0 items-center justify-center rounded-md border border-indigo-100/80 bg-indigo-50 text-indigo-600 mt-0.5"

export const faqRowQuestion =
  "text-xs sm:text-sm font-bold tracking-wide text-slate-900 uppercase leading-snug"

export const faqRowAnswer =
  "pl-7.5 max-w-4xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-600"

export const termsCategoryHeaders = {
  core: "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-blue-100/60 via-sky-50/40 to-white px-6 py-5 md:px-8",
  directory:
    "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-amber-100/60 via-orange-50/40 to-white px-6 py-5 md:px-8",
  protocols:
    "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-indigo-100/50 via-violet-50/40 to-white px-6 py-5 md:px-8",
  legal:
    "flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-emerald-100/50 via-teal-50/40 to-white px-6 py-5 md:px-8",
} as const

export const termsRowItem =
  "flex flex-col gap-2.5 border-b border-dashed border-border bg-white px-6 py-5.5 transition-colors hover:bg-slate-50/40 md:px-8"

export const termsRowHeader = "flex items-start gap-2.5"

export const termsRowIconBox =
  "flex size-5 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 mt-0.5"

export const termsRowTitle =
  "text-xs sm:text-sm font-bold tracking-wide text-slate-900 uppercase leading-snug"

export const termsRowBody =
  "pl-7.5 max-w-4xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-600"

export const termsBulletList =
  "mt-2 list-inside list-disc space-y-1.5 pl-1 text-xs sm:text-sm text-slate-600 leading-relaxed"

export const activeSponsorCardBg = (tier?: Tier) =>
  cn(
    "group/sponsor relative rounded-none border border-dashed p-4 transition-all hover:shadow-xs overflow-hidden",
    tier === TIER.PREMIUM_PLUS
      ? "border-amber-300/90 bg-linear-to-br from-amber-50/70 via-white to-orange-50/50 hover:border-amber-400"
      : tier === TIER.PREMIUM
        ? "border-blue-300/90 bg-linear-to-br from-blue-50/70 via-white to-indigo-50/50 hover:border-blue-400"
        : "border-indigo-300/90 bg-linear-to-br from-indigo-50/70 via-white to-blue-50/50 hover:border-indigo-400"
  )

export const activeSponsorCard = activeSponsorCardBg()

export const adDurationSelectorWrapper = "grid grid-cols-1 gap-3 sm:grid-cols-2"

export const adDurationOption = (selected: boolean) =>
  cn(
    "relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all",
    selected
      ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20"
      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
  )

export const weekPickerGrid =
  "grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-64 overflow-y-auto pr-1"

export const weekPickerSlot = (selected: boolean, disabled: boolean) =>
  cn(
    "relative flex cursor-pointer flex-col rounded-lg border p-2.5 text-left transition-all",
    disabled
      ? "cursor-not-allowed border-slate-100 bg-slate-50/50 opacity-50"
      : selected
        ? "border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500/20"
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
  )

export const promoBanner =
  "flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900"

export const promoBannerSuccess =
  "flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900"

export const launchWeekCard = (
  selected: boolean,
  disabled: boolean,
  isFull: boolean
) =>
  cn(
    "relative flex flex-col rounded-xl border p-3.5 text-left transition-all",
    disabled || isFull
      ? "cursor-not-allowed border-slate-200/60 bg-slate-50/70 opacity-60"
      : "cursor-pointer hover:border-slate-300 hover:shadow-xs",
    selected && !isFull
      ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/30"
      : !disabled && !isFull && !selected
        ? "border-slate-200/80 bg-white"
        : ""
  )

export const launchWeekGrid =
  "grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4"

export const launchWeekUpsellCallout =
  "flex flex-col gap-2 rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50/50 p-4 text-xs text-amber-900"

export const launchPromoCelebrationCallout =
  "flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-linear-to-r from-emerald-50/80 via-teal-50/50 to-blue-50/40 p-4 text-xs text-emerald-950"

export const noSubmissionsCard =
  "flex flex-col items-center gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-6 text-center"

export const submissionSelectorItem = (selected: boolean) =>
  cn(
    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all",
    selected
      ? "border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500/20"
      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
  )

export const pricingSection = "border-b border-dashed border-border bg-white"

export const pricingSectionHeader =
  "flex flex-col gap-3 border-b border-dashed border-border bg-slate-50/50 px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-8"

export const pricingSectionTitle =
  "text-xl font-extrabold text-slate-900 sm:text-2xl"

export const pricingSectionSubtitle = "mt-1 text-xs text-slate-500 sm:text-sm"

export const pricingSponsorshipGrid =
  "relative grid grid-cols-1 divide-y divide-dashed divide-border bg-white md:grid-cols-2 md:divide-y-0 md:divide-x"

export const pricingTiersGrid =
  "relative grid grid-cols-1 divide-y divide-dashed divide-border bg-white md:grid-cols-3 md:divide-y-0 md:divide-x"

export const pricingColumn =
  "group/col relative flex flex-col justify-between p-6 transition-colors hover:bg-slate-50/30 md:p-8"

export const pricingPriceBox = "mt-4 flex items-baseline gap-2 rounded-lg p-3"

export const pricingFeatureList = "mt-4 space-y-2.5 text-xs text-slate-700"

export const pricingBonusBox =
  "mt-4 flex items-start gap-2 rounded-md border border-amber-200/80 bg-amber-50/60 p-2.5 text-[11px] text-amber-900"

export const cornerBracketTL =
  "absolute top-[-1px] left-[-1px] size-2.5 border-t-2 border-l-2 border-slate-900"

export const cornerBracketTR =
  "absolute top-[-1px] right-[-1px] size-2.5 border-t-2 border-r-2 border-slate-900"

export const cornerBracketBL =
  "absolute bottom-[-1px] left-[-1px] size-2.5 border-b-2 border-l-2 border-slate-900"

export const cornerBracketBR =
  "absolute right-[-1px] bottom-[-1px] size-2.5 border-r-2 border-b-2 border-slate-900"

export const sectionBottomCta =
  "flex items-center justify-center border-b border-dashed border-border bg-white px-6 py-4.5"

export const sectionCtaButton =
  "group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"

export const sectionHeaderCtaButton =
  "group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"

export const sidebarLaunchRow =
  "group relative flex items-center justify-between gap-3 overflow-hidden rounded-lg border p-2 transition-all cursor-pointer"

export const sidebarLaunchRowBorder = (tier: Tier) =>
  tier === TIER.PREMIUM_PLUS
    ? "border-amber-200/70 hover:border-amber-300"
    : tier === TIER.PREMIUM
      ? "border-blue-200/70 hover:border-blue-300"
      : "border-transparent hover:border-slate-200/80 hover:bg-slate-50"

export const sidebarLaunchVotes =
  "flex shrink-0 items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600 transition-colors group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-700"

export const itemTypeBadge = (kind: ItemKind) =>
  cn(
    "flex items-center rounded-none px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0",
    kind === ITEM_KIND.TOOL
      ? "border-sky-200/80 bg-sky-50/80 text-sky-700 hover:bg-sky-100/80"
      : "border-violet-200/80 bg-violet-50/80 text-violet-700 hover:bg-violet-100/80"
  )

export const commentSectionContainer =
  "border-b border-dashed border-border bg-white"

export const commentInputSection =
  "border-b border-dashed border-border bg-slate-50/25 px-6 py-6 md:px-8"

export const commentAuthBanner =
  "flex flex-col items-center justify-between gap-4 rounded-lg border border-dashed border-border bg-white p-5 sm:flex-row sm:p-6"

export const commentListContainer =
  "flex flex-col divide-y divide-dashed divide-border"

export const commentItemRow =
  "flex flex-col gap-2.5 px-6 py-5 transition-colors hover:bg-slate-50/40 md:px-8"

export const commentItemBody =
  "text-xs leading-relaxed text-slate-700 whitespace-pre-wrap"

export const commentItemTime = "text-[11px] text-slate-400 font-normal"

export const commentLoadMoreContainer =
  "flex items-center justify-center border-t border-dashed border-border p-4"

export const commentAuthOverlay =
  "absolute inset-0 z-10 flex items-center justify-center p-4 bg-white/40 backdrop-blur-[2px]"

export const commentAuthCard =
  "flex flex-col items-center text-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white px-7 py-5.5 shadow-[0_12px_36px_rgba(0,0,0,0.1)] max-w-sm"

export const commentAuthTitle =
  "text-sm font-bold tracking-tight text-slate-900"

export const commentAuthSubtitle =
  "text-xs text-slate-500 leading-normal max-w-xs"

export const commentAuthButton =
  "mt-2 cursor-pointer gap-2 text-xs font-semibold"



