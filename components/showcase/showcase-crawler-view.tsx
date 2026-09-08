import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layers, Code2, Sparkles, Terminal } from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import Link from "next/link"

const SHOWCASE_HIGHLIGHTS = [
  {
    icon: Layers,
    title: "Transparent Tech Stacks",
    description:
      "Publish your complete tech stack: database, authentication, hosting, payments, and UI libraries.",
  },
  {
    icon: Code2,
    title: "Community Architectural Blueprint",
    description:
      "Help other developers learn how production software is constructed in the real world.",
  },
  {
    icon: Sparkles,
    title: "Cross-Directory Visibility",
    description:
      "Your build appears on the detail pages of every tool and API you used to build it.",
  },
  {
    icon: Terminal,
    title: "Developer Feedback",
    description:
      "Receive community upvotes, comments, and developer insights from fellow builders.",
  },
]

export const ShowcaseCrawlerView = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Developer Build Showcase"
        description={`Share what you've built with modern developer tools and APIs on ${SITE_CONFIG.name}. Inspire the engineering community with your architecture.`}
        aiPrompt={AI_PROMPTS.showcase}
      />

      <div className="flex flex-col gap-8 p-6 md:p-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            Showcase Your Build Architecture
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SHOWCASE_HIGHLIGHTS.map((h) => (
              <Card
                key={h.title}
                className="rounded-none border-dashed bg-white"
              >
                <CardContent className="flex flex-col gap-2 p-5">
                  <div className="flex items-center gap-2">
                    <h.icon className="size-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {h.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {h.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-white p-6">
          <h2 className="text-base font-bold text-slate-900">
            How Build Showcases Work
          </h2>
          <p className="text-xs leading-relaxed text-slate-600">
            Developer builds on {SITE_CONFIG.name} connect real-world software
            products with their underlying developer infrastructure. When you
            showcase your build, other developers can inspect your stack,
            discover how you solved tough technical challenges, and upvote your
            architecture.
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
            <p className="text-xs text-slate-500">
              Ready to submit your build showcase? Sign in with your GitHub or
              Google account.
            </p>
            <Button
              render={<Link href="/?redirect=/showcase" />}
              className="text-xs"
            >
              Sign in to Showcase
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
