import {
  Home,
  Wrench,
  Package,
  TrendingUp,
  Grid,
  Blocks,
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
      { name: "Categories", icon: Grid, href: ROUTES.CATEGORIES },
    ],
  },
  {
    label: "Ecosystem",
    items: [{ name: "Built With", icon: Blocks, href: ROUTES.BUILT_WITH }],
  },
  {
    label: "Community",
    items: [
      { name: "Showcase a Build", icon: PlusCircle, href: ROUTES.SHOWCASE },
    ],
  },
]
