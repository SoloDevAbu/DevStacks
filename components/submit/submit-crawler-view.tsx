import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Sparkles, Shield, Cpu, Layers, HelpCircle } from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import Link from "next/link"

const SUBMISSION_BENEFITS = [
  {
    icon: Globe,
    title: "High-Authority Organic SEO",
    description:
      "Permanent directory listing with verified meta tags, structured SoftwareApplication schema, and category indexes.",
  },
  {
    icon: Sparkles,
    title: "AEO & GEO Optimization",
    description:
      "Automatic inclusion in /llms.txt and /llms-full.txt, ensuring ChatGPT, Claude, and Perplexity understand and recommend your tool.",
  },
  {
    icon: Layers,
    title: "Built With Tech-Stack Graph",
    description:
      "Link your product to the developer tools it was built with, gaining cross-discovery from tool detail pages.",
  },
  {
    icon: Cpu,
    title: "Algorithmic Freshness Boost",
    description:
      "Every new submission receives a 7-day boost in the 'New & Rising' feed for immediate early traction.",
  },
]

export const SubmitCrawlerView = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Submit a Developer Tool or Product"
        description={`List your developer tool, API, or infrastructure product on ${SITE_CONFIG.name}. Gain discoverability across search engines, AI answer engines, and the developer community.`}
        aiPrompt={AI_PROMPTS.submit}
      />

      <div className="flex flex-col gap-8 p-6 md:p-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            Why List Your Product on {SITE_CONFIG.name}?
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SUBMISSION_BENEFITS.map((b) => (
              <Card
                key={b.title}
                className="rounded-none border-dashed bg-white"
              >
                <CardContent className="flex flex-col gap-2 p-5">
                  <div className="flex items-center gap-2">
                    <b.icon className="size-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {b.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {b.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-white p-6">
          <h2 className="text-base font-bold text-slate-900">
            Developer Submission Guidelines
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-xs leading-relaxed text-slate-600">
            <li>
              <strong>General Information:</strong> Provide your product name,
              official website URL, tagline, and technical description.
            </li>
            <li>
              <strong>Technical Deep-Dive:</strong> Specify the exact problem
              your tool solves, its technical solution, and its unique value
              proposition.
            </li>
            <li>
              <strong>Discoverability (SEO / AEO / GEO / ASO):</strong> Include
              target audience, relevant search keywords, ASO directory
              categories, and an AI Context prompt for LLM answer engines.
            </li>
            <li>
              <strong>Tech Stack (Built With):</strong> List the underlying
              libraries, databases, authentication providers, and cloud hosting
              used to build the product.
            </li>
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
            <p className="text-xs text-slate-500">
              Ready to submit your developer tool? Sign in with your GitHub or
              Google account.
            </p>
            <Button
              render={<Link href="/?redirect=/submit" />}
              className="text-xs"
            >
              Sign in to Submit
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
