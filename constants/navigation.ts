import {
  Home,
  Wrench,
  Package,
  TrendingUp,
  Users,
  BookOpen,
  CalendarDays,
  LayoutGrid,
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
        name: "Weekly Launches",
        icon: CalendarDays,
        href: ROUTES.DISCOVER_WEEKLY_LAUNCHES,
      },
      { name: "Products", icon: Package, href: ROUTES.PRODUCTS },
      {
        name: "Tools Directory",
        icon: Wrench,
        href: ROUTES.TOOLS,
      },
      {
        name: "Categories",
        icon: LayoutGrid,
        href: ROUTES.TOOL_CATEGORIES,
      },
      {
        name: "Trending",
        icon: TrendingUp,
        href: ROUTES.TRENDING,
        badge: { text: "HOT", variant: "hot" },
      },
      {
        name: "Launch Stories",
        icon: BookOpen,
        href: ROUTES.BLOG,
        badge: { text: "NEW", variant: "new" },
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        name: "Makers",
        icon: Users,
        href: ROUTES.MAKERS,
      },
    ],
  },
]

export const QUICK_STACK_COUNT = 6

export type QuickStack = { name: string; slug: string }

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

export type FooterColumn = {
  heading: string
  links: ReadonlyArray<{ label: string; href: string }>
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "Discover",
    links: [
      { label: "This Week's Launches", href: ROUTES.HOME },
      { label: "Weekly Launch Archive", href: ROUTES.DISCOVER_WEEKLY_LAUNCHES },
      { label: "Trending", href: ROUTES.TRENDING },
      { label: "Tools Directory", href: ROUTES.TOOLS },
      { label: "Tool Categories", href: ROUTES.TOOL_CATEGORIES },
      { label: "Products Directory", href: ROUTES.PRODUCTS },
      { label: "Product Categories", href: ROUTES.PRODUCT_CATEGORIES },
      { label: "Building Blocks", href: ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS },
      { label: "Makers", href: ROUTES.MAKERS },
    ],
  },
  {
    heading: "Launch",
    links: [
      { label: "Launch Your Product", href: ROUTES.SUBMIT_PRODUCT },
      { label: "Launch a Dev Tool", href: ROUTES.SUBMIT_TOOL },
      { label: "Product Launch Platform", href: ROUTES.PRODUCT_LAUNCH_PLATFORM },
      { label: "SaaS Directory", href: ROUTES.SAAS_DIRECTORY },
      { label: "Pricing & Sponsorship", href: ROUTES.PRICING },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Launch Stories", href: ROUTES.BLOG },
      { label: "Where to Launch Dev Tools", href: ROUTES.GUIDE_LAUNCH_DEVTOOLS },
      { label: "Free SaaS Directories", href: ROUTES.GUIDE_SAAS_DIRECTORIES },
      { label: "Product Hunt Alternatives", href: ROUTES.PRODUCTHUNT_ALTERNATIVES },
      { label: "FAQ", href: ROUTES.FAQ },
    ],
  },
  {
    heading: "Compare",
    links: [
      { label: "LaunchNests vs Product Hunt", href: ROUTES.PRODUCTHUNT_ALTERNATIVE },
      { label: "Uneed Alternative", href: ROUTES.UNEED_ALTERNATIVE },
      { label: "MicroLaunch Alternative", href: ROUTES.MICROLAUNCH_ALTERNATIVE },
      { label: "BetaList Alternative", href: ROUTES.BETALIST_ALTERNATIVE },
      { label: "DevHunt Alternative", href: ROUTES.DEVHUNT_ALTERNATIVE },
      { label: "CodeHype Alternative", href: ROUTES.CODEHYPE_ALTERNATIVE },
    ],
  },
  {
    heading: "For Agents",
    links: [
      { label: "llms.txt", href: ROUTES.LLMS_TXT },
      { label: "MCP Server", href: "/mcp" },
      { label: "Public REST API", href: "/cli" },
      { label: "Markdown Catalog", href: ROUTES.MARKDOWN_CATALOG },
    ],
  },
]
