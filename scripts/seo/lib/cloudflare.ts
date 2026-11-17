import { requireEnv } from "./env"

const API = "https://api.cloudflare.com/client/v4"

export const cloudflareConfig = () => ({
  token: requireEnv("CLOUDFLARE_API_TOKEN"),
  accountId: requireEnv("CLOUDFLARE_ACCOUNT_ID"),
  zoneId: requireEnv("CLOUDFLARE_ZONE_ID"),
  siteTag: requireEnv("CLOUDFLARE_SITE_TAG"),
})

type Config = ReturnType<typeof cloudflareConfig>

export type Blocked = { blocked: string }

export const isBlocked = (value: unknown): value is Blocked =>
  typeof value === "object" && value !== null && "blocked" in value

const headers = (config: Config) => ({
  Authorization: `Bearer ${config.token}`,
  "Content-Type": "application/json",
})

// Errors are returned rather than thrown so one missing permission never hides the other sections.
export const graphql = async <T>(
  config: Config,
  query: string,
  variables: Record<string, unknown>
): Promise<T | Blocked> => {
  const response = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: headers(config),
    body: JSON.stringify({ query, variables }),
  })
  const json = (await response.json()) as {
    data?: { viewer: T }
    errors?: { message: string }[]
  }
  if (json.errors?.length) return { blocked: json.errors.map((e) => e.message).join(" | ") }
  return json.data!.viewer
}

interface ObservabilityAggregate {
  groups?: { key: string; value: string | number }[]
  value: number
}

interface ObservabilityFilter {
  key: string
  operation: string
  value: string | number
  type: "string" | "number"
}

export const observabilityQuery = async (
  config: Config,
  {
    from,
    to,
    groupBy,
    filters,
    limit = 20,
  }: {
    from: number
    to: number
    groupBy: string
    filters: ObservabilityFilter[]
    limit?: number
  }
): Promise<ObservabilityAggregate[] | Blocked> => {
  const response = await fetch(
    `${API}/accounts/${config.accountId}/workers/observability/telemetry/query`,
    {
      method: "POST",
      headers: headers(config),
      body: JSON.stringify({
        queryId: `seo-report-${Date.now()}`,
        timeframe: { from, to },
        view: "calculations",
        limit,
        parameters: {
          datasets: ["cloudflare-workers"],
          calculations: [{ operator: "count" }],
          groupBys: [{ type: "string", value: groupBy }],
          filters,
        },
      }),
    }
  )
  const json = (await response.json()) as {
    success: boolean
    errors?: { message: string }[]
    result?: { calculations?: { aggregates?: ObservabilityAggregate[] }[] }
  }
  if (!json.success) return { blocked: JSON.stringify(json.errors ?? "query failed") }
  return (json.result?.calculations?.[0]?.aggregates ?? [])
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
}

export const filter = (
  key: string,
  operation: string,
  value: string | number,
  type: "string" | "number" = "string"
): ObservabilityFilter => ({ key, operation, value, type })
