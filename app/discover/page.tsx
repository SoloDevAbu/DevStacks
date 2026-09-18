import { redirect } from "next/navigation"
import { ROUTES } from "@/constants/routes"

const DiscoverPage = () => {
  redirect(ROUTES.DISCOVER_WEEKLY_LAUNCHES)
}

export default DiscoverPage
