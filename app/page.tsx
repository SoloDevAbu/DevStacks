import type { Metadata } from "next"
import { MainContent } from "@/components/home/main-content"
import { organizationSchema, faqSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { DEVSTACKS_FAQS } from "@/constants/faqs"

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
}

export default function Page() {
  const orgJsonLd = organizationSchema()
  const faqJsonLd = faqSchema(DEVSTACKS_FAQS)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MainContent />
    </>
  )
}
