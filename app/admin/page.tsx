import type { Metadata } from "next"
import { headers } from "next/headers"
import { getAdminSession } from "@/lib/auth/admin"
import { AdminSubmissionsView } from "@/components/admin/admin-submissions-view"
import { AdminUnauthorized } from "@/components/admin/admin-unauthorized"
import { ADMIN_PRIMARY_EMAIL } from "@/constants/admin"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: `Admin Moderation Portal — ${SITE_CONFIG.name}`,
  description:
    "Administrator console for approving, rejecting, and managing pending user submissions for developer tools and products.",
  robots: {
    index: false,
    follow: false,
  },
}

const AdminPage = async () => {
  const reqHeaders = await headers()
  const { isAdmin, user } = await getAdminSession(reqHeaders)

  if (!isAdmin) {
    return (
      <AdminUnauthorized
        currentEmail={user?.email}
        isAuthenticated={Boolean(user)}
      />
    )
  }

  return (
    <AdminSubmissionsView
      adminEmail={user?.email || ADMIN_PRIMARY_EMAIL}
    />
  )
}

export default AdminPage
