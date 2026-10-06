"use client"

import { sendGAEvent } from "@next/third-parties/google"

export interface ViewItemParams {
  itemId: string
  itemName: string
  itemCategory?: string | null
  itemType: "product" | "tool"
  slug: string
  tier?: string | null
}

export interface ViewAlternativeParams {
  alternativeSlug: string
  itemName: string
  category?: string | null
}

export interface SubmitProductParams {
  itemId: string
  itemName: string
  itemSlug: string
  itemType: "product" | "tool"
  category?: string | null
  pricing?: string | null
}

export interface OutboundClickParams {
  linkUrl: string
  itemId?: string | null
  itemName?: string | null
  itemType?: "product" | "tool" | null
  slug?: string | null
}

export interface BeginCheckoutParams {
  value?: number
  currency?: string
  paymentType: "ad" | "listing"
  itemName: string
  placement?: string
  tier?: string
}

export interface PurchaseParams {
  transactionId: string
  value?: number
  currency?: string
  paymentType?: string
}

const PURCHASE_STORAGE_KEY = "launchnests_tracked_purchases"

const dispatchGAEvent = (eventName: string, params: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return

  try {
    const gtagFn = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtagFn === "function") {
      gtagFn("event", eventName, params)
    } else {
      sendGAEvent("event", eventName, params)
    }
  } catch (error) {
    console.debug("Failed to dispatch GA4 event", error)
  }
}

export const trackLogin = (method = "google") => {
  dispatchGAEvent("login", { method })
}

export const trackSignUp = (method = "google") => {
  dispatchGAEvent("sign_up", { method })
}

export const trackViewItem = ({
  itemId,
  itemName,
  itemCategory,
  itemType,
  slug,
  tier,
}: ViewItemParams) => {
  dispatchGAEvent("view_item", {
    item_id: itemId,
    item_name: itemName,
    item_category: itemCategory || undefined,
    item_type: itemType,
    slug,
    tier: tier || undefined,
    items: [
      {
        item_id: itemId,
        item_name: itemName,
        item_category: itemCategory || undefined,
        item_variant: tier || undefined,
      },
    ],
  })
}

export const trackViewAlternative = ({
  alternativeSlug,
  itemName,
  category,
}: ViewAlternativeParams) => {
  dispatchGAEvent("view_alternative", {
    alternative_slug: alternativeSlug,
    item_name: itemName,
    category: category || undefined,
  })
}

export const trackSubmitProduct = ({
  itemId,
  itemName,
  itemSlug,
  itemType,
  category,
  pricing,
}: SubmitProductParams) => {
  dispatchGAEvent("submit_product", {
    item_id: itemId,
    item_name: itemName,
    item_slug: itemSlug,
    item_type: itemType,
    category: category || undefined,
    pricing: pricing || undefined,
  })
}

export const trackOutboundClick = ({
  linkUrl,
  itemId,
  itemName,
  itemType,
  slug,
}: OutboundClickParams) => {
  if (!linkUrl) return

  let linkDomain: string | undefined
  try {
    linkDomain = new URL(linkUrl).hostname
  } catch {
    linkDomain = undefined
  }

  dispatchGAEvent("outbound_click", {
    link_url: linkUrl,
    link_domain: linkDomain,
    item_id: itemId || undefined,
    item_name: itemName || undefined,
    item_type: itemType || undefined,
    slug: slug || undefined,
  })
}

export const trackSearch = (searchTerm: string) => {
  const trimmed = searchTerm.trim()
  if (!trimmed) return
  dispatchGAEvent("search", {
    search_term: trimmed,
  })
}

export const trackBeginCheckout = ({
  value,
  currency = "USD",
  paymentType,
  itemName,
  placement,
  tier,
}: BeginCheckoutParams) => {
  dispatchGAEvent("begin_checkout", {
    currency,
    value: typeof value === "number" ? value : undefined,
    payment_type: paymentType,
    item_name: itemName,
    placement: placement || undefined,
    tier: tier || undefined,
    items: [
      {
        item_name: itemName,
        item_category: paymentType,
        price: typeof value === "number" ? value : undefined,
      },
    ],
  })
}

export const isPurchaseTracked = (paymentId: string): boolean => {
  if (typeof window === "undefined" || !paymentId) return true
  try {
    const raw = localStorage.getItem(PURCHASE_STORAGE_KEY)
    const tracked: string[] = raw ? JSON.parse(raw) : []
    return Array.isArray(tracked) && tracked.includes(paymentId)
  } catch {
    return false
  }
}

export const markPurchaseTracked = (paymentId: string) => {
  if (typeof window === "undefined" || !paymentId) return
  try {
    const raw = localStorage.getItem(PURCHASE_STORAGE_KEY)
    const tracked: string[] = raw ? JSON.parse(raw) : []
    if (Array.isArray(tracked)) {
      if (!tracked.includes(paymentId)) {
        tracked.push(paymentId)
        localStorage.setItem(
          PURCHASE_STORAGE_KEY,
          JSON.stringify(tracked.slice(-50))
        )
      }
    }
  } catch {
    // Non-blocking storage failure fallback
  }
}

export const trackPurchase = ({
  transactionId,
  value,
  currency = "USD",
  paymentType,
}: PurchaseParams) => {
  if (!transactionId || isPurchaseTracked(transactionId)) return

  dispatchGAEvent("purchase", {
    transaction_id: transactionId,
    currency,
    value: typeof value === "number" ? value : undefined,
    payment_type: paymentType || undefined,
  })

  markPurchaseTracked(transactionId)
}
