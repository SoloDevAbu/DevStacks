import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { CategoriesSearch } from "@/components/shared/categories-search"
import { breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { ToolsDirectoryContent } from "./tools-content"

export const metadata: Metadata = {
  title: "Developer Tools Directory — APIs, Infrastructure & SDKs",
  description: `Browse the complete directory of developer tools, APIs, and infrastructure on ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools`,
  },
}

export default async function ToolsPage(props: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const q = searchParams?.q

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
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
            category ? `${category} Developer Tools` : "Developer Tools Directory"
          }
          description={
            category
              ? `Browse all verified developer tools, APIs, and infrastructure in the ${category} category.`
              : "Browse the complete directory of developer tools, APIs, and infrastructure."
          }
          aiPrompt={AI_PROMPTS.tools}
        />

        <CategoriesSearch baseRoute={ROUTES.TOOLS} />

        <ToolsDirectoryContent initialCategory={category} initialQuery={q} />
      </div>
    </>
  )
}
