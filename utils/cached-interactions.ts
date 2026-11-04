import type { UserInteractionsData } from "@/lib/api/users"

const STORAGE_KEY = "launchnests:interactions:v1"

// Counts are left out on purpose: an old count could be behind the page, while which items the
// user voted on or bookmarked rarely changes between visits.
export type CachedInteractions = Omit<
  UserInteractionsData,
  "productLikeCounts" | "toolUpvoteCounts"
>

interface StoredInteractions {
  userId: string
  interactions: CachedInteractions
}

let stored: StoredInteractions | null | undefined

const readStored = (): StoredInteractions | null => {
  if (stored !== undefined) return stored

  try {
    stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "null"
    ) as StoredInteractions | null
  } catch {
    stored = null
  }

  return stored
}

// Without a userId the session is still loading, so the last signed-in user is the best guess.
export const getCachedInteractions = (
  userId?: string
): CachedInteractions | undefined => {
  const entry = readStored()
  if (!entry || (userId && entry.userId !== userId)) return undefined
  return entry.interactions
}

export const cacheInteractions = (
  userId: string,
  data: UserInteractionsData
) => {
  stored = {
    userId,
    interactions: {
      upvotedToolSlugs: data.upvotedToolSlugs,
      bookmarkedToolIds: data.bookmarkedToolIds,
      bookmarkedToolSlugs: data.bookmarkedToolSlugs,
      likedProductSlugs: data.likedProductSlugs,
      bookmarkedProductIds: data.bookmarkedProductIds,
      bookmarkedProductSlugs: data.bookmarkedProductSlugs,
    },
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage can be blocked or full. Highlights then wait for the network.
  }
}

export const clearCachedInteractions = () => {
  stored = null

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing was stored if storage is unavailable.
  }
}
