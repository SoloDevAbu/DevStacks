import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { DEVSTACKS_FAQS } from "@/constants/faqs"
import { SITE_CONFIG } from "@/constants/site"

export const FaqSection = () => {
  return (
    <section className="flex flex-col gap-6 border-t border-dashed border-border px-6 py-12 md:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <HelpCircle className="size-4 text-indigo-500" />
          Frequently Asked Questions
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          Everything you need to know about {SITE_CONFIG.name}
        </h2>
        <p className="max-w-2xl text-sm text-slate-600">
          Answers to common questions about developer tool rankings, the tech stack directory, and how our platform works with browser search and AI answer engines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DEVSTACKS_FAQS.map((faq) => (
          <Card key={faq.question} className="rounded-none border-dashed bg-white">
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-sm font-bold text-slate-900">
                {faq.question}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                {faq.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
