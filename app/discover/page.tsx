import { redirect } from "next/navigation"
import { ROUTES } from "@/constants/routes"

const DiscoverPage = () => {
  redirect(ROUTES.DISCOVER_NEW_RISING)
}

export default DiscoverPage
