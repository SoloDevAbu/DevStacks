import { NextResponse } from "next/server"
import { getCategoryBySlug } from "@/db/queries/categories/list"
import { getProducts } from "@/db/queries/products/list"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { toAbsoluteUrl } from "@/utils/urls"
import { toIsoDate } from "@/utils/date"

export const revalidate = 86400

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return new NextResponse(
      `# 404 Not Found\n\nCategory "${slug}" does not exist on ${SITE_CONFIG.name}.`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    )
  }

  const productsList = await getProducts({
    category: category.slug,
    limit: 100,
  })
  const canonicalUrl = toAbsoluteUrl(ROUTES.PRODUCT_CATEGORY(category.slug))

  const productRows =
    productsList.length > 0
      ? productsList
          .map(
            (p) =>
              `- [${p.name}](${toAbsoluteUrl(ROUTES.PRODUCT(p.slug))}) — ${p.tagline} (${p.pricing}, ${p.likesCount} likes)`
          )
          .join("\n")
      : "No products currently listed in this category."

  const markdown = `# ${category.name} Products & Software — ${SITE_CONFIG.name}

> ${productsList.length} ${category.name} products launched on ${SITE_CONFIG.name}, ranked by community likes.

\`\`\`yaml
category: "${category.name}"
slug: "${category.slug}"
url: "${canonicalUrl}"
total_products: ${productsList.length}
updated: "${toIsoDate(new Date())}"
\`\`\`

## ${category.name} Products

${productRows}

## Machine & AI Discovery
- **Canonical HTML URL**: ${canonicalUrl}
- **Full LLM Corpus**: ${toAbsoluteUrl(ROUTES.LLMS_FULL_TXT)}
`

  return createMarkdownResponse(markdown, canonicalUrl)
}
