"use client"

import { useEffect, useRef } from "react"

interface UseScrollRestorationOptions {
  key: string
  filterKey: string
  enabled?: boolean
  hasData?: boolean
}

export const useScrollRestoration = ({
  key,
  filterKey,
  enabled = true,
  hasData = true,
}: UseScrollRestorationOptions) => {
  const hasRestoredRef = useRef(false)
  const lastFilterKeyRef = useRef(filterKey)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (lastFilterKeyRef.current !== filterKey) {
      lastFilterKeyRef.current = filterKey
      hasRestoredRef.current = false
      try {
        sessionStorage.removeItem(key)
      } catch {
        // Safe catch for storage access restrictions in iframe/private browsing
      }
    }
  }, [filterKey, key])

  useEffect(() => {
    if (typeof window === "undefined" || !enabled || !hasData || hasRestoredRef.current) return

    try {
      const raw = sessionStorage.getItem(key)
      if (!raw) return

      const parsed = JSON.parse(raw) as { scrollY?: number; filterKey?: string }
      if (
        typeof parsed.scrollY === "number" &&
        parsed.scrollY > 0 &&
        parsed.filterKey === filterKey
      ) {
        hasRestoredRef.current = true
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parsed.scrollY,
            behavior: "auto",
          })
        })
      }
    } catch {
      // Safe catch for invalid JSON or storage access errors
    }
  }, [enabled, hasData, key, filterKey])

  useEffect(() => {
    if (typeof window === "undefined" || !enabled) return

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const savePosition = () => {
      const scrollY = window.scrollY
      try {
        if (scrollY > 100) {
          sessionStorage.setItem(
            key,
            JSON.stringify({ scrollY, filterKey })
          )
        } else {
          sessionStorage.removeItem(key)
        }
      } catch {
        // Safe catch for storage quota or restrictions
      }
    }

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(savePosition, 150)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("beforeunload", savePosition)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      savePosition()
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("beforeunload", savePosition)
    }
  }, [enabled, key, filterKey])
}
