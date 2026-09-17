import Link from "next/link"
import {
  LayoutDashboard,
  UserCog,
  ExternalLink,
  PlusCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"

interface DashboardNavProps {
  activeTab: "overview" | "profile"
  username?: string | null
}

export const DashboardNav = ({ activeTab, username }: DashboardNavProps) => {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden border-b border-dashed border-border bg-linear-to-b from-slate-50/80 via-white to-white px-6 pt-8 pb-0 md:px-8">
      {/* Subtle ambient gradient mesh for theme vibrancy */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-slate-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-1/4 size-64 rounded-full bg-indigo-200/20 blur-3xl" />

      {/* Top bar with Breadcrumbs & Action CTAs */}
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            {activeTab === "overview"
              ? "Maker Dashboard"
              : "Maker Profile Settings"}
          </h1>
          <p className="text-xs text-slate-500 md:text-sm">
            {activeTab === "overview"
              ? "Manage your published developer tools, applications, performance metrics, and community engagement."
              : "Configure your public developer identity, bio, social links, and maker FAQs."}
          </p>
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
      <div className="relative z-10 mt-6 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        <Link
          href={ROUTES.DASHBOARD}
          className={cn(
            "flex items-center gap-2 border-b-2 px-3.5 py-2.5 transition-colors -mb-px",
            activeTab === "overview"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
          )}
        >
          <LayoutDashboard className="size-3.5" />
          <span>Overview & Submissions</span>
        </Link>

        <Link
          href={ROUTES.DASHBOARD_PROFILE}
          className={cn(
            "flex items-center gap-2 border-b-2 px-3.5 py-2.5 transition-colors -mb-px",
            activeTab === "profile"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
          )}
        >
          <UserCog className="size-3.5" />
          <span>Profile Settings</span>
        </Link>
      </div>
    </div>
  )
}
