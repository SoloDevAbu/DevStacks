import type { Metadata } from "next"
import { BuiltWithContent } from "@/components/built-with/built-with-content"
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { getBuilds } from "@/db/queries/builds/list"

export const metadata: Metadata = {
  title: "Built With — Real Projects Built With Modern Tools & APIs",
  description:
    `Explore real-world software products and developer showcases on ${SITE_CONFIG.name}. See what tools, databases, and APIs developers use to build.`,
  keywords: [
    "built with",
    "developer builds",
    "software tech stacks",
    "what developers are building",
    "developer showcase",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/built-with`,
  },
  openGraph: {
    title: `Built With — Projects & Tech Stacks | ${SITE_CONFIG.name}`,
    description:
      "Real-world products and software projects built with developer tools.",
    type: "website",
    url: `${SITE_CONFIG.url}/built-with`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Built With — Projects & Tech Stacks | ${SITE_CONFIG.name}`,
    description:
      "Real-world products and software projects built with developer tools.",
  },
}

export default async function BuiltWithPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Built With", url: `${SITE_CONFIG.url}/built-with` },
  ])

  let buildsList: Awaited<ReturnType<typeof getBuilds>> = []
  try {
    buildsList = await getBuilds({ limit: 20 })
  } catch {
    buildsList = []
  }

  const items = itemListSchema(
    (buildsList ?? []).map((b) => ({
      name: b.name,
      url: `${SITE_CONFIG.url}/showcase`,
      description: `${b.description} — Built with ${(b.builtWith ?? []).map((t) => t.name).join(", ")}`,
    }))
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(items) }}
      />
      <BuiltWithContent />
    </>
  )
}
