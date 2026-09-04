import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ShowcaseContent } from "@/components/showcase/showcase-content"
import { SITE_CONFIG } from "@/constants/site"
import { breadcrumbSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "Showcase Your Build",
  description:
    "Share what you've built with developer tools and APIs. Inspire other developers by showing your tech stack, architecture, and developer workflows.",
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
      "Share what you've built with developer tools and APIs. Inspire the developer ecosystem.",
    type: "website",
    url: `${SITE_CONFIG.url}/showcase`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Showcase Your Build | ${SITE_CONFIG.name}`,
    description: "Share what you've built with developer tools and APIs.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const ShowcasePage = async () => {
  let session = null
  try {
    const headerList = await headers()
    session = await auth.api.getSession({
      headers: headerList,
    })
  } catch {
    session = null
  }

  if (!session?.user) {
    redirect("/?redirect=/showcase")
  }

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Showcase", url: `${SITE_CONFIG.url}/showcase` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ShowcaseContent />
    </>
  )
}

export default ShowcasePage
