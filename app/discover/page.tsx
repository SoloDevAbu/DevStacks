import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ROUTES } from "@/constants/routes"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
}

const DiscoverPage = () => {
  redirect(ROUTES.DISCOVER_WEEKLY_LAUNCHES)
}

export default DiscoverPage
