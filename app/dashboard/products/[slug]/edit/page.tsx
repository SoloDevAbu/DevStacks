import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getProductBySlug } from "@/db/queries/products/get"
import { ProductEditForm } from "@/components/dashboard/product-edit-form"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: `Edit Product — ${SITE_CONFIG.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

interface ProductEditPageProps {
  params: Promise<{ slug: string }>
}

const ProductEditPage = async ({ params }: ProductEditPageProps) => {
  const { slug } = await params
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  if (product.submitterId !== session.user.id) {
    redirect(ROUTES.DASHBOARD_PRODUCTS)
  }

  return <ProductEditForm product={product as any} />
}

export default ProductEditPage
