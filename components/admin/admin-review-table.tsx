"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCw,
  Search,
  BookOpen,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { PLANS, TIER, type Tier } from "@/constants/plans"
import {
  useAdminSubmissions,
  useUpdateSubmissionStatus,
  useRegenerateBlog,
} from "@/hooks/admin/use-admin"
import {
  adminContainer,
  adminHeaderCard,
  adminFilterTab,
  adminFilterTabActive,
  adminFilterTabInactive,
  adminTableCard,
  adminStatusBadgePending,
  adminStatusBadgeApproved,
  adminStatusBadgeRejected,
  adminBlogBadgeGenerating,
  adminBlogBadgeCompleted,
  adminBlogBadgeFailed,
  adminActionApproveBtn,
  adminActionRejectBtn,
  adminActionRetryBtn,
  adminPreviewBtn,
} from "@/utils/admin/styles"
import { cn } from "@/lib/utils"

export const AdminReviewTable = () => {
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

  const { data: submissions = [], isLoading, error } = useAdminSubmissions({
    status: statusFilter,
    search: searchQuery || undefined,
  })

  const updateStatusMutation = useUpdateSubmissionStatus()
  const regenerateBlogMutation = useRegenerateBlog()

  const handleStatusChange = async (
    itemType: "tool" | "product",
    id: string,
    status: "approved" | "rejected"
  ) => {
    setActiveItemId(id)
    try {
      const res = await updateStatusMutation.mutateAsync({
        type: itemType,
        id,
        status,
      })

      if (status === "approved") {
        if (res.blog) {
          toast.success("Submission approved and AI blog generated successfully!")
        } else if (res.blogError) {
          toast.error(`Approved, but blog generation failed: ${res.blogError}`)
        } else {
          toast.success("Submission approved successfully.")
        }
      } else {
        toast.success("Submission marked as rejected.")
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update submission status."
      toast.error(message)
    } finally {
      setActiveItemId(null)
    }
  }

  const handleRetryBlog = async (itemType: "tool" | "product", id: string) => {
    setActiveItemId(id)
    try {
      await regenerateBlogMutation.mutateAsync({
        itemType,
        itemId: id,
      })
      toast.success("AI launch blog generated successfully!")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate blog."
      toast.error(message)
    } finally {
      setActiveItemId(null)
    }
  }

  const renderTierBadge = (tier: Tier) => {
    const plan = PLANS[tier]
    if (!plan) return <Badge variant="outline">{tier}</Badge>
    return (
      <Badge variant="outline" className={cn("text-xs font-semibold", plan.badgeClass)}>
        {plan.badgeLabel}
      </Badge>
    )
  }

  return (
    <div className={adminContainer}>
      {/* Top Header Card */}
      <div className={adminHeaderCard}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Launch Submissions & Blog Approvals
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review pending launches, approve listings, and trigger AI-generated launch blogs for Premium members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                adminFilterTab,
                statusFilter === tab ? adminFilterTabActive : adminFilterTabInactive
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by name, tagline, or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 bg-white"
        />
      </div>

      {/* Table Container */}
      <div className={adminTableCard}>
        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 p-8 text-slate-500">
            <Spinner className="size-6 text-slate-700" />
            <p className="text-sm">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-8 text-rose-600">
            <AlertTriangle className="size-6" />
            <p className="text-sm font-medium">Failed to load submissions</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center text-slate-500">
            <CheckCircle2 className="size-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">No submissions found</p>
            <p className="text-xs text-slate-400 mt-1">
              There are no {statusFilter !== "all" ? statusFilter : ""} submissions matching your filter.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="w-[300px]">Product / Tool</TableHead>
                <TableHead>Tier & Pricing</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Review Status</TableHead>
                <TableHead>AI Blog Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((sub) => {
                const isWorking = activeItemId === sub.id
                const isPaidTier =
                  sub.tier === TIER.PREMIUM || sub.tier === TIER.PREMIUM_PLUS
                const launchDateString = sub.launchDate
                  ? new Date(sub.launchDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : sub.launchWeek
                    ? `Week ${sub.launchWeek}, ${sub.launchYear}`
                    : "Immediate"

                return (
                  <TableRow key={sub.id} className="hover:bg-slate-50/60">
                    {/* Item Details */}
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {sub.logoUrl ? (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <Image
                              src={sub.logoUrl}
                              alt={sub.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                            {sub.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 truncate">
                              {sub.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase font-mono px-1 py-0 h-4 border-slate-200 text-slate-500"
                            >
                              {sub.itemType}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {sub.tagline}
                          </p>
                          <a
                            href={sub.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-1"
                          >
                            Visit website
                            <ExternalLink className="size-2.5" />
                          </a>
                        </div>
                      </div>
                    </TableCell>

                    {/* Tier & Pricing */}
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        {renderTierBadge(sub.tier as Tier)}
                        <span className="text-[11px] text-slate-500">
                          {sub.pricing}
                        </span>
                      </div>
                    </TableCell>

                    {/* Schedule */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Calendar className="size-3.5 text-slate-400" />
                        <span>{launchDateString}</span>
                      </div>
                    </TableCell>

                    {/* Review Status */}
                    <TableCell>
                      {sub.status === "pending" ? (
                        <Badge variant="outline" className={adminStatusBadgePending}>
                          Pending Review
                        </Badge>
                      ) : sub.status === "approved" ? (
                        <Badge variant="outline" className={adminStatusBadgeApproved}>
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className={adminStatusBadgeRejected}>
                          Rejected
                        </Badge>
                      )}
                    </TableCell>

                    {/* AI Blog Status */}
                    <TableCell>
                      {!isPaidTier ? (
                        <span className="text-xs text-slate-400 italic">
                          Community ($0) - No Blog
                        </span>
                      ) : sub.blog?.generationStatus === "completed" ? (
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className={cn(adminBlogBadgeCompleted, "w-fit")}
                          >
                            <Sparkles className="mr-1 size-3 text-indigo-500" />
                            Blog Generated
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-mono">
                            /{sub.blog.slug}
                          </span>
                        </div>
                      ) : sub.blog?.generationStatus === "generating" ||
                        (isWorking && sub.status === "pending") ? (
                        <Badge
                          variant="outline"
                          className={cn(adminBlogBadgeGenerating, "w-fit")}
                        >
                          <Spinner className="mr-1 size-3" />
                          Generating...
                        </Badge>
                      ) : sub.blog?.generationStatus === "failed" ? (
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className={cn(adminBlogBadgeFailed, "w-fit")}
                          >
                            Generation Failed
                          </Badge>
                          {sub.blog.generationError && (
                            <span
                              className="text-[10px] text-rose-600 line-clamp-1 max-w-[200px]"
                              title={sub.blog.generationError}
                            >
                              {sub.blog.generationError}
                            </span>
                          )}
                        </div>
                      ) : sub.status === "approved" ? (
                        <span className="text-xs text-slate-400 italic">
                          Not Generated
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Awaits Approval
                        </span>
                      )}
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview Blog button if blog exists */}
                        {sub.blog?.slug && (
                          <Link
                            href={`/blog/${sub.blog.slug}`}
                            target="_blank"
                            title="Preview Generated Launch Blog"
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              adminPreviewBtn
                            )}
                          >
                            <BookOpen className="mr-1 size-3" />
                            Preview
                          </Link>
                        )}

                        {/* Retry Blog Generation button if failed */}
                        {isPaidTier &&
                          sub.status === "approved" &&
                          sub.blog?.generationStatus === "failed" && (
                            <Button
                              size="sm"
                              disabled={isWorking}
                              onClick={() => handleRetryBlog(sub.itemType, sub.id)}
                              className={adminActionRetryBtn}
                              title="Manually retry AI Blog Generation"
                            >
                              {isWorking ? (
                                <Spinner className="size-3" />
                              ) : (
                                <RotateCw className="mr-1 size-3" />
                              )}
                              Retry Blog
                            </Button>
                          )}

                        {/* Approve & Reject for Pending items */}
                        {sub.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              disabled={isWorking}
                              onClick={() =>
                                handleStatusChange(sub.itemType, sub.id, "approved")
                              }
                              className={adminActionApproveBtn}
                            >
                              {isWorking ? (
                                <Spinner className="size-3 mr-1" />
                              ) : (
                                <CheckCircle2 className="size-3 mr-1" />
                              )}
                              {isPaidTier ? "Approve & Generate Blog" : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isWorking}
                              onClick={() =>
                                handleStatusChange(sub.itemType, sub.id, "rejected")
                              }
                              className={adminActionRejectBtn}
                            >
                              <XCircle className="size-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
