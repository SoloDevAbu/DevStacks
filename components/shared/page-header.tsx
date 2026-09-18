import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { cn } from "@/lib/utils"

export type PageHeaderVariant =
  | "default"
  | "home"
  | "trending"
  | "pricing"
  | "discover"
  | "discover-new-rising"
  | "discover-building-blocks"
  | "discover-recently-added"
  | "discover-rising-products"
  | "discover-rising-tools"
  | "discover-daily-launches"
  | "discover-weekly-launches"
  | "products"
  | "tools"
  | "makers"

interface PageHeaderProps {
  heading: string
  description: string
  aiPrompt?: string
  variant?: PageHeaderVariant
  metrics?: React.ReactNode
  askAiLabel?: string
}

const VARIANT_CONFIGS = {
  home: {
    bg: "bg-linear-to-b from-sky-50/40 via-white to-slate-50/30",
    mesh1: "bg-sky-200/25",
    mesh2: "bg-indigo-200/20",
    aiLabel: "ASK AI ABOUT LAUNCHNESTS",
  },
  trending: {
    bg: "bg-linear-to-b from-amber-50/45 via-white to-slate-50/30",
    mesh1: "bg-amber-200/30",
    mesh2: "bg-rose-200/20",
    aiLabel: "ASK AI ABOUT TRENDING",
  },
  pricing: {
    bg: "bg-linear-to-b from-indigo-50/40 via-white to-slate-50/30",
    mesh1: "bg-indigo-200/25",
    mesh2: "bg-violet-200/20",
    aiLabel: "ASK AI ABOUT PLANS",
  },
  discover: {
    bg: "bg-linear-to-b from-blue-50/40 via-white to-slate-50/30",
    mesh1: "bg-blue-200/25",
    mesh2: "bg-indigo-200/20",
    aiLabel: "ASK AI ABOUT DISCOVERY",
  },
  "discover-new-rising": {
    bg: "bg-linear-to-b from-amber-50/50 via-white to-slate-50/30",
    mesh1: "bg-amber-200/30",
    mesh2: "bg-orange-200/20",
    aiLabel: "ASK AI ABOUT NEW & RISING",
  },
  "discover-building-blocks": {
    bg: "bg-linear-to-b from-purple-50/45 via-white to-slate-50/30",
    mesh1: "bg-purple-200/25",
    mesh2: "bg-fuchsia-200/20",
    aiLabel: "ASK AI ABOUT TECH STACKS",
  },
  "discover-recently-added": {
    bg: "bg-linear-to-b from-sky-50/50 via-white to-slate-50/30",
    mesh1: "bg-sky-200/25",
    mesh2: "bg-cyan-200/20",
    aiLabel: "ASK AI ABOUT RECENT SUBMISSIONS",
  },
  "discover-rising-products": {
    bg: "bg-linear-to-b from-emerald-50/45 via-white to-slate-50/30",
    mesh1: "bg-emerald-200/25",
    mesh2: "bg-teal-200/20",
    aiLabel: "ASK AI ABOUT RISING PRODUCTS",
  },
  "discover-rising-tools": {
    bg: "bg-linear-to-b from-indigo-50/45 via-white to-slate-50/30",
    mesh1: "bg-indigo-200/25",
    mesh2: "bg-cyan-200/20",
    aiLabel: "ASK AI ABOUT RISING TOOLS",
  },
  "discover-daily-launches": {
    bg: "bg-linear-to-b from-rose-50/45 via-white to-slate-50/30",
    mesh1: "bg-rose-200/30",
    mesh2: "bg-amber-200/20",
    aiLabel: "ASK AI ABOUT TODAY'S LAUNCHES",
  },
  "discover-weekly-launches": {
    bg: "bg-linear-to-b from-indigo-50/40 via-white to-slate-50/30",
    mesh1: "bg-indigo-200/25",
    mesh2: "bg-violet-200/20",
    aiLabel: "ASK AI ABOUT WEEKLY LAUNCHES",
  },
  products: {
    bg: "bg-linear-to-b from-violet-50/40 via-white to-slate-50/30",
    mesh1: "bg-violet-200/25",
    mesh2: "bg-amber-200/20",
    aiLabel: "ASK AI ABOUT PRODUCTS",
  },
  tools: {
    bg: "bg-linear-to-b from-indigo-50/40 via-white to-slate-50/30",
    mesh1: "bg-indigo-200/25",
    mesh2: "bg-emerald-200/20",
    aiLabel: "ASK AI ABOUT TOOLS",
  },
  makers: {
    bg: "bg-linear-to-b from-indigo-50/40 via-white to-slate-50/30",
    mesh1: "bg-indigo-200/25",
    mesh2: "bg-sky-200/20",
    aiLabel: "ASK AI ABOUT MAKERS",
  },
  default: {
    bg: "bg-linear-to-b from-slate-50/60 via-white to-slate-50/30",
    mesh1: "bg-slate-200/30",
    mesh2: "bg-indigo-200/15",
    aiLabel: "ASK AI ABOUT US",
  },
} as const

export const PageHeader = ({
  heading,
  description,
  aiPrompt = "",
  variant = "default",
  metrics,
  askAiLabel,
}: PageHeaderProps) => {
  const config = VARIANT_CONFIGS[variant] ?? VARIANT_CONFIGS.default

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-6 overflow-hidden border-b border-dashed border-border px-6 pt-8 pb-6 md:px-8 lg:flex-row lg:items-start",
        config.bg
      )}
    >
      {/* Subtle ambient gradient mesh for theme vibrancy */}
      <div
        className={cn(
          "pointer-events-none absolute -top-24 -left-24 size-72 rounded-full blur-3xl",
          config.mesh1
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute top-0 right-1/4 size-64 rounded-full blur-3xl",
          config.mesh2
        )}
      />

      <div className="relative z-10 flex max-w-2xl flex-col gap-3">
        <div>
          <h1 className="mb-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            {heading}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        {metrics && (
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            {metrics}
          </div>
        )}
      </div>

      <div className="relative z-10 flex w-full max-w-[320px] flex-col gap-3 lg:max-w-100 lg:items-end">
        <AskAiBar
          prompt={aiPrompt}
          label={askAiLabel ?? config.aiLabel}
          align="end"
        />
      </div>
    </div>
  )
}

