import type { Metadata } from "next"
import { ComparisonPageView } from "@/components/comparisons/comparison-page-view"
import { DEVHUNT_COMPARISON } from "@/constants/comparisons/devhunt"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: DEVHUNT_COMPARISON.metaTitle,
  description: DEVHUNT_COMPARISON.metaDescription,
  keywords: DEVHUNT_COMPARISON.keywords,
  alternates: {
    canonical: DEVHUNT_COMPARISON.canonicalUrl,
    types: {
      "text/markdown": `${DEVHUNT_COMPARISON.canonicalUrl}.md`,
    },
  },
  openGraph: {
    title: DEVHUNT_COMPARISON.metaTitle,
    description: DEVHUNT_COMPARISON.metaDescription,
    url: DEVHUNT_COMPARISON.canonicalUrl,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${DEVHUNT_COMPARISON.name} | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEVHUNT_COMPARISON.metaTitle,
    description: DEVHUNT_COMPARISON.metaDescription,
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const DevHuntAlternativePage = () => {
  return <ComparisonPageView comparison={DEVHUNT_COMPARISON} />
}

export default DevHuntAlternativePage
