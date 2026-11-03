import { notFound, permanentRedirect } from "next/navigation"
import { getComparisonBySlug, getAllComparisons } from "@/constants/comparisons"

interface ComparePageProps {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = async () =>
  getAllComparisons().map((comparison) => ({ slug: comparison.slug }))

// Every comparison already lives at its canonical /<platform>-alternative page; the /compare
// aliases only produced duplicate URLs, so they permanently redirect there.
const CompareAliasPage = async ({ params }: ComparePageProps) => {
  const { slug } = await params
  const comparison = getComparisonBySlug(slug)
  if (!comparison) notFound()

  permanentRedirect(comparison.routePath || comparison.canonicalUrl)
}

export default CompareAliasPage
