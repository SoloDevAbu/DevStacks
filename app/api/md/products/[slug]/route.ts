import { NextResponse } from "next/server"
import { getRelatedProducts } from "@/db/queries/products/get"
import { resolveProduct } from "@/lib/products/resolve-product"
import { getProductFaqs } from "@/db/queries/faqs/get-faqs"
import {
  generateProductMarkdown,
  createMarkdownResponse,
} from "@/lib/seo/markdown-twins"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const product = await resolveProduct(slug)

  if (!product) {
    return new NextResponse(
      `# 404 Not Found\n\nDeveloper product "${slug}" does not exist on ${SITE_CONFIG.name}.`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    )
  }

  const [customFaqs, relatedProducts] = await Promise.all([
    getProductFaqs(product.id),
    getRelatedProducts(product.categoryId, product.id, 4),
  ])

  const markdown = generateProductMarkdown({
    ...product,
    faqs: customFaqs.length > 0 ? customFaqs : null,
    relatedProducts: relatedProducts.map((p) => ({
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
    })),
  })
  return createMarkdownResponse(
    markdown,
    `${SITE_CONFIG.url}/products/${product.slug}`
  )
}
