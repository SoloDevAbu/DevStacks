import Image from "next/image"
import { HoverOutline } from "@/components/shared/hover-outline"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { cn } from "@/lib/utils"

export type PageHeaderVariant = "default" | "home" | "trending" | "pricing"

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
    aiLabel: "ASK AI ABOUT DEVSTACKS",
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
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {askAiLabel ?? config.aiLabel}
        </p>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          {AI_PROVIDERS.map((ai) => (
            <div key={ai.id} className="group/btn relative inline-flex">
              <a
                href={`${ai.url}${encodeURIComponent(aiPrompt)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-center gap-1.5 rounded-md border border-slate-200/80 bg-white/90 px-2.5 py-1 transition-all hover:bg-slate-50 hover:shadow-2xs"
                title={`Ask ${ai.name}`}
              >
                <Image
                  src={ai.icon}
                  alt={ai.name}
                  width={14}
                  height={14}
                  className="object-contain mix-blend-multiply"
                />
                <span className="text-xs font-medium text-slate-700 transition-colors group-hover/btn:text-slate-950">
                  {ai.name}
                </span>
              </a>
              <HoverOutline />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

