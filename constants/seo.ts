// Catalog tools people search as "is <tool> free" (measured volume, not guesses). Only these swap
// their title to the question; maker-submitted tools keep the name-and-tagline title people search.
export const IS_FREE_TITLE_TOOL_SLUGS: ReadonlySet<string> = new Set([
  "docker",
  "cursor",
  "postgresql",
  "github-copilot",
  "redis",
  "supabase",
  "vercel",
  "playwright",
  "nextjs",
  "stripe",
  "firebase",
])
