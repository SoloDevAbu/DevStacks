import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getUserDashboardData } from "@/db/queries/users/get-dashboard"
import { getCurrentUserProfile } from "@/db/queries/users/get-profile"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: `Maker Dashboard — ${SITE_CONFIG.name}`,
  description:
    "Track your published developer tools, products, upvotes, comments, views, and submission statuses.",
  robots: {
    index: false,
    follow: false,
  },
}

const DashboardPage = async () => {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const [dashboardData, profile] = await Promise.all([
    getUserDashboardData(session.user.id),
    getCurrentUserProfile(session.user.id),
  ])

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <DashboardNav activeTab="overview" username={profile?.username} />
      <DashboardContent data={dashboardData} />
    </div>
  )
}

export default DashboardPage
