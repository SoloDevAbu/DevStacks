"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export const ProductLogo = ({
  text,
  bgColor = "bg-slate-900",
  textColor = "text-white",
  borderColor,
  className,
  imageUrl,
  alt,
}: {
  text: string
  bgColor?: string
  textColor?: string
  borderColor?: string
  className?: string
  imageUrl?: string | null
  alt?: string
}) => {
  const [imageFailed, setImageFailed] = useState(false)

  if (imageUrl && !imageFailed) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-white select-none",
          borderColor,
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt ?? text}
          className="size-full max-h-full max-w-full object-contain p-2 transition-transform duration-200 group-hover:scale-105"
          onError={() => setImageFailed(true)}
          loading="lazy"
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
