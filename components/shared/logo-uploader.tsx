"use client"

import { useState, useRef } from "react"
import {
  Upload,
  X,
  Check,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Maximize2,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useUploadImage } from "@/hooks/storage/use-upload-image"
import { useDeleteImage } from "@/hooks/storage/use-delete-image"
import { validateLogoAspectRatio, formatFileSize } from "@/utils/images"
import { STORAGE_CONFIG } from "@/constants/storage"
import { cn } from "@/lib/utils"

interface LogoUploaderProps {
  value?: string
  fallbackFaviconUrl?: string | null
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
}

export const LogoUploader = ({
  value,
  fallbackFaviconUrl,
  onChange,
  disabled = false,
  className,
}: LogoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, isPending: isUploading, progress } = useUploadImage()
  const { deleteImage } = useDeleteImage()

  const currentDisplayUrl = value?.trim() || fallbackFaviconUrl || ""
  const isCustomUploaded = Boolean(value?.trim())

  const handleFileProcess = async (file: File) => {
    if (disabled || isUploading) return

    const allowed = STORAGE_CONFIG.LOGO.ALLOWED_TYPES as readonly string[]
    if (!allowed.includes(file.type)) {
      toast.error(
        "Unsupported File Type",
        "Please select a PNG, JPG, WebP, or SVG logo."
      )
      return
    }

    if (file.size > STORAGE_CONFIG.LOGO.MAX_SIZE_BYTES) {
      toast.error(
        "File Too Large",
        `Logo must be under 500KB (0.5MB). Your file is ${formatFileSize(file.size)}.`
      )
      return
    }

    const validation = await validateLogoAspectRatio(file)
    if (!validation.valid) {
      toast.error(
        "1:1 Aspect Ratio Required",
        validation.error || "The logo must be square (1:1 aspect ratio)."
      )
      return
    }

    try {
      const publicUrl = await uploadImage({
        kind: "logo",
        file,
      })
      onChange(publicUrl)
      toast.success(
        "Logo Uploaded",
        "Your 1:1 logo has been uploaded to storage."
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload logo"
      toast.error("Upload Failed", msg)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      await handleFileProcess(file)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileProcess(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    const previousUrl = value?.trim()
    onChange("")
    toast.info(
      "Custom Logo Cleared",
      "Reverted to auto-detected website favicon."
    )
    if (
      previousUrl &&
      (previousUrl.includes(`/${STORAGE_CONFIG.BUCKET_NAME}/`) ||
        previousUrl.includes("/logos/"))
    ) {
      deleteImage(previousUrl).catch(() => {})
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={STORAGE_CONFIG.LOGO.ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Unified Single Uploader Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-4 shadow-2xs transition-all sm:flex-row sm:items-center",
          isDragging &&
            "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20",
          (disabled || isUploading) && "opacity-80"
        )}
      >
        {/* 1:1 Square Preview Slot (Clickable to view bigger) */}
        <div
          onClick={() => {
            if (currentDisplayUrl && !isUploading) setIsPreviewOpen(true)
          }}
          className={cn(
            "group/preview relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 transition-all sm:size-22",
            currentDisplayUrl &&
              "cursor-pointer hover:border-slate-400 hover:shadow-xs"
          )}
          title={currentDisplayUrl ? "Click to view larger" : undefined}
        >
          {currentDisplayUrl ? (
            <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentDisplayUrl}
                alt="Product logo"
                className="size-full object-contain p-1.5 transition-transform duration-200 group-hover/preview:scale-105"
              />

              {/* Hover overlay for zoom */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors group-hover/preview:bg-slate-900/30">
                <Maximize2 className="size-4 text-white opacity-0 drop-shadow transition-opacity group-hover/preview:opacity-100" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 p-2 text-center text-slate-400">
              <ImageIcon className="size-5" />
              <span className="font-mono text-[9px] font-semibold uppercase">
                1:1 Logo
              </span>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="backdrop-blur-2xs absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/95">
              <Loader2 className="size-5 animate-spin text-slate-900" />
              <span className="font-mono text-[10px] font-bold text-slate-700">
                {progress}%
              </span>
            </div>
          )}
        </div>

        {/* Info & Unified Actions */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isCustomUploaded ? (
              <Badge
                variant="outline"
                className="gap-1 border-emerald-300 bg-emerald-50 text-[10px] font-semibold text-emerald-800"
              >
                <Check className="size-3 text-emerald-600" />
                <span>Custom 1:1 Logo</span>
              </Badge>
            ) : fallbackFaviconUrl ? (
              <Badge
                variant="secondary"
                className="gap-1 border border-amber-200/80 bg-amber-50 text-[10px] font-semibold text-amber-900"
              >
                <Sparkles className="size-3 text-amber-600" />
                <span>Auto Favicon (Website URL)</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-slate-500">
                No Logo Selected
              </Badge>
            )}

            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              1:1 Square Ratio • Max 500KB (0.5MB)
            </span>
          </div>

          <p className="text-xs leading-normal text-slate-500">
            Upload your official square brand icon (PNG, JPG, WebP, SVG) or drag
            and drop it here.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <Button
              type="button"
              variant={isCustomUploaded ? "outline" : "default"}
              size="sm"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="size-3.5" />
                  <span>
                    {isCustomUploaded ? "Change Logo" : "Upload 1:1 Logo"}
                  </span>
                </>
              )}
            </Button>
            {isCustomUploaded && !disabled && !isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 gap-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset to Favicon</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
