"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Eye,
  Heart,
  ArrowBigUp,
  MessageSquare,
  TrendingUp,
  ExternalLink,
  Users,
  Calendar,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"
import { ProductLogo } from "@/components/shared/product-logo"
import { ROUTES } from "@/constants/routes"
import {
  dashboardPageContainer,
  dashboardMetricsGrid,
  dashboardMetricCell,
  upgradeBadge,
  analyticsTabTrigger,
  visitorItemRow,
} from "@/utils/dashboard/styles"
import type { SingleItemAnalyticsData } from "@/db/queries/analytics/get-item-analytics"

interface SingleItemAnalyticsProps {
  data: SingleItemAnalyticsData
}

export const SingleItemAnalytics = ({ data }: SingleItemAnalyticsProps) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "likes" | "comments" | "visits"
  >("likes")

  const { item, stats, whoLiked, comments, visitors } = data
  const isProduct = item.itemType === "product"
  const likeLabel = isProduct ? "Likes" : "Upvotes"
  const LikeIcon = isProduct ? Heart : ArrowBigUp

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date))
  }

  const backRoute = isProduct
    ? ROUTES.DASHBOARD_PRODUCTS
    : ROUTES.DASHBOARD_TOOLS

  return (
    <div className={dashboardPageContainer}>
      {/* Top Breadcrumb & Item Hero Strip */}
      <div className="flex flex-col gap-4 border-b border-dashed border-border bg-white px-6 py-6 md:px-8">
        <div className="flex items-center gap-2 text-xs">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-slate-600 hover:text-slate-900"
            render={<Link href={backRoute} />}
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to {isProduct ? "Products" : "Tools"}</span>
          </Button>
          <span className="text-slate-300">/</span>
          <span className="font-mono text-slate-500">{item.name}</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900">Analytics</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <ProductLogo
              text={item.name.slice(0, 2).toUpperCase()}
              imageUrl={item.logoUrl}
              websiteUrl={item.websiteUrl}
              alt={item.name}
              className="size-14 shrink-0 rounded-xl border border-slate-200 text-sm shadow-2xs"
            />
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {item.name}
                </h2>
                <Badge variant="outline" className={upgradeBadge(item.tier)}>
                  {item.tier}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">{item.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 border-slate-200 text-xs font-semibold text-slate-700"
              render={
                <Link
                  href={
                    isProduct
                      ? ROUTES.PRODUCT(item.slug)
                      : ROUTES.TOOL(item.slug)
                  }
                  target="_blank"
                />
              }
            >
              <span>Live Page</span>
              <ExternalLink className="size-3 text-slate-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* 1. KPI Metrics Ribbon */}
      <div className={dashboardMetricsGrid}>
        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Page Views
            </span>
            <Eye className="size-3.5 text-purple-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.viewsCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Unique directory impressions
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Total {likeLabel}
            </span>
            <LikeIcon
              className={`size-3.5 ${
                isProduct ? "fill-rose-500 text-rose-500" : "text-amber-500"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">
              {stats.likesCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Verified community endorsements
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
              {stats.commentsCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Discussions & feedback
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
              {stats.externalVisitsCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Website referral outbound clicks
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Detail Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dashed border-border bg-white px-6 py-3.5 md:px-8">
        <button
          onClick={() => setActiveSubTab("likes")}
          className={analyticsTabTrigger(activeSubTab === "likes")}
        >
          <LikeIcon className="size-3.5" />
          <span>
            Who {isProduct ? "Liked" : "Upvoted"} ({whoLiked.length})
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("comments")}
          className={analyticsTabTrigger(activeSubTab === "comments")}
        >
          <MessageSquare className="size-3.5" />
          <span>Comments ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("visits")}
          className={analyticsTabTrigger(activeSubTab === "visits")}
        >
          <TrendingUp className="size-3.5" />
          <span>
            External Visits ({stats.externalVisitsCount})
          </span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeSubTab === "likes" && (
        <div className="flex flex-col">
          {whoLiked.length === 0 ? (
            <Empty className="border-b border-dashed border-border bg-white px-6 py-16 md:px-8">
              <EmptyMedia variant="icon">
                <LikeIcon className="size-5" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No {likeLabel.toLowerCase()} yet</EmptyTitle>
                <EmptyDescription>
                  When signed-in developers and makers {isProduct ? "like" : "upvote"}{" "}
                  your listing, their profiles will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col divide-y border-b border-dashed border-border bg-white">
              {whoLiked.map((user) => (
                <div
                  key={user.id + user.interactedAt.toString()}
                  className="flex items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-slate-50/50 md:px-8"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 border border-border">
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name} />
                      )}
                      <AvatarFallback className="bg-slate-900 text-xs text-white">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {user.username ? (
                          <Link
                            href={ROUTES.MAKER(user.username)}
                            target="_blank"
                            className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                          >
                            {user.name}
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-slate-900">
                            {user.name}
                          </span>
                        )}
                        {user.username && (
                          <span className="font-mono text-[11px] text-slate-400">
                            @{user.username}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Community Member
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="size-3" />
                    <span>{formatDate(user.interactedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "comments" && (
        <div className="flex flex-col">
          {comments.length === 0 ? (
            <Empty className="border-b border-dashed border-border bg-white px-6 py-16 md:px-8">
              <EmptyMedia variant="icon">
                <MessageSquare className="size-5" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No comments yet</EmptyTitle>
                <EmptyDescription>
                  Feedback, questions, and community thoughts on this listing will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col divide-y border-b border-dashed border-border bg-white">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col gap-2.5 px-6 py-4.5 transition-colors hover:bg-slate-50/40 md:px-8"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7 border border-border">
                        {comment.author.image && (
                          <AvatarImage
                            src={comment.author.image}
                            alt={comment.author.name}
                          />
                        )}
                        <AvatarFallback className="bg-slate-900 text-[10px] text-white">
                          {comment.author.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {comment.author.name}
                        </span>
                        {comment.author.username && (
                          <span className="font-mono text-[10px] text-slate-400">
                            @{comment.author.username}
                          </span>
                        )}
                      </div>
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
      )}

      {activeSubTab === "visits" && (
        <div className="flex flex-col">
          {/* Transparency / Attribution Notice */}
          <div className="flex flex-col gap-2 border-b border-dashed border-amber-200 bg-amber-50/40 px-6 py-4 md:px-8">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-amber-700" />
              <span className="font-mono text-xs font-bold text-amber-900 uppercase">
                Visitor Attribution Policy
              </span>
            </div>
            <p className="text-xs leading-relaxed text-amber-900/90">
              Only authenticated community members signed in to our platform who click &quot;Visit Website&quot; are identified below with their creator profile. Non-signed-in visitors are tallied in the total visit counts without personal tracking to preserve user privacy.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[11px] font-semibold text-amber-900">
              <span>● Total Clicks: {stats.externalVisitsCount}</span>
              <span>● Identified Sign-ins: {stats.signedInVisitsCount}</span>
              <span>● Anonymous/Guest: {stats.anonymousVisitsCount}</span>
            </div>
          </div>

          {visitors.length === 0 ? (
            <Empty className="border-b border-dashed border-border bg-white px-6 py-16 md:px-8">
              <EmptyMedia variant="icon">
                <TrendingUp className="size-5" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No outbound clicks recorded yet</EmptyTitle>
                <EmptyDescription>
                  When visitors click &quot;Visit Website&quot; to check out your product or tool, visits will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col divide-y border-b border-dashed border-border bg-white">
              {visitors.map((visit) => (
                <div key={visit.id} className={visitorItemRow}>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 border border-border">
                      {visit.user?.image ? (
                        <AvatarImage
                          src={visit.user.image}
                          alt={visit.user.name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-slate-800 text-[10px] text-white">
                        {visit.user?.name
                          ? visit.user.name.slice(0, 2).toUpperCase()
                          : "AN"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        {visit.user?.username ? (
                          <Link
                            href={ROUTES.MAKER(visit.user.username)}
                            target="_blank"
                            className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                          >
                            {visit.user.name}
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-slate-900">
                            {visit.user?.name ?? "Anonymous Visitor"}
                          </span>
                        )}

                        <Badge
                          variant="outline"
                          className={
                            visit.user
                              ? "border-emerald-200 bg-emerald-50 text-[9px] font-bold text-emerald-700"
                              : "border-slate-200 bg-slate-100 text-[9px] font-medium text-slate-600"
                          }
                        >
                          {visit.user ? "Signed-In Member" : "Guest Click"}
                        </Badge>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono truncate max-w-sm">
                        {visit.targetUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="size-3" />
                    <span>{formatDate(visit.visitedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
