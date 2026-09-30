"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ExternalLink,
  Check,
  X,
  Edit3,
  Trash2,
  Calendar,
  Eye,
  RotateCcw,
  Wrench,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { formatCommentTime } from "@/utils/date"
import {
  adminSubmissionCard,
  adminItemTypeBadge,
  adminStatusBadge,
  adminActionRow,
  upgradeBadge,
} from "@/utils/styles"
import type { AdminSubmissionItem } from "@/db/queries/admin/submissions"
import type { Tier } from "@/constants/plans"

export type AdminSubmissionRowProps = {
  item: AdminSubmissionItem
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onUpdateStatus: (
    type: "tool" | "product",
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => void
  onEdit: (item: AdminSubmissionItem) => void
  onDelete: (type: "tool" | "product", id: string) => void
  isUpdating?: boolean
}

export const AdminSubmissionRow = ({
  item,
  isSelected,
  onToggleSelect,
  onUpdateStatus,
  onEdit,
  onDelete,
  isUpdating = false,
}: AdminSubmissionRowProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const publicUrl =
    item.itemType === "tool" ? `/tools/${item.slug}` : `/products/${item.slug}`

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name?.trim()) {
      const parts = name.trim().split(/\s+/)
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase()
    }
    if (email?.trim()) return email.slice(0, 2).toUpperCase()
    return "U"
  }

  const handleDelete = () => {
    setDeleteConfirmOpen(false)
    onDelete(item.itemType, item.id)
  }

  return (
    <>
      <div className={adminSubmissionCard(isSelected)}>
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="pt-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(item.id)}
                aria-label={`Select ${item.name}`}
              />
            </div>

            <div className="size-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shadow-2xs">
              {item.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="size-full object-contain p-1"
                />
              ) : item.itemType === "tool" ? (
                <Wrench className="size-5 text-slate-400" />
              ) : (
                <Package className="size-5 text-slate-400" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={adminItemTypeBadge(item.itemType)}>
                  {item.itemType}
                </span>

                <span className={adminStatusBadge(item.status)}>
                  {item.status}
                </span>

                <span className={`px-2 py-0.5 rounded-md border text-[10px] ${upgradeBadge(item.tier as Tier)}`}>
                  {item.tier}
                </span>

                <h3 className="truncate font-bold text-sm text-slate-900">
                  {item.name}
                </h3>
              </div>

              <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                {item.tagline}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                {item.submitterEmail ? (
                  <div className="flex items-center gap-1.5 font-medium">
                    <Avatar className="size-4">
                      {item.submitterAvatarUrl ? (
                        <AvatarImage
                          src={item.submitterAvatarUrl}
                          alt={item.submitterName || "User"}
                        />
                      ) : null}
                      <AvatarFallback className="text-[8px] bg-slate-200 text-slate-700">
                        {getInitials(item.submitterName, item.submitterEmail)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-800 font-semibold">
                      {item.submitterName || item.submitterUsername || "Maker"}
                    </span>
                    <span className="text-slate-400">
                      ({item.submitterEmail})
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">Anonymous submitter</span>
                )}

                {item.launchWeek && item.launchYear ? (
                  <span className="flex items-center gap-1 font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    <Calendar className="size-3 text-slate-400" />
                    W{item.launchWeek} {item.launchYear}
                  </span>
                ) : null}

                {item.category ? (
                  <span className="text-slate-500">
                    Category:{" "}
                    <strong className="font-semibold text-slate-700">
                      {item.category}
                    </strong>
                  </span>
                ) : null}

                <span className="text-slate-400">
                  Submitted {formatCommentTime(item.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {item.websiteUrl ? (
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Visit website"
              >
                <ExternalLink className="size-3 text-slate-400" />
                <span className="hidden sm:inline">Website</span>
              </a>
            ) : null}

            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={publicUrl} target="_blank" />}
              className="text-xs"
              title="Preview public page"
            >
              <Eye className="size-3 mr-1 text-slate-400" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </div>
        </div>

        <div className={adminActionRow}>
          <div className="flex flex-wrap items-center gap-2">
            {item.status !== "approved" ? (
              <Button
                size="sm"
                onClick={() =>
                  onUpdateStatus(item.itemType, item.id, "approved")
                }
                disabled={isUpdating}
                className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-2xs"
              >
                {isUpdating ? (
                  <Spinner className="size-3 mr-1" />
                ) : (
                  <Check className="size-3.5 mr-1" />
                )}
                Approve Listing
              </Button>
            ) : null}

            {item.status !== "rejected" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onUpdateStatus(item.itemType, item.id, "rejected")
                }
                disabled={isUpdating}
                className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 text-xs font-semibold"
              >
                {isUpdating ? (
                  <Spinner className="size-3 mr-1" />
                ) : (
                  <X className="size-3.5 mr-1 text-rose-500" />
                )}
                Reject
              </Button>
            ) : null}

            {item.status !== "pending" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onUpdateStatus(item.itemType, item.id, "pending")
                }
                disabled={isUpdating}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
              >
                <RotateCcw className="size-3 mr-1 text-slate-400" />
                Mark Pending
              </Button>
            ) : null}

            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(item)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs"
            >
              <Edit3 className="size-3 mr-1 text-slate-400" />
              Review & Edit Details
            </Button>
          </div>

          <div className="ml-auto">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(true)}
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 size-8 p-0"
              title="Delete submission"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong>{item.name}</strong> ({item.itemType})? This will
              remove all associated launches, comments, and upvotes from the
              database. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="text-xs"
            >
              <Trash2 className="size-3.5 mr-1.5" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
