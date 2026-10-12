"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { Trash2 } from "lucide-react"
import { useDeleteProduct } from "@/hooks/products/use-delete-product"
import { useDeleteTool } from "@/hooks/tools/use-delete-tool"

export interface DeleteItemTarget {
  id: string
  name: string
  slug: string
  itemType: "product" | "tool"
}

interface DeleteItemDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: DeleteItemTarget | null
  onSuccess: (id: string) => void
}

export const DeleteItemDialog = ({
  isOpen,
  onOpenChange,
  item,
  onSuccess,
}: DeleteItemDialogProps) => {
  const deleteProductMutation = useDeleteProduct()
  const deleteToolMutation = useDeleteTool()

  if (!item) return null

  const isProduct = item.itemType === "product"
  const label = isProduct ? "Product" : "Tool"
  const activeMutation = isProduct ? deleteProductMutation : deleteToolMutation
  const isPending = activeMutation.isPending

  const handleDelete = async () => {
    try {
      await activeMutation.mutateAsync(item.slug)
      toast.success(`${label} deleted successfully`)
      onSuccess(item.id)
      onOpenChange(false)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to delete ${label.toLowerCase()}`
      toast.error(message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-4">
        <DialogHeader className="gap-1.5">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Trash2 className="size-4 text-rose-500" />
            <span>Delete {label}</span>
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">{item.name}</span>?
            This {label.toLowerCase()} will be marked as deleted, hidden from
            search engines and all public pages, and removed from your
            dashboard.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-8 text-xs font-medium"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            {isPending ? (
              <Spinner className="size-3.5" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            <span>Delete {label}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
