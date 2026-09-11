import type { Metadata } from "next"
import { Flame, Wrench } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"
import { heroStatPill } from "@/utils/styles"
import { getRisingTools } from "@/lib/rankings/rising-tools"
import type { DbTool } from "@/types/entities"
import { RisingToolsContent } from "./rising-tools-content"

export const revalidate = 60

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
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Rising Developer Tools | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Rising Developer Tools | ${SITE_CONFIG.name}`,
    description: "Developer tools and APIs gaining momentum right now.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const RisingToolsPage = async () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Rising Tools",
      url: `${SITE_CONFIG.url}/discover/rising-tools`,
    },
  ])

  const initialTools = await getRisingTools({
    limit: DISCOVER_PAGE_LIMIT,
    page: 1,
  }).catch(() => [])

  const collectionJsonLd = collectionPageSchema({
    name: "Rising Developer Tools & APIs",
    description:
      "Developer tools, infrastructure, and APIs gaining momentum across the ecosystem.",
    url: `${SITE_CONFIG.url}/discover/rising-tools`,
    items: (initialTools as DbTool[]).map((tool) => ({
      name: tool.name,
      url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
      description: tool.tagline,
    })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading="Rising Tools"
          description="Developer tools, APIs, and infrastructure gaining momentum, ranked dynamically by upvotes, build velocity, and community usage."
          aiPrompt={AI_PROMPTS.risingTools}
          variant="discover-rising-tools"
          metrics={
            <div className={heroStatPill}>
              <Wrench className="size-3.5 text-indigo-600" />
              <span className="font-bold text-slate-900">
                Momentum Velocity
              </span>
              <span className="text-slate-500">Developer APIs & Tools</span>
            </div>
          }
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

        <RisingToolsContent initialTools={initialTools as DbTool[]} />
      </div>
    </>
  )
}

export default RisingToolsPage
