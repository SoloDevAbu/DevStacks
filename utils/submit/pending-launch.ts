import { PENDING_PREMIUM_STORAGE_PREFIX } from "@/constants/submit"

// Premium-only fields are dropped when a listing is created Free, so the paid-in-flow path keeps
// them in this tab until checkout returns and re-applies them to the upgraded listing.
export interface PendingLaunch {
  id: string
  slug: string
  name: string
  type: "product" | "tool"
  websiteUrl: string
  tier: string
  premiumFields: Record<string, unknown>
}

const storageKey = (itemId: string) =>
  `${PENDING_PREMIUM_STORAGE_PREFIX}${itemId}`

export const savePendingLaunch = (launch: PendingLaunch) => {
  try {
    sessionStorage.setItem(storageKey(launch.id), JSON.stringify(launch))
  } catch {}
}

export const readPendingLaunch = (itemId: string): PendingLaunch | null => {
  try {
    const raw = sessionStorage.getItem(storageKey(itemId))
    return raw ? (JSON.parse(raw) as PendingLaunch) : null
  } catch {
    return null
  }
}

export const clearPendingLaunch = (itemId: string) => {
  try {
    sessionStorage.removeItem(storageKey(itemId))
  } catch {}
}
