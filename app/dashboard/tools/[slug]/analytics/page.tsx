import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getToolAnalytics } from "@/db/queries/analytics/get-item-analytics"
import { SingleItemAnalytics } from "@/components/dashboard/single-item-analytics"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: `Tool Analytics — ${SITE_CONFIG.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

interface ToolAnalyticsPageProps {
  params: Promise<{ slug: string }>
}

const ToolAnalyticsPage = async ({ params }: ToolAnalyticsPageProps) => {
  const { slug } = await params
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const analyticsData = await getToolAnalytics(slug, session.user.id)

  if (!analyticsData) {
    notFound()
  }

  return <SingleItemAnalytics data={analyticsData} />
}

export default ToolAnalyticsPage
