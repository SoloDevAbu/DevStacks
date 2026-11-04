import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { comparisonCtaCard } from "@/utils/styles"

interface ReadyToShowcaseCtaProps {
  title?: string
  description?: string
  primaryActionLabel?: string
  primaryActionHref?: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
}

export const ReadyToShowcaseCta = ({
  title = "Ready to Showcase Your Developer Tool or Product?",
  description = "Get permanent directory indexing, map your technical stack, and make your software discoverable by human engineers and autonomous AI search agents.",
  primaryActionLabel = "Submit Your Product — 100% Free",
  primaryActionHref = ROUTES.SUBMIT,
  secondaryActionLabel = "Browse Product Directory",
  secondaryActionHref = ROUTES.PRODUCTS,
}: ReadyToShowcaseCtaProps = {}) => {
  return (
    <section className={comparisonCtaCard}>
      <div className="flex max-w-xl flex-col gap-2 text-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
          {description}
        </p>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        <Button
          size="default"
          nativeButton={false}
          render={<Link href={primaryActionHref} />}
          className="w-full text-xs font-semibold sm:w-auto"
        >
          {primaryActionLabel}
        </Button>
        <Button
          variant="outline"
          size="default"
          nativeButton={false}
          render={<Link href={secondaryActionHref} />}
          className="w-full text-xs font-semibold text-slate-700 sm:w-auto"
        >
          {secondaryActionLabel}
        </Button>
      </div>
    </section>
  )
}
