import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { ShowcaseContent } from "@/components/showcase/showcase-content"
import { ShowcaseCrawlerView } from "@/components/showcase/showcase-crawler-view"
import { SITE_CONFIG } from "@/constants/site"
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { getToolBySlugOrName } from "@/db/queries/tools/get"
import type { BuiltWithToolItem } from "@/components/shared/built-with-tools-input"

export const metadata: Metadata = {
  title: "Showcase Your Build — Developer Tech Stacks & Architecture",
  description: `Share what you have built with developer tools and APIs on ${SITE_CONFIG.name}. Inspire engineers with your tech stack, architectural decisions, and production workflows.`,
  keywords: [
    "showcase build",
    "developer showcase",
    "built with developer tools",
    "share project",
    "tech stack breakdown",
    "open source showcases",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/showcase`,
  },
  openGraph: {
    title: `Showcase Your Build | ${SITE_CONFIG.name}`,
    description:
      "Share what you have built with developer tools and APIs. Inspire the developer ecosystem.",
    type: "website",
    url: `${SITE_CONFIG.url}/showcase`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Showcase on ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Showcase Your Build | ${SITE_CONFIG.name}`,
    description: "Share what you have built with developer tools and APIs.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const SHOWCASE_FAQS = [
  {
    question: `What is a Developer Build Showcase on ${SITE_CONFIG.name}?`,
    answer: `A Build Showcase is a transparent architectural breakdown of what you built and the specific developer tools, APIs, and databases you used to build it.`,
  },
  {
    question: `Where does my showcase appear across the platform?`,
    answer: `Your showcase appears on the main Showcase gallery and is cross-referenced on the dedicated detail pages of every tool in your tech stack under 'Products Built With'.`,
  },
] as const

type ShowcasePageProps = {
  searchParams?: Promise<{ tool?: string; toolSlug?: string }>
}

const ShowcasePage = async (props: ShowcasePageProps) => {
  const searchParams = props.searchParams ? await props.searchParams : undefined
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
    { name: "Showcase", url: `${SITE_CONFIG.url}/showcase` },
  ])

  const faqs = faqSchema(SHOWCASE_FAQS)

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
      {session?.user ? (
        <ShowcaseContent initialTool={initialTool} />
      ) : (
        <ShowcaseCrawlerView />
      )}
    </>
  )
}

export default ShowcasePage
