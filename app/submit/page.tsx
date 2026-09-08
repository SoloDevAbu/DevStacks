import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SubmitContent } from "@/components/submit/submit-content"
import { SubmitCrawlerView } from "@/components/submit/submit-crawler-view"
import { SITE_CONFIG } from "@/constants/site"
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { isCrawler } from "@/lib/seo/crawlers"

export const metadata: Metadata = {
  title: "Submit a Developer Product — Get Discovered by Engineers & AI",
  description: `List your developer tool, API, or infrastructure product on ${SITE_CONFIG.name} for the community and AI models to discover. Includes structured SEO, AEO, GEO, and ASO metadata.`,
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
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Submit to ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Submit a Developer Product | ${SITE_CONFIG.name}`,
    description: `List your developer tool or API on ${SITE_CONFIG.name}.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const SUBMISSION_FAQS = [
  {
    question: `How do I list my developer tool or product on ${SITE_CONFIG.name}?`,
    answer: `Sign in with your GitHub or Google account, complete the submission form detailing your product's problem statement, solution, target audience, and underlying tech stack, then submit for review.`,
  },
  {
    question: `What are the discoverability benefits of listing on ${SITE_CONFIG.name}?`,
    answer: `Listings receive permanent directory indexing, inclusion in /llms.txt and /llms-full.txt for generative AI engines (ChatGPT, Claude, Perplexity), structured SoftwareApplication JSON-LD, and an algorithmic 7-day boost in the New & Rising feed.`,
  },
  {
    question: `What metadata is collected for AEO and GEO optimization?`,
    answer: `Submissions collect problem statements, technical solutions, unique value propositions, platform compatibility, and AI Context prompts to give answer engines precise citation data.`,
  },
] as const

const SubmitPage = async () => {
  let session = null
  let userAgent = ""
  try {
    const headerList = await headers()
    userAgent = headerList.get("user-agent") ?? ""
    session = await auth.api.getSession({
      headers: headerList,
    })
  } catch {
    session = null
  }

  const isBot = isCrawler(userAgent)

  if (!session?.user && !isBot) {
    redirect("/?redirect=/submit")
  }

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Submit", url: `${SITE_CONFIG.url}/submit` },
  ])

  const faqs = faqSchema(SUBMISSION_FAQS)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqs) }}
      />
      {session?.user ? <SubmitContent /> : <SubmitCrawlerView />}
    </>
  )
}

export default SubmitPage
