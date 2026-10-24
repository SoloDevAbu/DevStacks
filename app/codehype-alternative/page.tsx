import type { Metadata } from "next"
import { ComparisonPageView } from "@/components/comparisons/comparison-page-view"
import { CODEHYPE_COMPARISON } from "@/constants/comparisons/codehype"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: CODEHYPE_COMPARISON.metaTitle,
  description: CODEHYPE_COMPARISON.metaDescription,
  keywords: CODEHYPE_COMPARISON.keywords,
  alternates: {
    canonical: CODEHYPE_COMPARISON.canonicalUrl,
    types: {
      "text/markdown": `${CODEHYPE_COMPARISON.canonicalUrl}.md`,
    },
  },
  openGraph: {
    title: CODEHYPE_COMPARISON.metaTitle,
    description: CODEHYPE_COMPARISON.metaDescription,
    url: CODEHYPE_COMPARISON.canonicalUrl,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${CODEHYPE_COMPARISON.name} | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: CODEHYPE_COMPARISON.metaTitle,
    description: CODEHYPE_COMPARISON.metaDescription,
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const CodeHypeAlternativePage = () => {
  return <ComparisonPageView comparison={CODEHYPE_COMPARISON} />
}

export default CodeHypeAlternativePage
