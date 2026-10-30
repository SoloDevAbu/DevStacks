import { HelpCircle } from "lucide-react"
import type { FaqItem } from "@/constants/faqs"
import {
  categoryFaqHeaderBg,
  faqSectionTitle,
  faqSectionSubtitle,
  faqRowItem,
  faqRowHeader,
  faqRowIconBox,
  faqRowQuestion,
  faqRowAnswer,
} from "@/utils/styles"
import { cn } from "@/lib/utils"

interface CategoryFaqSectionProps {
  title: string
  description: string
  faqs: FaqItem[]
  theme?: "indigo" | "violet"
}

export const CategoryFaqSection = ({
  title,
  description,
  faqs,
  theme = "indigo",
}: CategoryFaqSectionProps) => {
  return (
    <section className="flex w-full flex-col bg-white">
      {/* Category Section Header with Gradient and Dashed Border */}
      <div
        className={cn(
          "flex flex-col gap-1 border-b border-dashed border-border px-6 py-5 md:px-8",
          categoryFaqHeaderBg(theme)
        )}
      >
        <div className="flex items-center gap-2.5">
          <h2 className={faqSectionTitle}>{title}</h2>
        </div>
        <p className={faqSectionSubtitle}>{description}</p>
      </div>

      {/* Questions List, each separated by dashed border */}
      <div className="flex flex-col">
        {faqs.map((faq) => (
          <div key={faq.question} className={faqRowItem}>
            <div className={faqRowHeader}>
              <span className={faqRowIconBox}>
                <HelpCircle className="size-3.5" />
              </span>
              <h3 className={faqRowQuestion}>{faq.question}</h3>
            </div>
            <div className={faqRowAnswer}>{faq.answer}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
