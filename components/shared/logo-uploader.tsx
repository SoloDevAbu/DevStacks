"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, AlertCircle, Check, Loader2, Sparkles, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useUploadImage } from "@/hooks/storage/use-upload-image"
import { validateLogoAspectRatio, formatFileSize } from "@/utils/images"
import { STORAGE_CONFIG } from "@/constants/storage"
import { cn } from "@/lib/utils"
import {
  uploaderDropzoneBase,
  uploaderDropzoneActive,
  uploaderAspectNotice,
} from "@/utils/styles"

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, isPending: isUploading, progress } = useUploadImage()

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
        `Logo must be under ${STORAGE_CONFIG.LOGO.MAX_SIZE_BYTES / (1024 * 1024)}MB. Your file is ${formatFileSize(file.size)}.`
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
      toast.success("Logo Uploaded", "Your 1:1 logo has been uploaded to storage.")
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
    onChange("")
    toast.info("Logo Removed", "Reverted to auto-detected website favicon.")
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={STORAGE_CONFIG.LOGO.ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Square Preview Slot */}
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 p-1.5 shadow-2xs">
          {currentDisplayUrl ? (
            <div className="relative size-full overflow-hidden rounded-lg bg-white border border-slate-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentDisplayUrl}
                alt="Product logo"
                className="size-full object-contain p-1"
              />
              {isCustomUploaded && !disabled && !isUploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-slate-900/80 text-white transition-opacity hover:bg-red-600"
                  title="Remove custom logo"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
              <ImageIcon className="size-6" />
              <span className="font-mono text-[9px] font-semibold uppercase">
                1:1 Logo
              </span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-2xs gap-1">
              <Loader2 className="size-5 animate-spin text-slate-900" />
              <span className="font-mono text-[10px] font-bold text-slate-700">
                {progress}%
              </span>
            </div>
          )}
        </div>

        {/* Action Controls & Aspect Notice */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 text-xs"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="size-3.5" />
                  <span>{isCustomUploaded ? "Change Logo" : "Upload 1:1 Logo"}</span>
                </>
              )}
            </Button>

            {isCustomUploaded ? (
              <Badge
                variant="outline"
                className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
              >
                <Check className="size-3 text-emerald-600" />
                <span>Custom Logo</span>
              </Badge>
            ) : fallbackFaviconUrl ? (
              <Badge
                variant="secondary"
                className="gap-1 text-[10px] text-slate-600"
              >
                <Sparkles className="size-3 text-amber-500" />
                <span>Auto Favicon</span>
              </Badge>
            ) : null}

            <span className={uploaderAspectNotice}>
              Ratio: <strong>1:1 (Square)</strong> • Max 2MB
            </span>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              uploaderDropzoneBase,
              "py-3 px-4 flex-row gap-2.5 justify-start text-left",
              isDragging && uploaderDropzoneActive,
              (disabled || isUploading) && "pointer-events-none opacity-60"
            )}
          >
            <Upload className="size-4 shrink-0 text-slate-400" />
            <p className="text-xs text-slate-500">
              Drag & drop a square image or click to browse (PNG, JPG, WebP, SVG).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
