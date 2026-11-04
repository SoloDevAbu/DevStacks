import type { ItemKind } from "@/constants/items"

const STORAGE_KEY = "launchnests:recent-votes:v1"
const TTL_MS = 5 * 60 * 1000

interface RecentVote {
  count: number
  at: number
}

type RecentVotes = Record<string, RecentVote>

let cachedVotes: RecentVotes | null = null

const getKey = (kind: ItemKind, slug: string) => `${kind}:${slug}`

const isFresh = ({ at }: RecentVote) => Date.now() - at < TTL_MS

const readVotes = (): RecentVotes => {
  if (cachedVotes) return cachedVotes

  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "{}"
    ) as RecentVotes
    cachedVotes = Object.fromEntries(
      Object.entries(stored).filter(([, vote]) => isFresh(vote))
    )
  } catch {
    cachedVotes = {}
  }

  return cachedVotes
}

export const getRecentVoteCount = (
  kind: ItemKind,
  slug: string
): number | undefined => {
  const vote = readVotes()[getKey(kind, slug)]
  return vote && isFresh(vote) ? vote.count : undefined
}

// An unvoted item leaves the user's voted set, so nothing on the server can correct the cached page
// for them until it regenerates. This bridges that window across a reload.
export const rememberRecentVote = (
  kind: ItemKind,
  slug: string,
  count: number
) => {
  const votes = {
    ...readVotes(),
    [getKey(kind, slug)]: { count, at: Date.now() },
  }
  cachedVotes = votes

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes))
  } catch {
    // Storage can be blocked or full. The count then falls back to the server value.
  }
}
