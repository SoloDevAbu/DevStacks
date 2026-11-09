import {
  INDEXNOW,
  INDEXNOW_ACCEPTED_STATUSES,
  INDEXNOW_KEY_ERRORS,
  INDEXNOW_REJECTION_REASONS,
  INDEXNOW_STATUS,
  type IndexNowStatus,
} from "@/constants/indexnow"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { toAbsoluteUrl } from "@/utils/urls"

export interface IndexNowResult {
  status: IndexNowStatus
  urls: number
  httpStatus?: number
  reason?: string
}

export const getIndexNowKey = (): string | null => {
  const key = process.env.INDEXNOW_KEY?.trim()
  return key && INDEXNOW.KEY_PATTERN.test(key) ? key : null
}

// IndexNow rejects URLs outside the submitted host, so local and preview builds never submit.
const isProductionHost = () => new URL(SITE_CONFIG.url).host === SITE_CONFIG.domain

const resolveKey = (): { key: string } | { reason: string } => {
  if (!isProductionHost()) return { reason: INDEXNOW_KEY_ERRORS.NOT_PRODUCTION }
  if (!process.env.INDEXNOW_KEY?.trim()) {
    return { reason: INDEXNOW_KEY_ERRORS.MISSING }
  }
  const key = getIndexNowKey()
  return key ? { key } : { reason: INDEXNOW_KEY_ERRORS.INVALID }
}

const logResult = (result: IndexNowResult) => {
  const line = `[IndexNow] ${JSON.stringify(result)}`
  if (result.status === INDEXNOW_STATUS.SUBMITTED) console.log(line)
  else console.error(line)
  return result
}

// IndexNow tells Bing (the index behind ChatGPT search and Copilot), Yandex, Seznam and Naver that
// URLs changed, instead of waiting for their next crawl. It never throws: the result is logged and
// returned so callers can report it, and a missing key (local/dev) is a skip, not an error.
export const submitToIndexNow = async (
  paths: string[]
): Promise<IndexNowResult> => {
  const urlList = [...new Set(paths.map(toAbsoluteUrl))].slice(
    0,
    INDEXNOW.MAX_URLS_PER_REQUEST
  )
  if (urlList.length === 0) {
    return { status: INDEXNOW_STATUS.SKIPPED, urls: 0 }
  }

  const resolved = resolveKey()
  if (!("key" in resolved)) {
    const status =
      resolved.reason === INDEXNOW_KEY_ERRORS.INVALID
        ? INDEXNOW_STATUS.FAILED
        : INDEXNOW_STATUS.SKIPPED
    return logResult({ status, urls: urlList.length, reason: resolved.reason })
  }

  try {
    const response = await fetch(INDEXNOW.ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: SITE_CONFIG.domain,
        key: resolved.key,
        keyLocation: toAbsoluteUrl(ROUTES.INDEXNOW_KEY),
        urlList,
      }),
    })

    if (INDEXNOW_ACCEPTED_STATUSES.includes(response.status)) {
      return logResult({
        status: INDEXNOW_STATUS.SUBMITTED,
        urls: urlList.length,
        httpStatus: response.status,
      })
    }

    const body = (await response.text()).slice(0, 300)
    return logResult({
      status: INDEXNOW_STATUS.REJECTED,
      urls: urlList.length,
      httpStatus: response.status,
      reason: [INDEXNOW_REJECTION_REASONS[response.status], body]
        .filter(Boolean)
        .join(": "),
    })
  } catch (error) {
    return logResult({
      status: INDEXNOW_STATUS.FAILED,
      urls: urlList.length,
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
