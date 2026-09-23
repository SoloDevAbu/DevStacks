import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  Wrench,
  BarChart3,
  UserCog,
  ExternalLink,
  PlusCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/routes"
import {
  dashboardNavWrapper,
  dashboardNavTabsContainer,
  dashboardNavTab,
} from "@/utils/dashboard/styles"

export type DashboardTab =
  | "overview"
  | "products"
  | "tools"
  | "analytics"
  | "profile"

interface DashboardNavProps {
  activeTab: DashboardTab
  username?: string | null
  title?: string
  subtitle?: string
}

const TAB_TITLES: Record<DashboardTab, { title: string; subtitle: string }> = {
  overview: {
    title: "Maker Dashboard",
    subtitle:
      "High-level metrics, launch performance, and quick access to your products and developer tools.",
  },
  products: {
    title: "My Products & Applications",
    subtitle:
      "Manage all your showcased products, inspect performance metrics, modify content, or upgrade tiers.",
  },
  tools: {
    title: "My Developer Tools & APIs",
    subtitle:
      "Manage listed developer tools, track adoption, update documentation, or upgrade tiers.",
  },
  analytics: {
    title: "Performance & Audience Analytics",
    subtitle:
      "Full analytics across all your products and tools: views, likes, comments, and external link clicks.",
  },
  profile: {
    title: "Maker Profile Settings",
    subtitle:
      "Configure your public developer identity, bio, country, social handles, and maker FAQs.",
  },
}

export const DashboardNav = ({
  activeTab,
  username,
  title,
  subtitle,
}: DashboardNavProps) => {
  const currentInfo = TAB_TITLES[activeTab] || TAB_TITLES.overview
  const displayTitle = title || currentInfo.title
  const displaySubtitle = subtitle || currentInfo.subtitle

  return (
    <div className={dashboardNavWrapper}>
      {/* Subtle ambient gradient mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-slate-200/30 blur-3xl" />
        <div className="absolute top-0 right-1/4 size-64 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>

      {/* Top bar with Breadcrumbs & Action CTAs */}
      <div className="relative z-10 flex flex-col gap-4 px-6 pt-8 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-widest text-[#a06138] uppercase">
              Creator Workspace
            </span>
            <Badge
              variant="outline"
              className="border-dashed border-emerald-200 bg-emerald-50/80 font-mono text-[10px] font-bold text-emerald-700"
            >
              Live Metrics
            </Badge>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            {displayTitle}
          </h1>
          <p className="text-xs text-slate-500 md:text-sm">{displaySubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:self-start">
          {username && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-dashed text-xs font-medium text-slate-700"
              render={<Link href={ROUTES.MAKER(username)} target="_blank" />}
            >
              <ExternalLink className="size-3.5 text-slate-400" />
              <span>Public Profile</span>
            </Button>
          )}
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
            render={<Link href={ROUTES.SUBMIT} />}
          >
            <PlusCircle className="size-3.5" />
            <span>Add Tool</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            render={<Link href={ROUTES.SHOWCASE} />}
          >
            <Sparkles className="size-3.5 text-amber-500" />
            <span>Submit Product</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className={dashboardNavTabsContainer}>
        <Link
          href={ROUTES.DASHBOARD}
          className={dashboardNavTab(activeTab === "overview")}
        >
          <LayoutDashboard className="size-3.5" />
          <span>Overview</span>
        </Link>

        <Link
          href={ROUTES.DASHBOARD_PRODUCTS}
          className={dashboardNavTab(activeTab === "products")}
        >
          <Package className="size-3.5" />
          <span>Products</span>
        </Link>

        <Link
          href={ROUTES.DASHBOARD_TOOLS}
          className={dashboardNavTab(activeTab === "tools")}
        >
          <Wrench className="size-3.5" />
          <span>Tools</span>
        </Link>

        <Link
          href={ROUTES.DASHBOARD_ANALYTICS}
          className={dashboardNavTab(activeTab === "analytics")}
        >
          <BarChart3 className="size-3.5" />
          <span>Analytics</span>
        </Link>

        <Link
          href={ROUTES.DASHBOARD_PROFILE}
          className={dashboardNavTab(activeTab === "profile")}
        >
          <UserCog className="size-3.5" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  )
}
