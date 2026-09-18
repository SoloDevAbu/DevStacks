"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Heart,
  MessageSquare,
  Eye,
  Blocks,
  Wrench,
  Package,
  ExternalLink,
  Search,
  PlusCircle,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductLogo } from "@/components/shared/product-logo"
import { ROUTES } from "@/constants/routes"
import {
  pricingBadgeColor,
  submissionStatusBadge,
  dashboardMetricsGrid,
  dashboardMetricCell,
  dashboardRow,
  sectionHeaderWrapper,
  filterPillActive,
  filterPillInactive,
} from "@/utils/styles"
import { cn } from "@/lib/utils"
import type { UserDashboardData, DbTool, DbProduct } from "@/types/entities"
import type { Pricing } from "@/constants/plans"

interface DashboardContentProps {
  data: UserDashboardData
}

export const DashboardContent = ({ data }: DashboardContentProps) => {
  const [selectedTab, setSelectedTab] = useState<
    "all" | "tools" | "products" | "comments"
  >("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "pending"
  >("all")
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  )

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const { stats, tools, products, comments } = data

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags &&
          product.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          ))

      const matchesStatus =
        statusFilter === "all" ||
        (product.status && product.status.toLowerCase() === statusFilter)

      return matchesSearch && matchesStatus
    })
  }, [products, searchQuery, statusFilter])

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
      {/* 1. Full-Width Metrics Ribbon with Dashed Grid */}
      <div className={dashboardMetricsGrid}>
        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Total Likes
            </span>
            <Heart className="size-3.5 fill-rose-500/20 text-rose-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 md:text-2xl">
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
            <span className="text-xl font-black text-slate-900 md:text-2xl">
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
              Tools Listed
            </span>
            <Wrench className="size-3.5 text-indigo-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 md:text-2xl">
              {stats.totalTools}
            </span>
            <span className="text-[11px] text-slate-500">
              APIs & infrastructure
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Products
            </span>
            <Package className="size-3.5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 md:text-2xl">
              {stats.totalProducts}
            </span>
            <span className="text-[11px] text-slate-500">
              End-user applications
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Page Views
            </span>
            <Eye className="size-3.5 text-purple-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 md:text-2xl">
              {stats.totalViews.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Directory impressions
            </span>
          </div>
        </div>

        <div className={dashboardMetricCell}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Builds Powered
            </span>
            <Blocks className="size-3.5 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 md:text-2xl">
              {stats.totalBuilds.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Ecosystem adoptions
            </span>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Filter & Controls Bar */}
      <div className="flex flex-col gap-4 border-b border-dashed border-border bg-white px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between md:px-8">
        {/* Tab switcher: All Submissions, Tools, Products, Comments */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTab("all")}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-semibold transition-colors hover:bg-transparent",
              selectedTab === "all" ? filterPillActive : filterPillInactive
            )}
          >
            All Submissions ({tools.length + products.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTab("tools")}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-semibold transition-colors hover:bg-transparent",
              selectedTab === "tools" ? filterPillActive : filterPillInactive
            )}
          >
            Tools ({tools.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTab("products")}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-semibold transition-colors hover:bg-transparent",
              selectedTab === "products" ? filterPillActive : filterPillInactive
            )}
          >
            Products ({products.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTab("comments")}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-semibold transition-colors hover:bg-transparent",
              selectedTab === "comments" ? filterPillActive : filterPillInactive
            )}
          >
            Comments ({comments.length})
          </Button>
        </div>

        {/* Search & Status Filter */}
        {selectedTab !== "comments" && (
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search className="pointer-events-none absolute top-2.5 left-3 size-3.5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter submissions..."
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
        )}
      </div>

      {/* 3. Submissions & Content Section */}
      {selectedTab === "comments" ? (
        <div className="flex flex-col">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center border-b border-dashed border-border bg-white px-6 py-16 text-center md:px-8">
              <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
                <MessageSquare className="size-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                No comments received yet
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                When developers leave feedback or ask questions on your tools
                and products, they will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y border-b border-dashed border-border bg-white">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col gap-3 px-6 py-5 transition-colors hover:bg-slate-50/40 md:px-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7 border border-border">
                        {comment.authorImage && (
                          <AvatarImage
                            src={comment.authorImage}
                            alt={comment.authorName || "User"}
                          />
                        )}
                        <AvatarFallback className="bg-slate-900 text-[10px] text-white">
                          {(comment.authorName || "U")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">
                          {comment.authorName || "Anonymous Developer"}
                        </span>
                        {comment.authorUsername && (
                          <span className="font-mono text-[10px] text-slate-400">
                            @{comment.authorUsername}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <Badge
                        variant="outline"
                        className="border-dashed text-[10px] font-semibold text-slate-600"
                      >
                        On {comment.targetKind === "tool" ? "Tool" : "Product"}:
                      </Badge>
                      <Link
                        href={
                          comment.targetKind === "tool"
                            ? ROUTES.TOOL(comment.targetSlug)
                            : ROUTES.PRODUCT(comment.targetSlug)
                        }
                        target="_blank"
                        className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>{comment.targetName}</span>
                        <ExternalLink className="size-3" />
                      </Link>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  <p className="rounded-md border border-dashed border-border bg-slate-50/60 p-3 text-xs leading-relaxed text-slate-700">
                    {comment.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Tools Subsection */}
          {(selectedTab === "all" || selectedTab === "tools") && (
            <div className="flex flex-col">
              {selectedTab === "all" && (
                <div className={sectionHeaderWrapper}>
                  <h2 className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                    <Wrench className="size-3.5 text-indigo-500" />
                    Developer Tools ({filteredTools.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-semibold text-slate-700 hover:text-slate-950"
                    render={<Link href={ROUTES.SUBMIT} />}
                  >
                    <PlusCircle className="mr-1 size-3 text-slate-500" />
                    Add Another Tool
                  </Button>
                </div>
              )}

              {filteredTools.length === 0 ? (
                <div className="flex flex-col items-center justify-center border-b border-dashed border-border bg-white px-6 py-12 text-center md:px-8">
                  <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
                    <Wrench className="size-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    No tools found
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    {tools.length === 0
                      ? "You have not listed any developer tools or APIs yet."
                      : "No tools match your current search query or filter."}
                  </p>
                  {tools.length === 0 && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        className="bg-slate-900 text-xs text-white hover:bg-slate-800"
                        render={<Link href={ROUTES.SUBMIT} />}
                      >
                        <PlusCircle className="mr-1.5 size-3.5" />
                        List Your First Tool
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredTools.map((tool) => (
                    <ToolDashboardRow
                      key={tool.id}
                      tool={tool}
                      isExpanded={Boolean(expandedItems[tool.id])}
                      onToggleExpand={() => toggleExpand(tool.id)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products Subsection */}
          {(selectedTab === "all" || selectedTab === "products") && (
            <div className="flex flex-col">
              {selectedTab === "all" && (
                <div className={sectionHeaderWrapper}>
                  <h2 className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                    <Package className="size-3.5 text-emerald-500" />
                    Applications & Products ({filteredProducts.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-semibold text-slate-700 hover:text-slate-950"
                    render={<Link href={ROUTES.SHOWCASE} />}
                  >
                    <Sparkles className="mr-1 size-3 text-amber-500" />
                    Submit Another Product
                  </Button>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center border-b border-dashed border-border bg-white px-6 py-12 text-center md:px-8">
                  <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
                    <Package className="size-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    No products found
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    {products.length === 0
                      ? "You have not listed any applications or products yet."
                      : "No products match your current search query or filter."}
                  </p>
                  {products.length === 0 && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        className="bg-slate-900 text-xs text-white hover:bg-slate-800"
                        render={<Link href={ROUTES.SHOWCASE} />}
                      >
                        <Sparkles className="mr-1.5 size-3.5" />
                        Showcase Your First Product
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredProducts.map((product) => (
                    <ProductDashboardRow
                      key={product.id}
                      product={product}
                      isExpanded={Boolean(expandedItems[product.id])}
                      onToggleExpand={() => toggleExpand(product.id)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface ToolRowProps {
  tool: DbTool
  isExpanded: boolean
  onToggleExpand: () => void
  formatDate: (date?: Date | string) => string
}

const ToolDashboardRow = ({
  tool,
  isExpanded,
  onToggleExpand,
  formatDate,
}: ToolRowProps) => {
  return (
    <div className={dashboardRow}>
      {/* Top Part: Logo, Metadata & Live Page CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
              <Link
                href={ROUTES.TOOL(tool.slug)}
                target="_blank"
                className="text-base font-bold text-slate-900 transition-colors hover:text-indigo-600"
              >
                {tool.name}
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
                className={cn(
                  "text-[10px] font-bold",
                  pricingBadgeColor(tool.pricing as Pricing)
                )}
              >
                {tool.pricing}
              </Badge>
              {tool.category && (
                <Badge
                  variant="secondary"
                  className="rounded-none bg-slate-100 text-[10px] font-semibold text-slate-600"
                >
                  {tool.category}
                </Badge>
              )}
            </div>
            <p className="text-xs font-medium text-slate-600">{tool.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            render={<Link href={ROUTES.TOOL(tool.slug)} target="_blank" />}
          >
            <span>Live Page</span>
            <ExternalLink className="ml-1 size-3" />
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 divide-x rounded-lg border border-dashed border-border bg-slate-50/70 py-2 sm:grid-cols-4">
        <div className="flex flex-col items-center px-3 py-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
            Upvotes
          </span>
          <span className="text-sm font-black text-rose-600">
            {tool.upvotesCount?.toLocaleString() ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-center px-3 py-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
            Comments
          </span>
          <span className="text-sm font-black text-sky-600">
            {tool.commentsCount?.toLocaleString() ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-center px-3 py-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
            Page Views
          </span>
          <span className="text-sm font-black text-purple-600">
            {tool.viewsCount?.toLocaleString() ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-center px-3 py-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
            Ecosystem Builds
          </span>
          <span className="text-sm font-black text-blue-600">
            {tool.buildsCount?.toLocaleString() ?? 0}
          </span>
        </div>
      </div>

      {/* Social Links, Platform Tags & Full Info Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-border pt-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {tool.websiteUrl && (
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="Website"
            >
              <Image
                src="/social-logo/world-wide-web.png"
                alt="Website"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}
          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="GitHub"
            >
              <Image
                src="/social-logo/github.png"
                alt="GitHub"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}
          {tool.twitterUrl && (
            <a
              href={tool.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="Twitter / X"
            >
              <Image
                src="/social-logo/twitter.png"
                alt="Twitter"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}
          {tool.linkedinUrl && (
            <a
              href={tool.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="LinkedIn"
            >
              <Image
                src="/social-logo/linkedin.png"
                alt="LinkedIn"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}
          {tool.discordUrl && (
            <a
              href={tool.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="Discord"
            >
              <Image
                src="/social-logo/discord.png"
                alt="Discord"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}

          {tool.platforms && tool.platforms.length > 0 && (
            <div className="flex items-center gap-1 pl-2">
              {tool.platforms.map((p) => (
                <span
                  key={p}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="size-3" />
            Submitted {formatDate(tool.createdAt)}
          </span>
          {(tool.problemStatement || tool.solution || tool.description) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="h-6 px-1.5 text-[11px] text-slate-500 hover:text-slate-900"
            >
              <span>{isExpanded ? "Less info" : "Full info"}</span>
              {isExpanded ? (
                <ChevronUp className="ml-0.5 size-3" />
              ) : (
                <ChevronDown className="ml-0.5 size-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Collapsible Full Info Drawer */}
      {isExpanded && (
        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-dashed border-border bg-slate-50/50 p-4 text-xs text-slate-700">
          {tool.problemStatement && (
            <div>
              <span className="font-mono text-[10px] font-bold text-rose-600 uppercase">
                Problem Solved
              </span>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                {tool.problemStatement}
              </p>
            </div>
          )}
          {tool.solution && (
            <div>
              <span className="font-mono text-[10px] font-bold text-emerald-600 uppercase">
                Solution & Architecture
              </span>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                {tool.solution}
              </p>
            </div>
          )}
          {tool.uniqueValue && (
            <div>
              <span className="font-mono text-[10px] font-bold text-indigo-600 uppercase">
                Unique Value Proposition
              </span>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                {tool.uniqueValue}
              </p>
            </div>
          )}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="mr-1 font-mono text-[10px] font-bold text-slate-400 uppercase">
                Tags:
              </span>
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface ProductRowProps {
  product: DbProduct
  isExpanded: boolean
  onToggleExpand: () => void
  formatDate: (date?: Date | string) => string
}

const ProductDashboardRow = ({
  product,
  isExpanded,
  onToggleExpand,
  formatDate,
}: ProductRowProps) => {
  return (
    <div className={dashboardRow}>
      {/* Top Part: Logo, Metadata & Live Page CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3.5">
          <ProductLogo
            text={product.name.slice(0, 2).toUpperCase()}
            imageUrl={product.logoUrl}
            websiteUrl={product.websiteUrl}
            alt={product.name}
            className="size-12 shrink-0 rounded-xl border border-slate-200 text-sm shadow-2xs"
          />

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={ROUTES.PRODUCT(product.slug)}
                target="_blank"
                className="text-base font-bold text-slate-900 transition-colors hover:text-indigo-600"
              >
                {product.name}
              </Link>
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-[10px] font-bold capitalize",
                  submissionStatusBadge(product.status)
                )}
              >
                {product.status || "approved"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-bold",
                  pricingBadgeColor(product.pricing as Pricing)
                )}
              >
                {product.pricing}
              </Badge>
              {product.category && (
                <Badge
                  variant="secondary"
                  className="rounded-none bg-slate-100 text-[10px] font-semibold text-slate-600"
                >
                  {product.category}
                </Badge>
              )}
            </div>
            <p className="text-xs font-medium text-slate-600">
              {product.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            render={
              <Link href={ROUTES.PRODUCT(product.slug)} target="_blank" />
            }
          >
            <span>Live Page</span>
            <ExternalLink className="ml-1 size-3" />
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 divide-x rounded-lg border border-dashed border-border bg-slate-50/70 py-2 sm:grid-cols-3">
        <div className="flex flex-col items-center px-3 py-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
            Likes
          </span>
          <span className="text-sm font-black text-rose-600">
            {product.likesCount?.toLocaleString() ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-center px-3 py-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
            Comments
          </span>
          <span className="text-sm font-black text-sky-600">
            {product.commentsCount?.toLocaleString() ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-center px-3 py-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
            Page Views
          </span>
          <span className="text-sm font-black text-purple-600">
            {product.viewsCount?.toLocaleString() ?? 0}
          </span>
        </div>
      </div>

      {/* Social Links, Platform Tags & Full Info Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-border pt-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {product.websiteUrl && (
            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="Website"
            >
              <Image
                src="/social-logo/world-wide-web.png"
                alt="Website"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}
          {product.githubUrl && (
            <a
              href={product.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="GitHub"
            >
              <Image
                src="/social-logo/github.png"
                alt="GitHub"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}
          {product.twitterUrl && (
            <a
              href={product.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="Twitter / X"
            >
              <Image
                src="/social-logo/twitter.png"
                alt="Twitter"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}
          {product.linkedinUrl && (
            <a
              href={product.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="LinkedIn"
            >
              <Image
                src="/social-logo/linkedin.png"
                alt="LinkedIn"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}
          {product.discordUrl && (
            <a
              href={product.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              title="Discord"
            >
              <Image
                src="/social-logo/discord.png"
                alt="Discord"
                width={14}
                height={14}
                className="size-3.5 object-contain"
              />
            </a>
          )}

          {product.platforms && product.platforms.length > 0 && (
            <div className="flex items-center gap-1 pl-2">
              {product.platforms.map((p) => (
                <span
                  key={p}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="size-3" />
            Submitted {formatDate(product.createdAt)}
          </span>
          {(product.problemStatement ||
            product.solution ||
            product.description) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="h-6 px-1.5 text-[11px] text-slate-500 hover:text-slate-900"
            >
              <span>{isExpanded ? "Less info" : "Full info"}</span>
              {isExpanded ? (
                <ChevronUp className="ml-0.5 size-3" />
              ) : (
                <ChevronDown className="ml-0.5 size-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Collapsible Full Info Drawer */}
      {isExpanded && (
        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-dashed border-border bg-slate-50/50 p-4 text-xs text-slate-700">
          {product.problemStatement && (
            <div>
              <span className="font-mono text-[10px] font-bold text-rose-600 uppercase">
                Problem Solved
              </span>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                {product.problemStatement}
              </p>
            </div>
          )}
          {product.solution && (
            <div>
              <span className="font-mono text-[10px] font-bold text-emerald-600 uppercase">
                Solution & Architecture
              </span>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                {product.solution}
              </p>
            </div>
          )}
          {product.uniqueValue && (
            <div>
              <span className="font-mono text-[10px] font-bold text-indigo-600 uppercase">
                Unique Value Proposition
              </span>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                {product.uniqueValue}
              </p>
            </div>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="mr-1 font-mono text-[10px] font-bold text-slate-400 uppercase">
                Tags:
              </span>
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
