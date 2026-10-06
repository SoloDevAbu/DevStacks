"use client"

import { useEffect } from "react"
import { trackViewItem } from "@/lib/analytics/events"

interface GaItemViewTrackerProps {
  itemId: string
  itemName: string
  itemCategory?: string | null
  itemType: "product" | "tool"
  slug: string
  tier?: string | null
}

export const GaItemViewTracker = ({
  itemId,
  itemName,
  itemCategory,
  itemType,
  slug,
  tier,
}: GaItemViewTrackerProps) => {
  useEffect(() => {
    trackViewItem({
      itemId,
      itemName,
      itemCategory,
      itemType,
      slug,
      tier,
    })
  }, [itemId, itemName, itemCategory, itemType, slug, tier])

  return null
}
