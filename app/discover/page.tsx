import type { Metadata } from "next"
import { DiscoverContent } from "@/components/discover/discover-content"
import { breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: "Discover Developer Tools & Products",
  description:
    `Search and find new developer tools, APIs, backend services, and infrastructure products on ${SITE_CONFIG.name}. Filter by category, pricing, and verified community tiers.`,
  keywords: [
    "discover developer tools",
    "find APIs",
    "developer infrastructure directory",
    "SaaS tools for developers",
    "developer products search",
    "open source databases",
    "developer productivity tools",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover`,
  },
  openGraph: {
    title: `Discover Developer Tools & Products | ${SITE_CONFIG.name}`,
    description:
      "Find new developer tools, APIs, and infrastructure products for your stack.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Discover Developer Tools & Products | ${SITE_CONFIG.name}`,
    description: "Find new developer tools, APIs, and infrastructure products.",
  },
}

export default function DiscoverPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Discover", url: `${SITE_CONFIG.url}/discover` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <DiscoverContent />
    </>
  )
}
