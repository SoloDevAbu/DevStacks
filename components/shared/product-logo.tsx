"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getFaviconUrl, getDuckDuckGoFaviconUrl } from "@/utils/urls"

export interface ProductLogoProps {
  text: string
  bgColor?: string
  textColor?: string
  borderColor?: string
  className?: string
  imageClassName?: string
  imageUrl?: string | null
  websiteUrl?: string | null
  alt?: string
}

export const ProductLogo = ({
  text,
  bgColor = "bg-slate-900",
  textColor = "text-white",
  borderColor,
  className,
  imageClassName,
  imageUrl,
  websiteUrl,
  alt,
}: ProductLogoProps) => {
  const primarySrc =
    imageUrl?.trim() || (websiteUrl ? getFaviconUrl(websiteUrl) : null)

  const [currentSrc, setCurrentSrc] = useState<string | null>(primarySrc)
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => {
    setCurrentSrc(primarySrc)
    setHasFailed(false)
  }, [primarySrc])

  const handleError = () => {
    if (websiteUrl && currentSrc && !currentSrc.includes("duckduckgo.com")) {
      const ddgUrl = getDuckDuckGoFaviconUrl(websiteUrl)
      if (ddgUrl && ddgUrl !== currentSrc) {
        setCurrentSrc(ddgUrl)
        return
      }
    }
    setHasFailed(true)
  }

  const isSmall = Boolean(
    className &&
      /\b(size-[4-9]|w-[4-9]|h-[4-9]|size-10|w-10|h-10)\b/.test(className)
  )

  if (currentSrc && !hasFailed) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-white select-none",
          borderColor,
          className
        )}
      >
        <Image
          src={currentSrc}
          alt={alt ?? text}
          fill
          unoptimized
          className={cn(
            "object-contain transition-transform duration-200 group-hover:scale-105",
            isSmall ? "p-0.5" : "p-2",
            imageClassName
          )}
          onError={handleError}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center font-bold tracking-tight select-none",
        bgColor,
        textColor,
        borderColor,
        className
      )}
    >
      {text}
    </div>
  )
}
