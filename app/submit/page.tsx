import { Suspense } from "react"
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
import { Spinner } from "@/components/ui/spinner"

export const metadata: Metadata = {
  title: "New Launch — Submit a Product or Developer Tool",
  description: `Launch your product, SaaS, developer tool, or API on ${SITE_CONFIG.name} in seconds with AI Autofill. Permanent indexing, verified dofollow backlinks, and structured discovery across Google, ChatGPT, Claude, and Perplexity.`,
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
    "ai autofill submit",
    "ai product submission",
    "instant saas launch",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/submit`,
  },
  openGraph: {
    title: `New Launch — Submit a Product or Developer Tool | ${SITE_CONFIG.name}`,
    description: `Launch your product, SaaS, developer tool, or API on ${SITE_CONFIG.name} in seconds with AI Autofill. Reach thousands of builders and AI search engines.`,
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
    description: `Launch your product, SaaS, developer tool, or API on ${SITE_CONFIG.name} in seconds with AI Autofill.`,
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

type SubmitPageProps = {
  searchParams?: Promise<{
    type?: string
    tool?: string
    toolSlug?: string
    url?: string
  }>
}

const SubmitPage = async (props: SubmitPageProps) => {
  const searchParams = props.searchParams ? await props.searchParams : undefined
  const initialType: "product" | "tool" =
    searchParams?.type === "tool" ? "tool" : "product"
  const toolSlugOrName = searchParams?.tool ?? searchParams?.toolSlug
  const initialUrl = searchParams?.url?.trim() || ""

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
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50/50 p-12 text-center">
              <Spinner className="size-8 text-slate-400" />
              <p className="text-sm text-slate-500">Loading submission studio...</p>
            </div>
          }
        >
          <SubmitContent
            initialType={initialType}
            initialTool={initialTool}
            initialUrl={initialUrl}
          />
        </Suspense>
      ) : (
        <SubmitCrawlerView initialUrl={initialUrl} />
      )}
    </>
  )
}

export default SubmitPage
