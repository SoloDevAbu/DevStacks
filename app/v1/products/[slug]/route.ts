import { NextResponse } from "next/server"
import { resolveProduct } from "@/lib/products/resolve-product"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 3600

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const product = await resolveProduct(slug)

  if (!product) {
    return NextResponse.json(
      {
        type: `${SITE_CONFIG.url}/errors/not-found`,
        title: "Product Not Found",
        status: 404,
        detail: `Product '${slug}' was not found in the catalog.`,
      },
      {
        status: 404,
        headers: {
          "Content-Type": "application/problem+json",
        },
      }
    )
  }

  return NextResponse.json(
    { data: product },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    }
  )
}
