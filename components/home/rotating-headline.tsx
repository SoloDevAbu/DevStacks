"use client"

import { useEffect, useState } from "react"
import {
  HOME_HERO_ROTATING_OPTIONS,
  HOME_HERO_PREFIX,
  HOME_ROTATION_INTERVAL_MS,
  type RotatingHeadlineOption,
} from "@/constants/home"
import { homeHeroRotatingText } from "@/utils/styles"
import { cn } from "@/lib/utils"

interface RotatingHeadlineProps {
  prefix?: string
  options?: readonly RotatingHeadlineOption[]
  intervalMs?: number
  className?: string
}

export const RotatingHeadline = ({
  prefix = HOME_HERO_PREFIX,
  options = HOME_HERO_ROTATING_OPTIONS,
  intervalMs = HOME_ROTATION_INTERVAL_MS,
  className,
}: RotatingHeadlineProps) => {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (options.length <= 1) return

    const timer = setInterval(() => {
      setIsVisible(false)

      const switchTimer = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % options.length)
        setIsVisible(true)
      }, 200)

      return () => clearTimeout(switchTimer)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [options.length, intervalMs])

  const currentOption = options[index] ?? options[0]

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5", className)}>
      <span>{prefix}</span>
      <span
        aria-live="polite"
        className={cn(
          homeHeroRotatingText,
          currentOption?.colorClass,
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-1 opacity-0"
        )}
      >
        {currentOption?.text}
      </span>
    </span>
  )
}

