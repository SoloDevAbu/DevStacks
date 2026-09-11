import Image from "next/image"
import { Sparkles, Wrench } from "lucide-react"
import { HoverOutline } from "@/components/shared/hover-outline"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { toolHeroStatPill } from "@/utils/styles"

interface ToolsHeroProps {
  heading: string
  description: string
  aiPrompt?: string
  totalCount?: number
  totalBuilds?: number
}

export const ToolsHero = ({
  heading,
  description,
  aiPrompt = "",
  totalCount = 0,
  totalBuilds = 0,
}: ToolsHeroProps) => {
  return (
    <div className="relative flex flex-col justify-between gap-6 overflow-hidden border-b border-dashed border-border bg-linear-to-b from-indigo-50/40 via-white to-slate-50/30 px-6 pt-8 pb-6 md:px-8 lg:flex-row lg:items-start">
      {/* Subtle ambient gradient mesh for dev vibrancy */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-indigo-200/25 blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-1/4 size-64 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative z-10 flex max-w-2xl flex-col gap-3">
        <div>
          <h1 className="mb-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            {heading}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-1 flex flex-wrap items-center gap-2.5">
          <div className={toolHeroStatPill}>
            <Wrench className="size-3.5 text-indigo-600" />
            <span className="font-bold text-slate-900">{totalCount}</span>
            <span className="text-slate-500">Tools</span>
          </div>

          <div className={toolHeroStatPill}>
            <Sparkles className="size-3.5 text-amber-500" />
            <span className="font-bold text-slate-900">{totalBuilds}</span>
            <span className="text-slate-500">Connected Builds</span>
          </div>
        </div>
      </div>

      {/* Ask AI strip */}
      <div className="relative z-10 flex w-full max-w-[320px] flex-col gap-3 lg:max-w-100 lg:items-end">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          ASK AI ABOUT TOOLS
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
