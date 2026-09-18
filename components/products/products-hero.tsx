import { Sparkles, Rocket } from "lucide-react"
import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { heroStatPill } from "@/utils/styles"

interface ProductsHeroProps {
  heading: string
  description: string
  aiPrompt?: string
  totalCount?: number
  totalLikes?: number
}

export const ProductsHero = ({
  heading,
  description,
  aiPrompt = "",
  totalCount = 0,
  totalLikes = 0,
}: ProductsHeroProps) => {
  return (
    <div className="relative flex flex-col justify-between gap-6 overflow-hidden border-b border-dashed border-border bg-linear-to-b from-violet-50/40 via-white to-slate-50/30 px-6 pt-8 pb-6 md:px-8 lg:flex-row lg:items-start">
      {/* Subtle ambient gradient mesh for product vibrancy */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-violet-200/25 blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-1/4 size-64 rounded-full bg-amber-200/20 blur-3xl" />

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
          <div className={heroStatPill}>
            <Rocket className="size-3.5 text-violet-600" />
            <span className="font-bold text-slate-900">{totalCount}</span>
            <span className="text-slate-500">Products</span>
          </div>
        </div>
      </div>

      {/* Ask AI strip */}
      <div className="relative z-10 flex w-full max-w-[320px] flex-col gap-3 lg:max-w-100 lg:items-end">
        <AskAiBar prompt={aiPrompt} label="ASK AI ABOUT PRODUCTS" align="end" />
      </div>
    </div>
  )
}
