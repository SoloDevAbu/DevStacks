"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  CheckCheck,
  XCircle,
  Inbox,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NativeSelect } from "@/components/ui/native-select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { toast } from "@/components/ui/toast"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminStatsOverview } from "@/components/admin/admin-stats-overview"
import { AdminSubmissionRow } from "@/components/admin/admin-submission-row"
import { AdminEditDialog } from "@/components/admin/admin-edit-dialog"
import {
  useAdminSubmissions,
  useUpdateSubmissionStatus,
  useBulkUpdateSubmissions,
  useUpdateSubmissionDetails,
  useDeleteSubmission,
} from "@/hooks/admin/use-admin"
import {
  adminPageContainer,
  adminFilterBar,
  adminSearchWrapper,
  adminFilterGroup,
  adminSubmissionList,
  adminBulkBar,
} from "@/utils/styles"
import type {
  AdminStatusFilter,
  AdminItemTypeFilter,
  AdminSortOption,
} from "@/constants/admin"
import type { AdminSubmissionItem } from "@/db/queries/admin/submissions"

export type AdminSubmissionsViewProps = {
  adminEmail: string
}

export const AdminSubmissionsView = ({
  adminEmail,
}: AdminSubmissionsViewProps) => {
  const [statusFilter, setStatusFilter] =
    useState<AdminStatusFilter>("pending")
  const [itemTypeFilter, setItemTypeFilter] =
    useState<AdminItemTypeFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<AdminSortOption>("recent")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeEditItem, setActiveEditItem] =
    useState<AdminSubmissionItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Fetch submissions with current filters
  const { data, isLoading, isFetching, refetch } = useAdminSubmissions({
    status: statusFilter,
    itemType: itemTypeFilter,
    search: searchQuery.trim() || undefined,
    sortBy,
    limit: 50,
  })

  const updateStatusMutation = useUpdateSubmissionStatus()
  const bulkUpdateMutation = useBulkUpdateSubmissions()
  const updateDetailsMutation = useUpdateSubmissionDetails()
  const deleteMutation = useDeleteSubmission()

  const items = useMemo(() => data?.items ?? [], [data?.items])
  const stats = useMemo(
    () =>
      data?.stats ?? {
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        toolsPending: 0,
        productsPending: 0,
        totalAll: 0,
      },
    [data?.stats]
  )

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectAllOnPage = () => {
    if (selectedIds.size === items.length && items.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)))
    }
  }

  const handleClearSelection = () => {
    setSelectedIds(new Set())
  }

  const handleUpdateSingleStatus = async (
    type: "tool" | "product",
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ type, id, status })
      toast.success(
        status === "approved"
          ? "Listing Approved"
          : status === "rejected"
            ? "Submission Rejected"
            : "Marked as Pending",
        `Submission status successfully updated to ${status}.`
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status"
      toast.error("Error updating status", msg)
    }
  }

  const handleBulkUpdate = async (status: "approved" | "rejected") => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id))
    if (selectedItems.length === 0) return

    const payload = selectedItems.map((item) => ({
      type: item.itemType,
      id: item.id,
      status,
    }))

    try {
      await bulkUpdateMutation.mutateAsync(payload)
      toast.success(
        "Bulk Update Successful",
        `Updated ${payload.length} items to ${status}.`
      )
      setSelectedIds(new Set())
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bulk update failed"
      toast.error("Bulk update failed", msg)
    }
  }

  const handleDelete = async (type: "tool" | "product", id: string) => {
    try {
      await deleteMutation.mutateAsync({ type, id })
      toast.success("Submission Deleted", "Successfully removed record.")
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed"
      toast.error("Delete failed", msg)
    }
  }

  const handleEditClick = (item: AdminSubmissionItem) => {
    setActiveEditItem(item)
    setIsEditDialogOpen(true)
  }

  const handleSaveDetails = async (
    type: "tool" | "product",
    id: string,
    payload: Record<string, unknown>
  ) => {
    await updateDetailsMutation.mutateAsync({ type, id, data: payload })
  }

  return (
    <div className={adminPageContainer}>
      <AdminHeader
        adminEmail={adminEmail}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <AdminStatsOverview
        stats={stats}
        activeFilter={statusFilter}
        onSelectFilter={(newFilter) => {
          setStatusFilter(newFilter)
          setSelectedIds(new Set())
        }}
      />

      {/* Filter and Search Bar */}
      <div className={adminFilterBar}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          {/* Search Box */}
          <div className={adminSearchWrapper}>
            <Search className="pointer-events-none absolute left-3 size-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, tagline, email, username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 text-xs bg-slate-50/60"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          {/* Item Type Select */}
          <div className="flex items-center gap-1.5">
            <Filter className="size-3.5 text-slate-400 shrink-0" />
            <NativeSelect
              value={itemTypeFilter}
              onChange={(e) =>
                setItemTypeFilter(e.target.value as AdminItemTypeFilter)
              }
              className="text-xs bg-slate-50/60"
            >
              <option value="all">All Types (Tools & Products)</option>
              <option value="tool">Tools Only</option>
              <option value="product">Products Only</option>
            </NativeSelect>
          </div>

          {/* Sort By Select */}
          <NativeSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as AdminSortOption)}
            className="text-xs bg-slate-50/60"
          >
            <option value="recent">Newest First</option>
            <option value="name">Alphabetical</option>
          </NativeSelect>
        </div>

        {/* Status Navigation Tabs */}
        <div className={adminFilterGroup}>
          <Tabs
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val as AdminStatusFilter)
              setSelectedIds(new Set())
            }}
          >
            <TabsList>
              <TabsTrigger value="pending" className="text-xs gap-1.5">
                <span>Pending</span>
                {stats.totalPending > 0 ? (
                  <Badge
                    variant="secondary"
                    className="border-amber-300 bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0"
                  >
                    {stats.totalPending}
                  </Badge>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs gap-1.5">
                <span>Approved</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {stats.totalApproved}
                </span>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs gap-1.5">
                <span>Rejected</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {stats.totalRejected}
                </span>
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs gap-1.5">
                <span>All Items</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {stats.totalAll}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Select All Row */}
      {items.length > 0 && !isLoading ? (
        <div className="flex items-center justify-between border-b border-dashed border-border bg-slate-50/40 px-6 py-2.5 text-xs text-slate-600 md:px-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllOnPage}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 p-0 h-auto"
            >
              {selectedIds.size === items.length
                ? "Deselect All on Page"
                : `Select All on Page (${items.length})`}
            </Button>
            {selectedIds.size > 0 ? (
              <span className="text-slate-400 font-mono">
                · {selectedIds.size} selected
              </span>
            ) : null}
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Showing {items.length} items
          </div>
        </div>
      ) : null}

      {/* Submissions List */}
      <div className={adminSubmissionList}>
        {isLoading ? (
          <div className="flex flex-col divide-y divide-dashed divide-border p-6 gap-6">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-80" />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-80" />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-80" />
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <Empty className="py-20">
            <EmptyMedia variant="icon">
              <Inbox className="size-6 text-slate-400" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No submissions found</EmptyTitle>
              <EmptyDescription>
                {statusFilter === "pending"
                  ? "All pending submissions have been moderated! Great job."
                  : `No submissions matching "${statusFilter}" status with the current filters.`}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          items.map((item) => (
            <AdminSubmissionRow
              key={`${item.itemType}-${item.id}`}
              item={item}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={handleToggleSelect}
              onUpdateStatus={handleUpdateSingleStatus}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              isUpdating={
                updateStatusMutation.isPending ||
                bulkUpdateMutation.isPending
              }
            />
          ))
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 ? (
        <div className={adminBulkBar}>
          <span className="font-mono text-xs font-semibold text-slate-200">
            {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleBulkUpdate("approved")}
              disabled={bulkUpdateMutation.isPending}
              className="bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold"
            >
              {bulkUpdateMutation.isPending ? (
                <Spinner className="size-3 mr-1" />
              ) : (
                <CheckCheck className="size-3.5 mr-1" />
              )}
              Approve All
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkUpdate("rejected")}
              disabled={bulkUpdateMutation.isPending}
              className="border-rose-400/40 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 text-xs font-semibold"
            >
              {bulkUpdateMutation.isPending ? (
                <Spinner className="size-3 mr-1" />
              ) : (
                <XCircle className="size-3.5 mr-1" />
              )}
              Reject All
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearSelection}
              className="text-slate-400 hover:text-white text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}

      {/* Edit Listing Dialog */}
      <AdminEditDialog
        item={activeEditItem}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveDetails}
        isSaving={updateDetailsMutation.isPending}
      />
    </div>
  )
}
