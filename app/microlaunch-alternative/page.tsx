import type { Metadata } from "next"
import { ComparisonPageView } from "@/components/comparisons/comparison-page-view"
import { MICROLAUNCH_COMPARISON } from "@/constants/comparisons/microlaunch"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: MICROLAUNCH_COMPARISON.metaTitle,
  description: MICROLAUNCH_COMPARISON.metaDescription,
  keywords: MICROLAUNCH_COMPARISON.keywords,
  alternates: {
    canonical: MICROLAUNCH_COMPARISON.canonicalUrl,
    types: {
      "text/markdown": `${MICROLAUNCH_COMPARISON.canonicalUrl}.md`,
    },
  },
  openGraph: {
    title: MICROLAUNCH_COMPARISON.metaTitle,
    description: MICROLAUNCH_COMPARISON.metaDescription,
    url: MICROLAUNCH_COMPARISON.canonicalUrl,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${MICROLAUNCH_COMPARISON.name} | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: MICROLAUNCH_COMPARISON.metaTitle,
    description: MICROLAUNCH_COMPARISON.metaDescription,
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const MicroLaunchAlternativePage = () => {
  return <ComparisonPageView comparison={MICROLAUNCH_COMPARISON} />
}

export default MicroLaunchAlternativePage
