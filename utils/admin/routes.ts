import { ROUTES } from "@/constants/routes"

export const isAdminRoute = (pathname: string): boolean =>
  pathname === ROUTES.ADMIN || pathname.startsWith(`${ROUTES.ADMIN}/`)
