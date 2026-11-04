"use client"

import { useLayoutEffect, useRef } from "react"

const FLIP_ANIMATION: KeyframeAnimationOptions = {
  duration: 350,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
}

// Slides each direct child marked with data-flip-id from its old position to its new one when the
// list order changes. offsetTop ignores scroll and running transforms, so an interrupted move still
// measures correctly.
export const useFlipList = <T extends HTMLElement>(orderKey: string) => {
  const containerRef = useRef<T>(null)
  const positionsRef = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    const rows = Array.from(
      containerRef.current?.children ?? []
    ) as HTMLElement[]
    const previous = positionsRef.current
    const next = new Map(
      rows.map((row) => [row.dataset.flipId ?? "", row.offsetTop])
    )
    positionsRef.current = next

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return

    rows.forEach((row) => {
      const id = row.dataset.flipId ?? ""
      const before = previous.get(id)
      const after = next.get(id)
      if (before === undefined || after === undefined || before === after) {
        return
      }

      row.animate(
        [
          { transform: `translateY(${before - after}px)` },
          { transform: "translateY(0)" },
        ],
        FLIP_ANIMATION
      )
    })
  }, [orderKey])

  return containerRef
}
