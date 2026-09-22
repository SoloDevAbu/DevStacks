"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  BarChart3,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
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
  upgradeBadge,
} from "@/utils/dashboard/styles"
import type { GlobalAnalyticsData } from "@/db/queries/analytics/get-global-analytics"

interface GlobalAnalyticsViewProps {
  data: GlobalAnalyticsData
}

export const GlobalAnalyticsView = ({ data }: GlobalAnalyticsViewProps) => {
  const [filterType, setFilterType] = useState<"all" | "products" | "tools">("all")

  const { stats, items, recentInteractions } = data

  const filteredItems = items.filter((item) => {
    if (filterType === "products") return item.itemType === "product"
    if (filterType === "tools") return item.itemType === "tool"
    return true
  })

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* 1. Global KPIs Ribbon */}
      <div className={dashboardMetricsGrid}>
        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Total Page Views
            </span>
            <Eye className="size-3.5 text-purple-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalViews.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Across all listings
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Likes & Upvotes
            </span>
            <Heart className="size-3.5 fill-rose-500/20 text-rose-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalLikesAndUpvotes.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Community endorsements
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Total Comments
            </span>
            <MessageSquare className="size-3.5 text-sky-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalComments.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Feedback received
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              External Visits
            </span>
            <TrendingUp className="size-3.5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalExternalVisits.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Outbound website clicks
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Outbound CTR
            </span>
            <Sparkles className="size-3.5 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.overallCtr}%
            </span>
            <span className="text-[11px] text-slate-500">
              Click-through conversion
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Active Submissions
            </span>
            <Layers className="size-3.5 text-indigo-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalItems}
            </span>
            <span className="text-[11px] text-slate-500">
              {stats.totalProducts} products, {stats.totalTools} tools
            </span>
          </div>
        </div>
      </div>

      {/* 2. Comparative Submissions Performance Matrix */}
      <div className={dashboardSectionHeader}>
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-indigo-600" />
          <h2 className={dashboardSectionTitle}>
            Submissions Breakdown & Performance
          </h2>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-xs shadow-2xs">
          <button
            onClick={() => setFilterType("all")}
            className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors ${
              filterType === "all"
                ? "bg-slate-900 font-semibold text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilterType("products")}
            className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors ${
              filterType === "products"
                ? "bg-emerald-600 font-semibold text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Products ({stats.totalProducts})
          </button>
          <button
            onClick={() => setFilterType("tools")}
            className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors ${
              filterType === "tools"
                ? "bg-indigo-600 font-semibold text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tools ({stats.totalTools})
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y border-b border-dashed border-border bg-white">
        {filteredItems.map((item) => {
          const isProduct = item.itemType === "product"
          const analyticsLink = isProduct
            ? ROUTES.DASHBOARD_PRODUCT_ANALYTICS(item.slug)
            : ROUTES.DASHBOARD_TOOL_ANALYTICS(item.slug)

          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 px-6 py-4.5 transition-colors hover:bg-slate-50/50 md:flex-row md:items-center md:justify-between md:px-8"
            >
              <div className="flex items-center gap-3">
                <ProductLogo
                  text={item.name.slice(0, 2).toUpperCase()}
                  imageUrl={item.logoUrl}
                  alt={item.name}
                  className="size-10 shrink-0 rounded-lg border border-slate-200 text-xs shadow-2xs"
                />

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Link
                      href={analyticsLink}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {item.name}
                    </Link>

                    <Badge
                      variant="outline"
                      className="border-dashed text-[10px] font-semibold uppercase text-slate-500"
                    >
                      {item.itemType}
                    </Badge>

                    <Badge variant="outline" className={upgradeBadge(item.tier)}>
                      {item.tier}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Performance numbers */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    Views
                  </span>
                  <span className="font-bold text-slate-900">
                    {item.viewsCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    Likes
                  </span>
                  <span className="font-bold text-rose-600">
                    {item.likesCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    Comments
                  </span>
                  <span className="font-bold text-sky-600">
                    {item.commentsCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    Visits
                  </span>
                  <span className="font-bold text-emerald-600">
                    {item.externalVisitsCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    CTR
                  </span>
                  <span className="font-bold text-slate-900">{item.ctr}%</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 border-slate-200 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  render={<Link href={analyticsLink} />}
                >
                  <span>Details</span>
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Recent Activity Stream */}
      {recentInteractions.length > 0 && (
        <>
          <div className={dashboardSectionHeader}>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <h2 className={dashboardSectionTitle}>
                Recent Community Interactions
              </h2>
            </div>
          </div>

          <div className="flex flex-col divide-y border-b border-dashed border-border bg-white">
            {recentInteractions.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between gap-3 px-6 py-3.5 transition-colors hover:bg-slate-50/50 md:px-8"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-7 border border-border">
                    {act.user?.image ? (
                      <AvatarImage src={act.user.image} alt={act.user.name} />
                    ) : null}
                    <AvatarFallback className="bg-slate-900 text-[10px] text-white">
                      {act.user?.name ? act.user.name.slice(0, 2).toUpperCase() : "CM"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-slate-900">
                      {act.user?.name || "Community Member"}
                    </span>
                    <span className="text-slate-500">
                      {act.type === "like"
                        ? `liked your ${act.itemType}`
                        : `commented on your ${act.itemType}`}
                    </span>
                    <Link
                      href={
                        act.itemType === "product"
                          ? ROUTES.PRODUCT(act.itemSlug)
                          : ROUTES.TOOL(act.itemSlug)
                      }
                      target="_blank"
                      className="font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      {act.itemName}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="size-3" />
                  <span>{formatDate(act.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
