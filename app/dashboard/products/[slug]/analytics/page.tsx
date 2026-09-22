import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getProductAnalytics } from "@/db/queries/analytics/get-item-analytics"
import { SingleItemAnalytics } from "@/components/dashboard/single-item-analytics"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: `Product Analytics — ${SITE_CONFIG.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

interface ProductAnalyticsPageProps {
  params: Promise<{ slug: string }>
}

const ProductAnalyticsPage = async ({ params }: ProductAnalyticsPageProps) => {
  const { slug } = await params
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const analyticsData = await getProductAnalytics(slug, session.user.id)

  if (!analyticsData) {
    notFound()
  }

  return <SingleItemAnalytics data={analyticsData} />
}

export default ProductAnalyticsPage
