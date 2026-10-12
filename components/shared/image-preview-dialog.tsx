"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface ImagePreviewDialogProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string | null
  title?: string
  aspectRatio?: "square" | "video" | "auto"
}

export const ImagePreviewDialog = ({
  isOpen,
  onClose,
  imageUrl,
  title = "Image Preview",
  aspectRatio = "auto",
}: ImagePreviewDialogProps) => {
  if (!imageUrl) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="hidden max-h-[90vh] w-fit max-w-[92vw] gap-0 overflow-hidden rounded-2xl border border-slate-200/60 bg-transparent p-0 shadow-2xl outline-none sm:grid"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-transparent">
          {/* Floating Cross Button in Corner */}
          <DialogClose
            render={
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 z-30 flex size-8.5 cursor-pointer items-center justify-center text-slate-700 transition-all hover:scale-105 active:scale-95"
                aria-label="Close"
                title="Close"
              >
                <X className="size-4.5" />
              </button>
            }
          />

          {/* Uncropped full image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="block h-auto max-h-[86vh] w-auto max-w-[90vw] rounded-2xl object-contain shadow-2xl select-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
