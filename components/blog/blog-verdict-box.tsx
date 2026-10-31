import { Star, Check, MinusCircle, Sparkles } from "lucide-react"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import {
  verdictBox,
  verdictHeaderArea,
  verdictHeader,
  verdictScoreBadge,
  verdictProsConsTable,
  verdictProsCol,
  verdictConsCol,
} from "@/utils/blog/styles"

export interface BlogVerdictBoxProps {
  rating: string | number
  summary: string
  pros: string[]
  cons: string[]
  brandName: string
}

export const BlogVerdictBox = ({
  rating,
  summary,
  pros,
  cons,
  brandName,
}: BlogVerdictBoxProps) => {
  return (
    <section id="quick-verdict" className={verdictBox}>
      {/* Outer Corner Brackets - perfectly aligned to outer rectangular boundary */}
      <CornerBrackets />

      {/* Top Header & Summary Area */}
      <div className={verdictHeaderArea}>
        <div className={verdictHeader}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              <Sparkles className="size-3.5" />
              <span>LaunchNests Quick Verdict</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {brandName} at a Glance
            </h2>
          </div>

          <div className={verdictScoreBadge}>
            <Star className="size-4 fill-amber-500 text-amber-500" />
            <span>{Number(rating).toFixed(1)} / 5.0</span>
          </div>
        </div>

        {/* 40-60 word extractable verdict summary */}
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
          {summary}
        </p>
      </div>

      {/* Full-Width Key Strengths and Tradeoffs Comparison Grid */}
      <div className={verdictProsConsTable}>
        {/* Key Strengths */}
        <div className={verdictProsCol}>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Check className="size-4 text-emerald-600" />
            <span>Key Strengths</span>
          </div>
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-700">
            {pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span className="leading-relaxed">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tradeoffs & Limitations */}
        <div className={verdictConsCol}>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
            <MinusCircle className="size-4 text-slate-500" />
            <span>Tradeoffs & Limitations</span>
          </div>
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-700">
            {cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-400" />
                <span className="leading-relaxed">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
