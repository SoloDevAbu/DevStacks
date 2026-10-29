import Link from "next/link"
import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { ROUTES } from "@/constants/routes"

interface ToolsHeroProps {
  heading: string
  description: string
  aiPrompt?: string
}

export const ToolsHero = ({
  heading,
  description,
  aiPrompt = "",
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
          <div className="mt-2 text-xs text-slate-600 sm:text-sm">
            <span>Browse by </span>
            <Link
              href={ROUTES.TOOL_CATEGORIES}
              className="font-bold text-slate-900 underline underline-offset-4 decoration-slate-400 hover:text-indigo-600 hover:decoration-indigo-600 transition-colors"
            >
              category
            </Link>
          </div>
        </div>
      </div>

      {/* Ask AI strip */}
      <div className="relative z-10 flex w-full max-w-[320px] flex-col gap-3 lg:max-w-100 lg:items-end">
        <AskAiBar prompt={aiPrompt} label="ASK AI ABOUT TOOLS" align="end" />
      </div>
    </div>
  )
}
