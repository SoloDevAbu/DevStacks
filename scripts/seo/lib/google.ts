import { createSign } from "node:crypto"
import { readFileSync } from "node:fs"
import { requireEnv } from "./env"

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
const API = "https://searchconsole.googleapis.com"

interface ServiceAccount {
  client_email: string
  private_key: string
  token_uri: string
}

const base64Url = (input: string | Buffer) => Buffer.from(input).toString("base64url")

// A signed JWT grant keeps this script free of the googleapis dependency.
const fetchAccessToken = async (account: ServiceAccount) => {
  const now = Math.floor(Date.now() / 1000)
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = base64Url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
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

export const createSearchConsole = async () => {
  const account = JSON.parse(
    readFileSync(requireEnv("GSC_CREDENTIALS_PATH"), "utf8")
  ) as ServiceAccount
  const siteUrl = requireEnv("GSC_SITE_URL")
  const token = await fetchAccessToken(account)

  const post = async <T>(url: string, body: unknown): Promise<T> => {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const json = (await response.json()) as T & { error?: { message: string } }
    if (json.error) throw new Error(`Search Console: ${json.error.message}`)
    return json
  }

  const searchAnalytics = async (body: {
    startDate: string
    endDate: string
    dimensions: string[]
    rowLimit?: number
  }) => {
    const json = await post<{
      rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[]
    }>(
      `${API}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
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
    }>(`${API}/v1/urlInspection/index:inspect`, { siteUrl, inspectionUrl })
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
