import type { Metadata } from "next"
import { BuiltWithContent } from "@/components/built-with/built-with-content"
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { getProducts } from "@/db/queries/products/list"

export const metadata: Metadata = {
  title: "Built With — Real Projects Built With Modern Tools & APIs",
  description:
    `Explore real-world software products and developer showcases on ${SITE_CONFIG.name}. See what tools, databases, and APIs developers use to build.`,
  keywords: [
    "built with",
    "developer products",
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

  let productsList: Awaited<ReturnType<typeof getProducts>> = []
  try {
    productsList = await getProducts({ limit: 20, sortBy: "recent" })
  } catch {
    productsList = []
  }

  const items = itemListSchema(
    (productsList ?? []).map((p) => ({
      name: p.name,
      url: `${SITE_CONFIG.url}/products/${p.slug}`,
      description: `${p.description}${
        p.builtWithTools && p.builtWithTools.length > 0
          ? ` — Built with ${p.builtWithTools.map((t) => t.name).join(", ")}`
          : ""
      }`,
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
