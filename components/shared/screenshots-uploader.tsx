"use client"

import { useState, useRef } from "react"
import { Upload, Trash2, Loader2, ImagePlus, AlertCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useUploadImage } from "@/hooks/storage/use-upload-image"
import { formatFileSize } from "@/utils/images"
import { STORAGE_CONFIG } from "@/constants/storage"
import { cn } from "@/lib/utils"
import {
  uploaderDropzoneBase,
  uploaderDropzoneActive,
  uploaderThumbnailCard,
  uploaderAspectNotice,
} from "@/utils/styles"

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
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, isPending: isUploading, progress } = useUploadImage()

  const maxCount = STORAGE_CONFIG.SCREENSHOTS.MAX_COUNT
  const isFull = value.length >= maxCount

  const handleFileProcess = async (file: File) => {
    if (disabled || isUploading) return

    if (value.length >= maxCount) {
      toast.error(
        "Screenshot Limit Reached",
        `You can upload a maximum of ${maxCount} screenshots.`
      )
      return
    }

    const allowed = STORAGE_CONFIG.SCREENSHOTS.ALLOWED_TYPES as readonly string[]
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
      const publicUrl = await uploadImage({
        kind: "screenshot",
        file,
      })
      onChange([...value, publicUrl])
      toast.success(
        "Screenshot Uploaded",
        `Added screenshot ${value.length + 1} of ${maxCount}.`
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload screenshot"
      toast.error("Upload Failed", msg)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading && !isFull) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isUploading || isFull) return

    const files = Array.from(e.dataTransfer.files)
    for (const file of files) {
      if (value.length >= maxCount) break
      await handleFileProcess(file)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    for (const file of files) {
      if (value.length >= maxCount) break
      await handleFileProcess(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (indexToRemove: number) => {
    if (disabled || isUploading) return
    const updated = value.filter((_, i) => i !== indexToRemove)
    onChange(updated)
    toast.info("Screenshot Removed", `Now ${updated.length} of ${maxCount} uploaded.`)
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={STORAGE_CONFIG.SCREENSHOTS.ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading || isFull}
        multiple={maxCount - value.length > 1}
      />

      <div className="flex items-center justify-between">
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
            Showcase your app dashboard, marketing hero, or workflow.
          </span>
        </div>

        <span className={uploaderAspectNotice}>
          Recommended: 16:9 Desktop Preview • Max 5MB each
        </span>
      </div>

      {/* Grid of 3 slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((url, idx) => (
          <div key={url} className={uploaderThumbnailCard}>
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Screenshot ${idx + 1}`}
                className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute top-2 left-2">
                <Badge
                  variant="secondary"
                  className="bg-slate-900/80 font-mono text-[10px] text-white shadow-2xs backdrop-blur-2xs"
                >
                  #{idx + 1}
                </Badge>
              </div>
              {!disabled && !isUploading && (
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-lg bg-slate-900/85 text-white shadow-xs transition-colors hover:bg-red-600"
                  title="Remove screenshot"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Uploading indicator slot */}
        {isUploading && (
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-indigo-300 bg-indigo-50/40 p-4 text-center">
            <Loader2 className="size-6 animate-spin text-indigo-600" />
            <span className="mt-2 font-mono text-xs font-bold text-indigo-900">
              Uploading {progress}%
            </span>
            <span className="text-[11px] text-indigo-600/80">
              Direct to Neon Storage
            </span>
          </div>
        )}

        {/* Remaining empty slot trigger */}
        {!isFull && !isUploading && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              uploaderDropzoneBase,
              "aspect-video p-4 justify-center gap-2",
              isDragging && uploaderDropzoneActive,
              disabled && "pointer-events-none opacity-60"
            )}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-200">
              <ImagePlus className="size-4.5" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-800">
                Add Screenshot ({value.length + 1} of {maxCount})
              </span>
              <span className="text-[11px] text-slate-400">
                Drag & drop or click to upload
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
