"use client"

import { useState, useRef } from "react"
import { Upload, Trash2, Loader2, ImagePlus, Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useUploadImage } from "@/hooks/storage/use-upload-image"
import { useDeleteImage } from "@/hooks/storage/use-delete-image"
import { formatFileSize } from "@/utils/images"
import { STORAGE_CONFIG } from "@/constants/storage"
import { ImagePreviewDialog } from "@/components/shared/image-preview-dialog"
import { cn } from "@/lib/utils"

interface ScreenshotsUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
  className?: string
}

export const ScreenshotsUploader = ({
  value = [],
  onChange,
  disabled = false,
  className,
}: ScreenshotsUploaderProps) => {
  const [draggedOverSlot, setDraggedOverSlot] = useState<number | null>(null)
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(
    null
  )
  const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(
    null
  )
  const targetSlotRef = useRef<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, isPending: isUploading, progress } = useUploadImage()
  const { deleteImage } = useDeleteImage()

  const maxCount = STORAGE_CONFIG.SCREENSHOTS.MAX_COUNT
  const isFull = value.length >= maxCount

  const handleFileProcess = async (file: File, targetSlot: number) => {
    if (disabled || isUploading) return

    const allowed = STORAGE_CONFIG.SCREENSHOTS
      .ALLOWED_TYPES as readonly string[]
    if (!allowed.includes(file.type)) {
      toast.error(
        "Unsupported File Type",
        "Please select a PNG, JPG, or WebP screenshot."
      )
      return
    }

    if (file.size > STORAGE_CONFIG.SCREENSHOTS.MAX_SIZE_BYTES) {
      toast.error(
        "File Too Large",
        `Screenshot must be under ${STORAGE_CONFIG.SCREENSHOTS.MAX_SIZE_BYTES / (1024 * 1024)}MB. Your file is ${formatFileSize(file.size)}.`
      )
      return
    }

    try {
      setUploadingSlotIndex(targetSlot)
      const publicUrl = await uploadImage({
        kind: "screenshot",
        file,
      })

      // Replace target slot if replacing an existing one, or append if targetSlot >= value.length
      const updated = [...value]
      if (targetSlot < updated.length) {
        updated[targetSlot] = publicUrl
      } else {
        updated.push(publicUrl)
      }

      onChange(updated)
      toast.success(
        "Screenshot Uploaded",
        `Screenshot #${targetSlot + 1} uploaded successfully.`
      )
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to upload screenshot"
      toast.error("Upload Failed", msg)
    } finally {
      setUploadingSlotIndex(null)
    }
  }

  const handleSlotClick = (slotIdx: number) => {
    if (disabled || isUploading) return
    targetSlotRef.current = slotIdx
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault()
    if (!disabled && !isUploading) setDraggedOverSlot(slotIdx)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDraggedOverSlot(null)
  }

  const handleDrop = async (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault()
    setDraggedOverSlot(null)
    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      await handleFileProcess(file, slotIdx)
    }
  }

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileProcess(file, targetSlotRef.current)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation()
    if (disabled || isUploading) return
    const removedUrl = value[indexToRemove]
    const updated = value.filter((_, i) => i !== indexToRemove)
    onChange(updated)
    toast.info(
      "Screenshot Removed",
      `Now ${updated.length} of ${maxCount} uploaded.`
    )
    if (
      removedUrl &&
      (removedUrl.includes(`/${STORAGE_CONFIG.BUCKET_NAME}/`) ||
        removedUrl.includes("/screenshots/"))
    ) {
      deleteImage(removedUrl).catch(() => {})
    }
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={STORAGE_CONFIG.SCREENSHOTS.ALLOWED_TYPES.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge
            variant={isFull ? "default" : "outline"}
            className={cn(
              "font-mono text-xs font-semibold",
              isFull && "bg-slate-900 text-white"
            )}
          >
            {value.length} / {maxCount} Screenshots
          </Badge>
          <span className="text-xs text-slate-500">
            Showcase your app interface, dashboards, and workflows.
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
          Recommended: 16:9 Video Ratio • Max 1MB each
        </span>
      </div>

      {/* Grid of 3 fixed slots */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: maxCount }).map((_, slotIdx) => {
          const screenshotUrl = value[slotIdx]
          const isSlotUploading = isUploading && uploadingSlotIndex === slotIdx
          const isSlotDraggedOver = draggedOverSlot === slotIdx

          // CASE 1: Uploading slot
          if (isSlotUploading) {
            return (
              <div
                key={`slot-${slotIdx}-uploading`}
                className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-indigo-400 bg-indigo-50/50 p-4 text-center shadow-2xs"
              >
                <Loader2 className="size-6 animate-spin text-indigo-600" />
                <span className="mt-2 font-mono text-xs font-bold text-indigo-950">
                  Uploading {progress}%
                </span>
                <span className="text-[10px] font-medium text-indigo-600">
                  Screenshot #{slotIdx + 1}
                </span>
              </div>
            )
          }

          // CASE 2: Uploaded screenshot present
          if (screenshotUrl) {
            return (
              <div
                key={`slot-${slotIdx}-${screenshotUrl}`}
                onClick={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.innerWidth >= 640
                  ) {
                    setActivePreviewIndex(slotIdx)
                  }
                }}
                className="group/thumb relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-950/5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs sm:cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshotUrl}
                  alt={`Screenshot ${slotIdx + 1}`}
                  className="size-full object-contain p-0.5 transition-transform duration-300 sm:group-hover/thumb:scale-102"
                />

                {/* Badge Number */}
                <div className="absolute top-2 left-2 z-10">
                  <Badge
                    variant="secondary"
                    className="backdrop-blur-2xs bg-slate-900/80 font-mono text-[10px] font-semibold text-white shadow-2xs"
                  >
                    #{slotIdx + 1}
                  </Badge>
                </div>

                {/* Hover overlay with zoom icon (Desktop/Tablet only) */}
                <div className="absolute inset-0 hidden items-center justify-center bg-slate-950/0 transition-colors group-hover/thumb:bg-slate-950/40 sm:flex">
                  <div className="backdrop-blur-2xs flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/thumb:opacity-100">
                    <Maximize2 className="size-3" />
                    <span>View Larger</span>
                  </div>
                </div>

                {/* Remove button */}
                {!disabled && !isUploading && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, slotIdx)}
                    className="absolute top-2 right-2 z-20 flex size-7 cursor-pointer items-center justify-center rounded-lg bg-slate-900/85 text-white shadow-xs transition-colors hover:bg-rose-600"
                    title="Remove screenshot"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            )
          }

          // CASE 3: Empty slot placeholder
          return (
            <div
              key={`slot-${slotIdx}-empty`}
              onDragOver={(e) => handleDragOver(e, slotIdx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slotIdx)}
              onClick={() => handleSlotClick(slotIdx)}
              className={cn(
                "group/empty relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center shadow-2xs transition-all hover:border-slate-400 hover:bg-slate-50/70",
                isSlotDraggedOver &&
                  "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20",
                disabled && "pointer-events-none opacity-60"
              )}
            >
              <div className="absolute top-2 left-2">
                <Badge
                  variant="outline"
                  className="border-slate-200 font-mono text-[9px] font-semibold text-slate-400"
                >
                  Slot #{slotIdx + 1}
                </Badge>
              </div>

              <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover/empty:bg-slate-200 group-hover/empty:text-slate-700">
                <ImagePlus className="size-4.5" />
              </div>

              <div className="mt-2 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-700 group-hover/empty:text-slate-950">
                  Add Screenshot #{slotIdx + 1}
                </span>
                <span className="text-[11px] text-slate-400">
                  Drag & drop or click to upload
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox Dialog to view active screenshot full size */}
      <ImagePreviewDialog
        isOpen={activePreviewIndex !== null}
        onClose={() => setActivePreviewIndex(null)}
        imageUrl={
          activePreviewIndex !== null ? value[activePreviewIndex] : null
        }
        title={`Screenshot #${(activePreviewIndex ?? 0) + 1} Preview`}
        aspectRatio="video"
      />
    </div>
  )
}
