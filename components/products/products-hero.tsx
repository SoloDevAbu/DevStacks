import Link from "next/link"
import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { ROUTES } from "@/constants/routes"

interface ProductsHeroProps {
  heading: string
  description: string
  aiPrompt?: string
}

export const ProductsHero = ({
  heading,
  description,
  aiPrompt = "",
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
          <div className="mt-2 text-xs text-slate-600 sm:text-sm">
            <span>Browse by </span>
            <Link
              href={ROUTES.PRODUCT_CATEGORIES}
              className="font-bold text-slate-900 underline underline-offset-4 decoration-slate-400 hover:text-violet-600 hover:decoration-violet-600 transition-colors"
            >
              category
            </Link>
          </div>
        </div>
      </div>

      {/* Ask AI strip - left-aligned on mobile, right-aligned on desktop */}
      <div className="relative z-10 flex w-full flex-col gap-2.5 sm:gap-3 lg:max-w-100 lg:items-end">
        <AskAiBar
          prompt={aiPrompt}
          label="ASK AI ABOUT PRODUCTS"
          align="responsive"
        />
      </div>
    </div>
  )
}
