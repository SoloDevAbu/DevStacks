import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getUserProducts } from "@/db/queries/users/get-user-products"
import { getCurrentUserProfile } from "@/db/queries/users/get-profile"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ProductsList } from "@/components/dashboard/products-list"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { dashboardPageContainer } from "@/utils/dashboard/styles"

export const metadata: Metadata = {
  title: `My Products — ${SITE_CONFIG.name}`,
  description:
    "Manage and track performance for your showcased developer products and applications.",
  robots: {
    index: false,
    follow: false,
  },
}

const DashboardProductsPage = async () => {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const [products, profile] = await Promise.all([
    getUserProducts(session.user.id),
    getCurrentUserProfile(session.user.id),
  ])

  return (
    <div className={dashboardPageContainer}>
      <DashboardNav activeTab="products" username={profile?.username} />
      <ProductsList products={products} />
    </div>
  )
}

export default DashboardProductsPage
