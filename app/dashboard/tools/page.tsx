import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getUserTools } from "@/db/queries/users/get-user-tools"
import { getCurrentUserProfile } from "@/db/queries/users/get-profile"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ToolsList } from "@/components/dashboard/tools-list"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { dashboardPageContainer } from "@/utils/dashboard/styles"

export const metadata: Metadata = {
  title: `My Developer Tools — ${SITE_CONFIG.name}`,
  description:
    "Manage and track metrics for your published developer tools, APIs, and libraries.",
  robots: {
    index: false,
    follow: false,
  },
}

const DashboardToolsPage = async () => {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const [tools, profile] = await Promise.all([
    getUserTools(session.user.id),
    getCurrentUserProfile(session.user.id),
  ])

  return (
    <div className={dashboardPageContainer}>
      <DashboardNav activeTab="tools" username={profile?.username} />
      <ToolsList tools={tools} />
    </div>
  )
}

export default DashboardToolsPage
