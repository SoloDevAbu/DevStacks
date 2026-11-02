import { getCloudflareContext } from "@opennextjs/cloudflare"
import { toAbsoluteUrl } from "@/utils/urls"

// A Worker cannot reach its own custom domain with a plain fetch, so warm-up requests go through
// the WORKER_SELF_REFERENCE service binding. Sequential on purpose: each request regenerates one
// page, and running them together would compete for the same database connections.
export const warmPaths = async (paths: readonly string[]): Promise<void> => {
  const selfReference = getCloudflareContext().env.WORKER_SELF_REFERENCE
  const fetcher = selfReference
    ? (url: string) => selfReference.fetch(url)
    : (url: string) => fetch(url)

  for (const path of paths) {
    try {
      const response = await fetcher(toAbsoluteUrl(path))
      await response.arrayBuffer()
    } catch (error) {
      console.error(`[Cache warm] ${path} failed:`, error)
    }
  }
}
