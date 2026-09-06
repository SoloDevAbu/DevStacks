import type { Metadata } from "next"
import { Flame } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { RisingToolsContent } from "./rising-tools-content"

export const metadata: Metadata = {
  title: "Rising Developer Tools & APIs",
  description: `Discover developer tools, infrastructure, and APIs gaining momentum across the ${SITE_CONFIG.name} ecosystem.`,
  keywords: [
    "rising developer tools",
    "developer tools momentum",
    "fastest growing APIs",
    "trending developer tools",
    "trending APIs",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover/rising-tools`,
  },
  openGraph: {
    title: `Rising Developer Tools | ${SITE_CONFIG.name}`,
    description: "Developer tools and APIs gaining momentum right now.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover/rising-tools`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Rising Developer Tools | ${SITE_CONFIG.name}`,
    description: "Developer tools and APIs gaining momentum right now.",
  },
}

export default function RisingToolsPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Discover", url: `${SITE_CONFIG.url}/discover` },
    {
      name: "Rising Tools",
      url: `${SITE_CONFIG.url}/discover/rising-tools`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading="🚀 Rising Tools"
          description="Developer tools, APIs, and infrastructure gaining momentum, ranked dynamically by upvotes, build velocity, and community usage."
          aiPrompt={AI_PROMPTS.risingTools}
        />

        <div className="border-b border-dashed border-border bg-emerald-50/40 px-6 py-3 md:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Flame className="size-4 shrink-0 text-emerald-600" />
            <span>
              <strong>Momentum Velocity:</strong> Ranked dynamically based on
              recent engagement, builds, and upvotes relative to age.
            </span>
          </div>
        </div>

        <RisingToolsContent />
      </div>
    </>
  )
}
