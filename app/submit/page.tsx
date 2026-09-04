import type { Metadata } from "next"
import { SubmitContent } from "@/components/submit/submit-content"
import { SITE_CONFIG } from "@/constants/site"
import { breadcrumbSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "Submit a Developer Product",
  description:
    `List your developer tool, API, or infrastructure product on ${SITE_CONFIG.name} for the community to discover. Add SEO, AEO, GEO, and ASO data to maximize visibility.`,
  keywords: [
    "submit developer tool",
    "list developer tool",
    "submit API",
    "developer product directory",
    "devtools submission",
    "promote dev tools",
    "developer platform discovery",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/submit`,
  },
  openGraph: {
    title: `Submit a Developer Product | ${SITE_CONFIG.name}`,
    description: `List your developer tool or API on ${SITE_CONFIG.name} to reach thousands of builders.`,
    type: "website",
    url: `${SITE_CONFIG.url}/submit`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Submit a Developer Product | ${SITE_CONFIG.name}`,
    description: `List your developer tool or API on ${SITE_CONFIG.name}.`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SubmitPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Submit", url: `${SITE_CONFIG.url}/submit` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <SubmitContent />
    </>
  )
}
