import { isSafeUrl } from "@/lib/ai/url-security"
import { SITE_CONFIG } from "@/constants/site"
import { FREE_TOOL_FETCH } from "@/constants/free-tools"

export interface PublicResource {
  status: number
  contentType: string
  body: string
  finalUrl: string
}

const readCapped = async (response: Response, maxBytes: number) => {
  const reader = response.body?.getReader()
  if (!reader) return (await response.text()).slice(0, maxBytes)

  const decoder = new TextDecoder("utf-8")
  let text = ""
  let received = 0
  while (received < maxBytes) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.length
    text += decoder.decode(value, { stream: true })
  }
  await reader.cancel().catch(() => undefined)
  return text.slice(0, maxBytes)
}

// Follows redirects by hand so every hop is re-checked: a public URL must not bounce the fetch
// into a private or loopback address.
export const fetchPublicResource = async (
  url: string,
  accept = "text/html,*/*;q=0.8"
): Promise<PublicResource | null> => {
  let current = url

  for (let hop = 0; hop <= FREE_TOOL_FETCH.MAX_REDIRECTS; hop += 1) {
    if (!isSafeUrl(current).safe) return null

    const controller = new AbortController()
    const timer = setTimeout(
      () => controller.abort(),
      FREE_TOOL_FETCH.TIMEOUT_MS
    )
    try {
      const response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: accept,
          "User-Agent": `Mozilla/5.0 (compatible; ${SITE_CONFIG.name}-AI-Readiness/1.0; +${SITE_CONFIG.url})`,
        },
      })

      const location = response.headers.get("location")
      if (response.status >= 300 && response.status < 400 && location) {
        current = new URL(location, current).toString()
        continue
      }

      return {
        status: response.status,
        contentType: response.headers.get("content-type") ?? "",
        body: await readCapped(response, FREE_TOOL_FETCH.MAX_BYTES),
        finalUrl: current,
      }
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  }

  return null
}
