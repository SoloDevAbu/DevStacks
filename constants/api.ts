// Bounds for the public /v1 REST API query params.
export const V1_PAGE = { fallback: 1, min: 1, max: 10_000 } as const
export const V1_LIMIT = { fallback: 20, min: 1, max: 60 } as const
export const V1_SEARCH_LIMIT = { fallback: 10, min: 1, max: 30 } as const
export const V1_LEADERBOARD_LIMIT = { fallback: 20, min: 1, max: 50 } as const
