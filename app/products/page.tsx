import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { CategoriesSearch } from "@/components/shared/categories-search"
import { breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { ProductsDirectoryContent } from "./products-content"

export const metadata: Metadata = {
  title: "Complete Product Directory — Developer Tools & Software",
  description: `Browse the complete directory of developer tools, APIs, and software products on ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/products`,
  },
}

export default async function ProductsPage(props: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const q = searchParams?.q

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Products", url: `${SITE_CONFIG.url}/products` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading={
            category ? `${category} Tools & Products` : "Products Directory"
          }
          description={
            category
              ? `Browse all verified developer tools and products in the ${category} category.`
              : "Browse the complete directory of developer tools, APIs, and software products."
          }
          aiPrompt={AI_PROMPTS.products}
        />

        <CategoriesSearch />

        <ProductsDirectoryContent initialCategory={category} initialQuery={q} />
      </div>
    </>
  )
}
