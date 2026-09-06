import {
  Home,
  Wrench,
  Package,
  TrendingUp,
  PlusCircle,
  type LucideIcon,
} from "lucide-react"
import { ROUTES } from "@/constants/routes"

export type NavItem = {
  name: string
  icon: LucideIcon
  href: string
}

export type NavSection = {
  label: string
  items: NavItem[]
}

export const SIDEBAR_NAV: NavSection[] = [
  {
    label: "Explore",
    items: [
      { name: "Home", icon: Home, href: ROUTES.HOME },
      { name: "Tools", icon: Wrench, href: ROUTES.TOOLS },
      { name: "Products", icon: Package, href: ROUTES.PRODUCTS },
      { name: "Trending", icon: TrendingUp, href: ROUTES.TRENDING },
    ],
  },
  {
    label: "Community",
    items: [
      { name: "Showcase a Build", icon: PlusCircle, href: ROUTES.SHOWCASE },
    ],
  },
]
