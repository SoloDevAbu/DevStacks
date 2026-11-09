// Each value must stay identical to its entry in wrangler.jsonc, since worker.ts routes a scheduled
// event by its cron string.
export const CRON = {
  ROLLOVER: "0 0 * * 1",
  ROLLOVER_RETRY: "30 0 * * 1",
  BADGE_CHECK: "0 3 * * *",
} as const

// The retry only runs when the first rollover of the week left no marker. Markers live in the R2
// bucket that already backs the incremental cache, under a prefix OpenNext never writes to.
export const ROLLOVER_MARKER_PREFIX = "cron-runs/rollover/"
