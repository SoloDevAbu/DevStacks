export const adminShell = "flex min-h-[calc(100dvh-4rem)] w-full bg-white"

export const adminSidebar =
  "sticky top-16 hidden h-[calc(100dvh-4rem)] w-60 shrink-0 flex-col gap-5 overflow-y-auto border-r border-dashed border-border p-5 lg:flex"

export const adminSidebarCount =
  "font-mono text-[10px] font-bold text-amber-700 tabular-nums"

export const adminMobileBar =
  "flex items-center justify-between border-b border-dashed border-border px-6 py-3 lg:hidden"

export const adminMain = "flex min-w-0 flex-1 flex-col"

export const adminPageHeader =
  "flex flex-col gap-3 border-b border-dashed border-border px-6 py-6 sm:flex-row sm:items-end sm:justify-between md:px-8"

export const adminPageTitle = "text-xl font-bold tracking-tight text-slate-900"

export const adminFilterBar =
  "flex flex-col gap-3 border-b border-dashed border-border px-6 py-3 md:flex-row md:items-center md:justify-between md:px-8"

export const adminFilterGroup = "flex flex-wrap items-center gap-1"

export const adminFilterLink =
  "border border-dashed border-transparent px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors"

export const adminFilterLinkActive = "border-border bg-slate-900 text-white"

export const adminFilterLinkInactive = "text-slate-500 hover:border-border hover:text-slate-900"

export const adminTableWrapper = "overflow-x-auto"

export const adminCellTitle = "text-sm font-semibold text-slate-900"

export const adminCellMeta = "text-xs text-slate-500"

export const adminStatGrid =
  "grid grid-cols-2 divide-x divide-y divide-dashed divide-border border-b border-dashed border-border md:grid-cols-4 md:divide-y-0"

export const adminStatCell = "flex flex-col gap-1 p-6"

export const adminStatValue = "text-3xl font-black tracking-tight text-slate-900 tabular-nums"

export const adminSection = "flex flex-col border-b border-dashed border-border"

export const adminSectionHeader =
  "flex items-center justify-between gap-3 border-b border-dashed border-border bg-slate-50/50 px-6 py-3 md:px-8"

export const adminSectionBody = "px-6 py-5 md:px-8"

export const adminFieldGrid =
  "grid grid-cols-1 divide-y divide-dashed divide-border md:grid-cols-[180px_1fr] md:divide-y-0"

export const adminFieldLabel =
  "border-dashed border-border px-6 py-3 md:border-b md:border-r md:px-8"

export const adminFieldValue =
  "min-w-0 border-dashed border-border px-6 py-3 text-sm break-words whitespace-pre-wrap text-slate-700 md:border-b md:px-8"

export const adminDiffGrid =
  "grid grid-cols-1 divide-y divide-dashed divide-border border-b border-dashed border-border md:grid-cols-[180px_1fr_1fr] md:divide-x md:divide-y-0"

export const adminDiffCell =
  "min-w-0 px-6 py-3 text-sm break-words whitespace-pre-wrap md:px-5"

export const adminDiffBefore = "bg-rose-50/40 text-slate-500 line-through decoration-rose-300"

export const adminDiffAfter = "bg-emerald-50/40 text-slate-900"

export const adminActionBar =
  "flex flex-wrap items-center gap-2 border-b border-dashed border-border px-6 py-4 md:px-8"

export const adminNotice =
  "border-b border-dashed border-amber-300 bg-amber-50/60 px-6 py-3 text-xs text-amber-800 md:px-8"

export const adminPagination =
  "flex items-center justify-between gap-3 px-6 py-4 text-xs text-slate-500 md:px-8"

export const adminEmptyState = "px-6 py-12 text-center text-sm text-slate-500 md:px-8"

export const adminBlogBadge = {
  generating: "border-blue-200 bg-blue-50 text-blue-700 animate-pulse",
  pending: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-indigo-200 bg-indigo-50 text-indigo-700",
  failed: "border-red-200 bg-red-50 text-red-700",
} as const

export const adAdminStatusBadge = {
  pending_payment: "border-slate-200 bg-slate-50 text-slate-600",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paused: "border-amber-200 bg-amber-50 text-amber-700",
  expired: "border-slate-200 bg-slate-50 text-slate-500",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
} as const

export const paymentStatusBadge = {
  pending: "border-slate-200 bg-slate-50 text-slate-600",
  succeeded: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  refunded: "border-amber-200 bg-amber-50 text-amber-700",
  cancelled: "border-slate-200 bg-slate-50 text-slate-500",
} as const
