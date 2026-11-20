import { createSign } from "node:crypto"
import { readFileSync } from "node:fs"
import { requireEnv } from "./env"

const SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly"
const SEARCH_CONSOLE_API = "https://searchconsole.googleapis.com"
const ANALYTICS_API = "https://analyticsdata.googleapis.com/v1beta"

interface ServiceAccount {
  client_email: string
  private_key: string
  token_uri: string
}

const base64Url = (input: string | Buffer) => Buffer.from(input).toString("base64url")

// A signed JWT grant keeps this script free of the googleapis dependency.
const fetchAccessToken = async (account: ServiceAccount, scope: string) => {
  const now = Math.floor(Date.now() / 1000)
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = base64Url(
    JSON.stringify({
      iss: account.client_email,
      scope,
      aud: account.token_uri,
      iat: now,
      exp: now + 3600,
    })
  )
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${claims}`)
    .sign(account.private_key)
  const response = await fetch(account.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${base64Url(signature)}`,
    }),
  })
  const json = (await response.json()) as { access_token?: string; error?: string }
  if (!json.access_token) throw new Error(`Google auth failed: ${json.error ?? response.status}`)
  return json.access_token
}

const readServiceAccount = () =>
  JSON.parse(readFileSync(requireEnv("GSC_CREDENTIALS_PATH"), "utf8")) as ServiceAccount

const createClient = async (scope: string, label: string) => {
  const token = await fetchAccessToken(readServiceAccount(), scope)
  return async <T>(url: string, body: unknown): Promise<T> => {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const json = (await response.json()) as T & { error?: { message: string } }
    if (json.error) throw new Error(`${label}: ${json.error.message}`)
    return json
  }
}

export const createSearchConsole = async () => {
  const siteUrl = requireEnv("GSC_SITE_URL")
  const post = await createClient(SEARCH_CONSOLE_SCOPE, "Search Console")

  const searchAnalytics = async (body: {
    startDate: string
    endDate: string
    dimensions: string[]
    rowLimit?: number
  }) => {
    const json = await post<{
      rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[]
    }>(
      `${SEARCH_CONSOLE_API}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      { rowLimit: 25000, type: "web", ...body }
    )
    return (json.rows ?? []).map((row) => ({
      keys: row.keys ?? [],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }))
  }

  const inspect = async (inspectionUrl: string) => {
    const json = await post<{
      inspectionResult?: {
        indexStatusResult?: {
          verdict?: string
          coverageState?: string
          lastCrawlTime?: string
          googleCanonical?: string
        }
      }
    }>(`${SEARCH_CONSOLE_API}/v1/urlInspection/index:inspect`, { siteUrl, inspectionUrl })
    const status = json.inspectionResult?.indexStatusResult
    return {
      url: inspectionUrl,
      verdict: status?.verdict,
      coverage: status?.coverageState,
      lastCrawl: status?.lastCrawlTime,
      googleCanonical: status?.googleCanonical,
    }
  }

  return { siteUrl, searchAnalytics, inspect }
}

export interface AnalyticsReportRequest {
  dateRanges: { startDate: string; endDate: string }[]
  metrics: string[]
  dimensions?: string[]
  orderBy?: string
  limit?: number
}

export type AnalyticsRow = Record<string, string | number>

export const createAnalytics = async () => {
  const propertyId = requireEnv("GA4_PROPERTY_ID")
  const post = await createClient(ANALYTICS_SCOPE, "GA4")

  const runReport = async ({ metrics, dimensions = [], orderBy, ...rest }: AnalyticsReportRequest) => {
    const json = await post<{
      rows?: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }[]
    }>(`${ANALYTICS_API}/properties/${propertyId}:runReport`, {
      ...rest,
      metrics: metrics.map((name) => ({ name })),
      dimensions: dimensions.map((name) => ({ name })),
      ...(orderBy && { orderBys: [{ metric: { metricName: orderBy }, desc: true }] }),
    })
    return (json.rows ?? []).map(
      (row): AnalyticsRow =>
        Object.fromEntries([
          ...dimensions.map((name, index) => [name, row.dimensionValues?.[index]?.value ?? ""]),
          ...metrics.map((name, index) => [name, Number(row.metricValues?.[index]?.value ?? 0)]),
        ])
    )
  }

  return { propertyId, runReport }
}
