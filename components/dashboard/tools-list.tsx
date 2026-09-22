"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Wrench,
  ArrowBigUp,
  MessageSquare,
  Eye,
  ExternalLink,
  Edit3,
  BarChart2,
  Sparkles,
  Search,
  PlusCircle,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty"
import { ProductLogo } from "@/components/shared/product-logo"
import { UpgradeTierDialog } from "@/components/dashboard/upgrade-tier-dialog"
import { ROUTES } from "@/constants/routes"
import { TIER } from "@/constants/plans"
import {
  dashboardRow,
  dashboardFilterBar,
  upgradeBadge,
} from "@/utils/dashboard/styles"
import { pricingBadgeColor, submissionStatusBadge } from "@/utils/styles"
import { cn } from "@/lib/utils"
import type { UserDashboardTool } from "@/db/queries/users/get-user-tools"
import type { Pricing } from "@/constants/plans"

interface ToolsListProps {
  tools: UserDashboardTool[]
}

export const ToolsList = ({ tools }: ToolsListProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all")
  const [upgradingTool, setUpgradingTool] = useState<UserDashboardTool | null>(null)

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.tags &&
          tool.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          ))

      const matchesStatus =
        statusFilter === "all" ||
        (tool.status && tool.status.toLowerCase() === statusFilter)

      return matchesSearch && matchesStatus
    })
  }, [tools, searchQuery, statusFilter])

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Filter & Search Bar */}
      <div className={dashboardFilterBar}>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-800 uppercase">
            All Developer Tools ({tools.length})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-2.5 left-3 size-3.5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tools..."
              className="h-8 border border-dashed border-slate-200 pl-8 text-xs focus-visible:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-xs shadow-2xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors",
                statusFilter === "all"
                  ? "bg-slate-900 font-semibold text-white"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors",
                statusFilter === "approved"
                  ? "bg-emerald-600 font-semibold text-white"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors",
                statusFilter === "pending"
                  ? "bg-amber-600 font-semibold text-white"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Tools List */}
      {filteredTools.length === 0 ? (
        <Empty className="border-b border-dashed border-border bg-white px-6 py-16 md:px-8">
          <EmptyMedia variant="icon">
            <Wrench className="size-5" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No developer tools found</EmptyTitle>
            <EmptyDescription>
              {tools.length === 0
                ? "You have not listed any developer tools or APIs yet."
                : "No tools match your current search query or filter."}
            </EmptyDescription>
          </EmptyHeader>
          {tools.length === 0 && (
            <EmptyContent>
              <Button
                size="sm"
                className="text-xs"
                render={<Link href={ROUTES.SUBMIT} />}
              >
                <PlusCircle className="mr-1.5 size-3.5" />
                List Your First Tool
              </Button>
            </EmptyContent>
          )}
        </Empty>
      ) : (
        <div className="flex flex-col">
          {filteredTools.map((tool) => {
            const isTopTier = tool.tier === TIER.PREMIUM_PLUS

            return (
              <div key={tool.id} className={dashboardRow}>
                {/* Header: Logo, Name, Badges & Action Buttons */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-3.5">
                    <ProductLogo
                      text={tool.name.slice(0, 2).toUpperCase()}
                      imageUrl={tool.logoUrl}
                      websiteUrl={tool.websiteUrl}
                      alt={tool.name}
                      className="size-12 shrink-0 rounded-xl border border-slate-200 text-sm shadow-2xs"
                    />

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Clicking tool opens live tool */}
                        <Link
                          href={ROUTES.TOOL(tool.slug)}
                          target="_blank"
                          className="text-base font-bold text-slate-900 transition-colors hover:text-indigo-600 flex items-center gap-1.5"
                          title="Open live tool page"
                        >
                          <span>{tool.name}</span>
                          <ExternalLink className="size-3.5 text-slate-400" />
                        </Link>

                        <Badge
                          variant="outline"
                          className={cn(
                            "font-mono text-[10px] font-bold capitalize",
                            submissionStatusBadge(tool.status)
                          )}
                        >
                          {tool.status || "approved"}
                        </Badge>

                        <Badge
                          variant="outline"
                          className={upgradeBadge(
                            (tool.tier as any) || TIER.FREE
                          )}
                        >
                          {tool.tier || "free"}
                        </Badge>

                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-bold",
                            pricingBadgeColor(tool.pricing as Pricing)
                          )}
                        >
                          {tool.pricing}
                        </Badge>
                      </div>

                      <p className="text-xs font-medium text-slate-600 max-w-2xl">
                        {tool.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Actions Group: Edit, Upgrade, Analytics */}
                  <div className="flex flex-wrap items-center gap-2 self-start">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      render={
                        <Link href={ROUTES.DASHBOARD_TOOL_EDIT(tool.slug)} />
                      }
                    >
                      <Edit3 className="size-3.5 text-slate-500" />
                      <span>Edit</span>
                    </Button>

                    {!isTopTier && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUpgradingTool(tool)}
                        className="h-8 gap-1.5 border-amber-300 bg-amber-50/50 text-xs font-semibold text-amber-800 hover:bg-amber-100/70"
                      >
                        <Sparkles className="size-3.5 text-amber-600" />
                        <span>Upgrade</span>
                      </Button>
                    )}

                    <Button
                      size="sm"
                      className="h-8 gap-1.5 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
                      render={
                        <Link
                          href={ROUTES.DASHBOARD_TOOL_ANALYTICS(tool.slug)}
                        />
                      }
                    >
                      <BarChart2 className="size-3.5 text-indigo-300" />
                      <span>Analytics</span>
                    </Button>
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-2 divide-x rounded-lg border border-dashed border-border bg-slate-50/60 py-2 sm:grid-cols-4">
                  <div className="flex flex-col items-center px-3 py-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <ArrowBigUp className="size-3 text-amber-500" />
                      Upvotes
                    </span>
                    <span className="text-sm font-black text-amber-600">
                      {tool.upvotesCount?.toLocaleString() ?? 0}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-3 py-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <MessageSquare className="size-3 text-sky-500" />
                      Comments
                    </span>
                    <span className="text-sm font-black text-sky-600">
                      {tool.commentsCount?.toLocaleString() ?? 0}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-3 py-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Eye className="size-3 text-purple-500" />
                      Page Views
                    </span>
                    <span className="text-sm font-black text-purple-600">
                      {tool.viewsCount?.toLocaleString() ?? 0}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-3 py-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <TrendingUp className="size-3 text-emerald-500" />
                      External Visits
                    </span>
                    <span className="text-sm font-black text-emerald-600">
                      {tool.externalVisitsCount?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upgrade Tier Dialog */}
      {upgradingTool && (
        <UpgradeTierDialog
          isOpen={Boolean(upgradingTool)}
          onOpenChange={(open) => {
            if (!open) setUpgradingTool(null)
          }}
          item={{
            id: upgradingTool.id,
            name: upgradingTool.name,
            slug: upgradingTool.slug,
            tier: upgradingTool.tier as "free" | "premium" | "premium+",
            itemType: "tool",
          }}
        />
      )}
    </div>
  )
}
