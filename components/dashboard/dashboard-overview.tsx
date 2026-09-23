"use client"

import Link from "next/link"
import {
  Heart,
  MessageSquare,
  Eye,
  Wrench,
  Package,
  TrendingUp,
  BarChart3,
  UserCog,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductLogo } from "@/components/shared/product-logo"
import { ROUTES } from "@/constants/routes"
import {
  dashboardMetricsGrid,
  dashboardMetricCell,
  dashboardSectionHeader,
  dashboardSectionTitle,
  dashboardPortalsContainer,
  dashboardPortalItem,
} from "@/utils/dashboard/styles"
import type { UserDashboardData } from "@/types/entities"

interface DashboardOverviewProps {
  data: UserDashboardData
}

export const DashboardOverview = ({ data }: DashboardOverviewProps) => {
  const { stats, tools, products, comments } = data

  const formatDate = (date?: Date | string) => {
    if (!date) return "Recently"
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* 1. High-Level Metrics Ribbon */}
      <div className={dashboardMetricsGrid}>
        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Total Likes
            </span>
            <Heart className="size-3.5 fill-rose-500/20 text-rose-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalUpvotesAndLikes.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Across tools & products
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Comments
            </span>
            <MessageSquare className="size-3.5 text-sky-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalComments.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Community feedback
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Directory Views
            </span>
            <Eye className="size-3.5 text-purple-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalViews.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Total impressions
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Ecosystem Builds
            </span>
            <TrendingUp className="size-3.5 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalBuilds.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">Powered projects</span>
          </div>
        </div>
      </div>

      {/* 2. Workspace Navigation Portals (Vertical, Dashed Separation) */}
      <div className={dashboardPortalsContainer}>
        {/* Products Portal */}
        <div className={dashboardPortalItem}>
          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200/80 bg-emerald-50 text-emerald-600">
              <Package className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={ROUTES.DASHBOARD_PRODUCTS}
                  className="text-sm font-bold text-slate-900 transition-colors hover:text-emerald-600"
                >
                  Products & Applications
                </Link>
                <Badge
                  variant="outline"
                  className="border-dashed bg-emerald-50/50 font-mono text-[10px] font-bold text-emerald-700"
                >
                  {products.length} Listed
                </Badge>
              </div>
              <p className="max-w-xl text-xs leading-relaxed text-slate-500">
                Showcase apps, edit details, upgrade tiers, or track individual
                performance.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
            <Button size="sm" variant="outline">
              <Link href={ROUTES.DASHBOARD_PRODUCTS}>
                <span>Manage Products</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Tools Portal */}
        <div className={dashboardPortalItem}>
          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-indigo-200/80 bg-indigo-50 text-indigo-600">
              <Wrench className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={ROUTES.DASHBOARD_TOOLS}
                  className="text-sm font-bold text-slate-900 transition-colors hover:text-indigo-600"
                >
                  Developer Tools & APIs
                </Link>
                <Badge
                  variant="outline"
                  className="border-dashed bg-indigo-50/50 font-mono text-[10px] font-bold text-indigo-700"
                >
                  {tools.length} Listed
                </Badge>
              </div>
              <p className="max-w-xl text-xs leading-relaxed text-slate-500">
                Manage developer tools, edit documentation, upgrade tiers, or
                view upvotes.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
            <Button size="sm" variant="outline">
              <Link href={ROUTES.DASHBOARD_TOOLS}>
                <span>Manage Tools</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Analytics Portal */}
        <div className={dashboardPortalItem}>
          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-purple-200/80 bg-purple-50 text-purple-600">
              <BarChart3 className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={ROUTES.DASHBOARD_ANALYTICS}
                  className="text-sm font-bold text-slate-900 transition-colors hover:text-purple-600"
                >
                  Full Analytics Matrix
                </Link>
                <Badge
                  variant="outline"
                  className="border-dashed bg-purple-50/50 font-mono text-[10px] font-bold text-purple-700"
                >
                  Live Insights
                </Badge>
              </div>
              <p className="max-w-xl text-xs leading-relaxed text-slate-500">
                Comparative traffic, click-through rates, verified visitors, and
                community reach.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
            <Button size="sm" variant="outline">
              <Link href={ROUTES.DASHBOARD_ANALYTICS}>
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Profile Settings */}
        <div className={dashboardPortalItem}>
          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-100 text-slate-700">
              <UserCog className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={ROUTES.DASHBOARD_PROFILE}
                  className="text-sm font-bold text-slate-900 transition-colors hover:text-slate-950"
                >
                  Maker Profile & Bio
                </Link>
                <Badge
                  variant="outline"
                  className="border-dashed bg-slate-100/50 font-mono text-[10px] font-bold text-slate-700"
                >
                  Settings
                </Badge>
              </div>
              <p className="max-w-xl text-xs leading-relaxed text-slate-500">
                Configure your public maker identity, bio, social links, and
                creator FAQs.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 border-dashed text-xs font-semibold text-slate-800 hover:bg-slate-100/80 hover:text-slate-950"
            >
              <Link href={ROUTES.DASHBOARD_PROFILE}>
                <span>Profile Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Recent Submissions Highlights */}
      <div className="grid grid-cols-1 divide-y border-b border-dashed border-border bg-white md:grid-cols-2 md:divide-x md:divide-y-0">
        {/* Recent Products Column */}
        <div className="flex flex-col">
          <div className={dashboardSectionHeader}>
            <div className="flex items-center gap-2">
              <Package className="size-3.5 text-emerald-600" />
              <h2 className={dashboardSectionTitle}>
                Recent Products ({products.length})
              </h2>
            </div>
            <Link
              href={ROUTES.DASHBOARD_PRODUCTS}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              View All
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No products showcased yet.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-dashed divide-border">
              {products.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <ProductLogo
                      text={p.name.slice(0, 2).toUpperCase()}
                      imageUrl={p.logoUrl}
                      alt={p.name}
                      className="size-9 shrink-0 rounded-lg border border-slate-200 text-xs shadow-2xs"
                    />
                    <div className="flex flex-col">
                      <Link
                        href={ROUTES.PRODUCT(p.slug)}
                        target="_blank"
                        className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-emerald-600"
                      >
                        <span>{p.name}</span>
                        <ExternalLink className="size-2.5 text-slate-400" />
                      </Link>
                      <span className="line-clamp-1 text-[11px] text-slate-500">
                        {p.tagline}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={ROUTES.DASHBOARD_PRODUCT_ANALYTICS(p.slug)}
                    className="shrink-0 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Analytics →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tools Column */}
        <div className="flex flex-col">
          <div className={dashboardSectionHeader}>
            <div className="flex items-center gap-2">
              <Wrench className="size-3.5 text-indigo-600" />
              <h2 className={dashboardSectionTitle}>
                Recent Tools ({tools.length})
              </h2>
            </div>
            <Link
              href={ROUTES.DASHBOARD_TOOLS}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>

          {tools.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No developer tools listed yet.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-dashed divide-border">
              {tools.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <ProductLogo
                      text={t.name.slice(0, 2).toUpperCase()}
                      imageUrl={t.logoUrl}
                      alt={t.name}
                      className="size-9 shrink-0 rounded-lg border border-slate-200 text-xs shadow-2xs"
                    />
                    <div className="flex flex-col">
                      <Link
                        href={ROUTES.TOOL(t.slug)}
                        target="_blank"
                        className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-indigo-600"
                      >
                        <span>{t.name}</span>
                        <ExternalLink className="size-2.5 text-slate-400" />
                      </Link>
                      <span className="line-clamp-1 text-[11px] text-slate-500">
                        {t.tagline}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={ROUTES.DASHBOARD_TOOL_ANALYTICS(t.slug)}
                    className="shrink-0 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Analytics →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Latest Comments Feedback Strip */}
      <div className={dashboardSectionHeader}>
        <div className="flex items-center gap-2">
          <MessageSquare className="size-3.5 text-sky-500" />
          <h2 className={dashboardSectionTitle}>
            Latest Community Feedback ({comments.length})
          </h2>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="border-b border-dashed border-border bg-white p-8 text-center text-xs text-slate-400">
          No feedback comments received yet.
        </div>
      ) : (
        <div className="flex flex-col divide-y border-b border-dashed border-border bg-white">
          {comments.slice(0, 5).map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col gap-2 p-5 transition-colors hover:bg-slate-50/40 md:px-8"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 border border-border">
                    {comment.authorImage ? (
                      <AvatarImage
                        src={comment.authorImage}
                        alt={comment.authorName || "User"}
                      />
                    ) : null}
                    <AvatarFallback className="bg-slate-900 text-[10px] text-white">
                      {(comment.authorName || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-slate-900">
                    {comment.authorName || "Anonymous Maker"}
                  </span>
                  <span className="text-slate-400">on</span>
                  <Badge
                    variant="outline"
                    className="border-dashed text-[10px] font-semibold"
                  >
                    {comment.targetName}
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="rounded-md border border-dashed border-border bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-700">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
