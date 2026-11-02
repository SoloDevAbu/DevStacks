import { INDEXNOW } from "@/constants/indexnow"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { toAbsoluteUrl } from "@/utils/urls"

// IndexNow tells Bing (the index behind ChatGPT search and Copilot), Yandex, Seznam and Naver that
// URLs changed, instead of waiting for their next crawl. Without INDEXNOW_KEY (local/dev) it no-ops.
export const submitToIndexNow = async (paths: string[]): Promise<void> => {
  const key = process.env.INDEXNOW_KEY
  const urlList = [...new Set(paths.map(toAbsoluteUrl))].slice(
    0,
    INDEXNOW.MAX_URLS_PER_REQUEST
  )
  if (!key || urlList.length === 0) return

  try {
    const response = await fetch(INDEXNOW.ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: SITE_CONFIG.domain,
        key,
        keyLocation: toAbsoluteUrl(ROUTES.INDEXNOW_KEY),
        urlList,
      }),
    })
    if (!response.ok) {
      console.error(
        `[IndexNow] Submission rejected (${response.status}): ${await response.text()}`
      )
    }
  } catch (error) {
    console.error("[IndexNow] Submission failed:", error)
  }
}
