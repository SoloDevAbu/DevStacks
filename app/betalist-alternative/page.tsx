import type { Metadata } from "next"
import { ComparisonPageView } from "@/components/comparisons/comparison-page-view"
import { BETALIST_COMPARISON } from "@/constants/comparisons/betalist"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: BETALIST_COMPARISON.metaTitle,
  description: BETALIST_COMPARISON.metaDescription,
  keywords: BETALIST_COMPARISON.keywords,
  alternates: {
    canonical: BETALIST_COMPARISON.canonicalUrl,
    types: {
      "text/markdown": `${BETALIST_COMPARISON.canonicalUrl}.md`,
    },
  },
  openGraph: {
    title: BETALIST_COMPARISON.metaTitle,
    description: BETALIST_COMPARISON.metaDescription,
    url: BETALIST_COMPARISON.canonicalUrl,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${BETALIST_COMPARISON.name} | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BETALIST_COMPARISON.metaTitle,
    description: BETALIST_COMPARISON.metaDescription,
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const BetaListAlternativePage = () => {
  return <ComparisonPageView comparison={BETALIST_COMPARISON} />
}

export default BetaListAlternativePage
