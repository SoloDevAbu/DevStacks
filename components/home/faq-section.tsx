import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, ArrowRight } from "lucide-react"
import { LAUNCHNESTS_FAQS } from "@/constants/faqs"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const FaqSection = () => {
  const previewFaqs = LAUNCHNESTS_FAQS.slice(0, 6)

  return (
    <section className="-mt-px flex flex-col gap-6 border-t border-dashed border-border px-6 py-12 md:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <HelpCircle className="size-4 text-indigo-500" />
          Frequently Asked Questions
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          Everything you need to know about {SITE_CONFIG.name}
        </h2>
        <p className="max-w-2xl text-sm text-slate-600">
          Answers to common questions about developer tool rankings, the tech
          stack directory, and how our platform works with browser search and AI
          answer engines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {previewFaqs.map((faq) => (
          <Card
            key={faq.question}
            className="rounded-none border-dashed bg-white"
          >
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

      <div className="flex items-center justify-center pt-2">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={ROUTES.FAQ} />}
          className="gap-2 text-xs"
        >
          View all {LAUNCHNESTS_FAQS.length} FAQs
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </section>
  )
}

