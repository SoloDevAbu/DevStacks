import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ComparisonPageView } from "@/components/comparisons/comparison-page-view"
import {
  getComparisonBySlug,
  getAllComparisons,
} from "@/constants/comparisons"
import { SITE_CONFIG } from "@/constants/site"

interface ComparePageProps {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = async () => {
  const comparisons = getAllComparisons()
  return comparisons.map((comp) => ({ slug: comp.slug }))
}

export const generateMetadata = async (
  props: ComparePageProps
): Promise<Metadata> => {
  const { slug } = await props.params
  const comparison = getComparisonBySlug(slug)

  if (!comparison) {
    return {
      title: "Comparison Not Found",
      description: "The requested platform comparison could not be found.",
    }
  }

  const pageCanonical = `${SITE_CONFIG.url}/compare/${comparison.slug}`

  return {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    keywords: comparison.keywords,
    alternates: {
      canonical: pageCanonical,
    },
    openGraph: {
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      url: pageCanonical,
      type: "article",
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${comparison.name} | ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      images: [SITE_CONFIG.ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const CompareDetailPage = async (props: ComparePageProps) => {
  const { slug } = await props.params
  const comparison = getComparisonBySlug(slug)

  if (!comparison) {
    notFound()
  }

  return <ComparisonPageView comparison={comparison} />
}

export default CompareDetailPage
