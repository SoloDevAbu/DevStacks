import { HelpCircle } from "lucide-react"
import { comparisonSectionTitle, comparisonSectionSubtitle } from "@/utils/styles"

export interface BlogFaqItem {
  question: string
  answer: string
}

export const BlogFaqs = ({ faqs }: { faqs: BlogFaqItem[] }) => {
  if (!faqs || faqs.length === 0) return null

  return (
    <section id="faqs" className="flex flex-col divide-y divide-dashed divide-border bg-white scroll-mt-24">
      {/* FAQ Header */}
      <div className="flex flex-col gap-1 p-6 sm:p-8 md:p-10">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-indigo-700">
          <HelpCircle className="size-4" />
          <span>Technical FAQ</span>
        </div>
        <h2 className={comparisonSectionTitle}>
          Frequently Asked Questions
        </h2>
        <p className={comparisonSectionSubtitle}>
          Straightforward answers to the most common technical questions about this product.
        </p>
      </div>

      {/* FAQ Items - horizontal separating lines touch vertical dashed lines directly, with padding matching the parent header */}
      {faqs.map((faq, idx) => (
        <div key={idx} className="flex flex-col gap-2 p-6 sm:p-8 md:p-10">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="mt-0.5 size-4 shrink-0 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 sm:text-base">
              {faq.question}
            </h3>
          </div>
          <p className="pl-6.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {faq.answer}
          </p>
        </div>
      ))}
    </section>
  )
}
