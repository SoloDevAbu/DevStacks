import type { Metadata } from "next"
import { headers } from "next/headers"
import { getAdminSession } from "@/lib/auth/admin"
import { AdminReviewTable } from "@/components/admin/admin-review-table"
import { AdminUnauthorized } from "@/components/admin/admin-unauthorized"
import { SITE_CONFIG } from "@/constants/site"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `Admin Reviews & Launch Blog Approvals | ${SITE_CONFIG.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  const reqHeaders = await headers()
  const { isAdmin } = await getAdminSession(reqHeaders)

  if (!isAdmin) {
    return <AdminUnauthorized />
  }

  return <AdminReviewTable />
}

