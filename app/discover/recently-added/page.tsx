import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { RecentlyAddedContent } from "./recently-added-content"

export const metadata: Metadata = {
  title: "Recently Added Developer Products & Tools",
  description: `Browse the newest products, APIs, and developer tools listed on ${SITE_CONFIG.name} in chronological order.`,
  keywords: [
    "recently added tools",
    "latest developer software",
    "newest APIs",
    "developer product submissions",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover/recently-added`,
  },
  openGraph: {
    title: `Recently Added Products | ${SITE_CONFIG.name}`,
    description:
      "The latest developer tools and products added to the directory.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover/recently-added`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Recently Added Products | ${SITE_CONFIG.name}`,
    description:
      "The latest developer tools and products added to the directory.",
  },
}

export default function RecentlyAddedPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Discover", url: `${SITE_CONFIG.url}/discover` },
    {
      name: "Recently Added",
      url: `${SITE_CONFIG.url}/discover/recently-added`,
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
          heading="🆕 Recently Added"
          description="The latest tools and products submitted by makers, listed in chronological order."
          aiPrompt={AI_PROMPTS.recentlyAdded}
        />

        <RecentlyAddedContent />
      </div>
    </>
  )
}
