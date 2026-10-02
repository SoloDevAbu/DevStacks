import type { Metadata } from "next"
import { ComparisonPageView } from "@/components/comparisons/comparison-page-view"
import { PRODUCT_HUNT_COMPARISON } from "@/constants/comparisons/product-hunt"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: PRODUCT_HUNT_COMPARISON.metaTitle,
  description: PRODUCT_HUNT_COMPARISON.metaDescription,
  keywords: PRODUCT_HUNT_COMPARISON.keywords,
  alternates: {
    canonical: PRODUCT_HUNT_COMPARISON.canonicalUrl,
    types: {
      "text/markdown": `${PRODUCT_HUNT_COMPARISON.canonicalUrl}.md`,
    },
  },
  openGraph: {
    title: PRODUCT_HUNT_COMPARISON.metaTitle,
    description: PRODUCT_HUNT_COMPARISON.metaDescription,
    url: PRODUCT_HUNT_COMPARISON.canonicalUrl,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${PRODUCT_HUNT_COMPARISON.name} | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT_HUNT_COMPARISON.metaTitle,
    description: PRODUCT_HUNT_COMPARISON.metaDescription,
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const ProductHuntAlternativePage = () => {
  return <ComparisonPageView comparison={PRODUCT_HUNT_COMPARISON} />
}

export default ProductHuntAlternativePage
