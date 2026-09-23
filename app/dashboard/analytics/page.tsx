import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getGlobalAnalytics } from "@/db/queries/analytics/get-global-analytics"
import { getCurrentUserProfile } from "@/db/queries/users/get-profile"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { GlobalAnalyticsView } from "@/components/dashboard/global-analytics-view"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { dashboardPageContainer } from "@/utils/dashboard/styles"

export const metadata: Metadata = {
  title: `Global Analytics — ${SITE_CONFIG.name}`,
  description:
    "Comprehensive audience, impressions, click-through rates, and community metrics across all your products and tools.",
  robots: {
    index: false,
    follow: false,
  },
}

const DashboardAnalyticsPage = async () => {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const [analyticsData, profile] = await Promise.all([
    getGlobalAnalytics(session.user.id),
    getCurrentUserProfile(session.user.id),
  ])

  return (
    <div className={dashboardPageContainer}>
      <DashboardNav activeTab="analytics" username={profile?.username} />
      <GlobalAnalyticsView data={analyticsData} />
    </div>
  )
}

export default DashboardAnalyticsPage
