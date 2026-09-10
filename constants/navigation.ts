import {
  Home,
  Wrench,
  Package,
  TrendingUp,
  PlusCircle,
  type LucideIcon,
} from "lucide-react"
import { ROUTES } from "@/constants/routes"

export type NavItemBadge = {
  text: string
  variant: "hot" | "new" | "neutral"
}

export type NavItem = {
  name: string
  icon: LucideIcon
  href: string
  badge?: NavItemBadge
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
      {
        name: "Tools Directory",
        icon: Wrench,
        href: ROUTES.TOOLS,
        badge: { text: "API", variant: "neutral" },
      },
      { name: "Products", icon: Package, href: ROUTES.PRODUCTS },
      {
        name: "Trending Stacks",
        icon: TrendingUp,
        href: ROUTES.TRENDING,
        badge: { text: "HOT", variant: "hot" },
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        name: "Showcase a Build",
        icon: PlusCircle,
        href: ROUTES.SHOWCASE,
        badge: { text: "NEW", variant: "new" },
      },
    ],
  },
]

export const QUICK_STACKS = [
  { name: "AI & LLMs", href: "/tools?category=AI" },
  { name: "Database", href: "/tools?category=Database" },
  { name: "Auth", href: "/tools?category=Auth" },
  { name: "DevOps", href: "/tools?category=DevOps" },
  { name: "Frontend", href: "/tools?category=Frontend" },
] as const

export const FEATURED_SPOTLIGHT = {
  name: "Supernova",
  slug: "supernova",
  tagline: "Design system manager for scaling UI components across teams",
  category: "Design System",
  upvotesCount: 389,
  buildsCount: 112,
  pricing: "Freemium",
  verified: true,
  url: "https://supernova.io",
} as const

export const TRENDING_DEVTOOLS = [
  {
    name: "Supabase",
    slug: "supabase",
    category: "BaaS & Postgres",
    buildsCount: 82,
    upvotesCount: 3840,
    letter: "S",
    color: "border-emerald-200 bg-emerald-100 text-emerald-800",
  },
  {
    name: "Vercel",
    slug: "vercel",
    category: "Hosting & Edge",
    buildsCount: 68,
    upvotesCount: 3120,
    letter: "V",
    color: "border-slate-800 bg-slate-900 text-white",
  },
  {
    name: "BetterAuth",
    slug: "betterauth",
    category: "Auth & Security",
    buildsCount: 28,
    upvotesCount: 1420,
    letter: "B",
    color: "border-blue-200 bg-blue-100 text-blue-700",
  },
  {
    name: "PostHog",
    slug: "posthog",
    category: "Product Analytics",
    buildsCount: 44,
    upvotesCount: 2150,
    letter: "P",
    color: "border-amber-200 bg-amber-100 text-amber-800",
  },
] as const

