import type { Metadata } from "next"
import { ComparisonPageView } from "@/components/comparisons/comparison-page-view"
import { UNEED_COMPARISON } from "@/constants/comparisons/uneed"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: UNEED_COMPARISON.metaTitle,
  description: UNEED_COMPARISON.metaDescription,
  keywords: UNEED_COMPARISON.keywords,
  alternates: {
    canonical: UNEED_COMPARISON.canonicalUrl,
  },
  openGraph: {
    title: UNEED_COMPARISON.metaTitle,
    description: UNEED_COMPARISON.metaDescription,
    url: UNEED_COMPARISON.canonicalUrl,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${UNEED_COMPARISON.name} | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: UNEED_COMPARISON.metaTitle,
    description: UNEED_COMPARISON.metaDescription,
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const UneedAlternativePage = () => {
  return <ComparisonPageView comparison={UNEED_COMPARISON} />
}

export default UneedAlternativePage
