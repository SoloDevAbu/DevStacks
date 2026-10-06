"use client"

import { useEffect } from "react"
import { trackViewAlternative } from "@/lib/analytics/events"

interface GaAlternativeViewTrackerProps {
  alternativeSlug: string
  itemName: string
  category?: string | null
}

export const GaAlternativeViewTracker = ({
  alternativeSlug,
  itemName,
  category,
}: GaAlternativeViewTrackerProps) => {
  useEffect(() => {
    trackViewAlternative({
      alternativeSlug,
      itemName,
      category,
    })
  }, [alternativeSlug, itemName, category])

  return null
}
