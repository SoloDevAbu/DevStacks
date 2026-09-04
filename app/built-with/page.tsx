import type { Metadata } from "next"
import { BuiltWithContent } from "@/components/built-with/built-with-content"
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { BUILDING_BLOCKS } from "@/constants/products"

export const metadata: Metadata = {
  title: "Built With — Developer Products & Tools Directory",
  description:
    "Explore developer tools and APIs ranked by how many real-world projects have been built with them. Find battle-tested infrastructure, databases, and authentication solutions.",
  keywords: [
    "built with",
    "developer tools ranking",
    "most used APIs",
    "popular developer infrastructure",
    "developer ecosystem",
    "tech stack building blocks",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/built-with`,
  },
  openGraph: {
    title: `Built With — Developer Products Directory | ${SITE_CONFIG.name}`,
    description:
      "Developer tools and APIs ranked by number of projects built with them.",
    type: "website",
    url: `${SITE_CONFIG.url}/built-with`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Built With — Developer Products Directory | ${SITE_CONFIG.name}`,
    description:
      "Developer tools and APIs ranked by number of projects built with them.",
  },
}

export default function BuiltWithPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Built With", url: `${SITE_CONFIG.url}/built-with` },
  ])

  const items = itemListSchema(
    BUILDING_BLOCKS.map((b) => ({
      name: b.name,
      url: `${SITE_CONFIG.url}/products/${b.name.toLowerCase().replace(/\s+/g, "-")}`,
      description: `${b.category} - Used in ${b.builds} verified projects`,
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
