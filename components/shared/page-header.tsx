import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { cn } from "@/lib/utils"

export type PageHeaderVariant =
  | "default"
  | "home"
  | "trending"
  | "pricing"
  | "discover-building-blocks"
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
  "discover-building-blocks": {
    bg: "bg-linear-to-b from-purple-50/45 via-white to-slate-50/30",
    mesh1: "bg-purple-200/25",
    mesh2: "bg-fuchsia-200/20",
    aiLabel: "ASK AI ABOUT TECH STACKS",
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
        "relative flex flex-col justify-between gap-5 overflow-hidden border-b border-dashed border-border px-4 pt-6 pb-5 sm:px-6 sm:pt-8 sm:pb-6 md:px-8 lg:flex-row lg:items-start",
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

      <div className="relative z-10 flex max-w-2xl flex-col gap-2.5 sm:gap-3">
        <div>
          <h1 className="mb-1.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl md:text-2xl">
            {heading}
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {description}
          </p>
        </div>

        {metrics && (
          <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-2.5">
            {metrics}
          </div>
        )}
      </div>

      <div className="relative z-10 flex w-full flex-col gap-2.5 sm:gap-3 lg:max-w-100 lg:items-end">
        <AskAiBar
          prompt={aiPrompt}
          label={askAiLabel ?? config.aiLabel}
          align="responsive"
        />
      </div>
    </div>
  )
}

