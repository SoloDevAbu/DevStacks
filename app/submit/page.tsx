import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { SubmitContent } from "@/components/submit/submit-content"
import { SubmitCrawlerView } from "@/components/submit/submit-crawler-view"
import { SITE_CONFIG } from "@/constants/site"
import { breadcrumbSchema, faqSchema, safeJsonLd } from "@/lib/seo/schema"
import { getToolBySlugOrName } from "@/db/queries/tools/get"
import type { BuiltWithToolItem } from "@/components/shared/built-with-tools-input"
import { SUBMISSION_FAQS } from "@/constants/submit"

export const metadata: Metadata = {
  title: "New Launch — Submit a Product or Developer Tool",
  description: `Launch your product, SaaS, developer tool, or API on ${SITE_CONFIG.name} for the community and AI models to discover. Includes structured SEO, AEO, GEO, and ASO metadata.`,
  keywords: [
    "submit product",
    "launch product",
    "submit developer tool",
    "launch dev tool",
    "list developer tool",
    "submit API",
    "developer tool directory",
    "devtools submission",
    "promote dev tools",
    "developer platform discovery",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/submit`,
  },
  openGraph: {
    title: `New Launch — Submit a Product or Developer Tool | ${SITE_CONFIG.name}`,
    description: `Launch your product, SaaS, developer tool, or API on ${SITE_CONFIG.name} to reach thousands of builders.`,
    type: "website",
    url: `${SITE_CONFIG.url}/submit`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Launch on ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `New Launch — Submit a Product or Developer Tool | ${SITE_CONFIG.name}`,
    description: `Launch your product, SaaS, developer tool, or API on ${SITE_CONFIG.name}.`,
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

type SubmitPageProps = {
  searchParams?: Promise<{ type?: string; tool?: string; toolSlug?: string }>
}

const SubmitPage = async (props: SubmitPageProps) => {
  const searchParams = props.searchParams ? await props.searchParams : undefined
  const initialType: "product" | "tool" =
    searchParams?.type === "tool" ? "tool" : "product"
  const toolSlugOrName = searchParams?.tool ?? searchParams?.toolSlug

  let session = null
  try {
    const headerList = await headers()
    session = await auth.api.getSession({
      headers: headerList,
    })
  } catch {
    session = null
  }

  let initialTool: BuiltWithToolItem | null = null
  if (toolSlugOrName) {
    const foundTool = await getToolBySlugOrName(toolSlugOrName)
    if (foundTool) {
      initialTool = {
        name: foundTool.name,
        toolSlug: foundTool.slug,
        toolId: foundTool.id,
      }
    } else {
      initialTool = {
        name: toolSlugOrName.trim(),
      }
    }
  }

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "New Launch", url: `${SITE_CONFIG.url}/submit` },
  ])

  const faqs = faqSchema(SUBMISSION_FAQS)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqs) }}
      />
      {session?.user ? (
        <SubmitContent initialType={initialType} initialTool={initialTool} />
      ) : (
        <SubmitCrawlerView />
      )}
    </>
  )
}

export default SubmitPage
