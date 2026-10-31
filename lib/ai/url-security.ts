export const normalizeUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim()
  if (!trimmed) return ""

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== "https:") {
      return trimmed
    }
    parsed.hostname = parsed.hostname.toLowerCase()

    if (parsed.port === "443" || parsed.port === "80") {
      parsed.port = ""
    }

    if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.slice(0, -1)
    }

    const trackingParams = new Set([
      "ref",
      "source",
      "fbclid",
      "gclid",
      "_ga",
      "_gl",
    ])

    const searchParams = new URLSearchParams()
    parsed.searchParams.forEach((val, key) => {
      const lower = key.toLowerCase()
      if (!lower.startsWith("utm_") && !trackingParams.has(lower)) {
        searchParams.append(key, val)
      }
    })

    parsed.search = searchParams.toString() ? `?${searchParams.toString()}` : ""
    parsed.hash = ""

    return parsed.toString()
  } catch {
    return trimmed
  }
}

const isPrivateIp = (hostname: string): boolean => {
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname === "0.0.0.0" ||
    hostname === "::1"
  ) {
    return true
  }

  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!ipv4Match) return false

  const [, aStr, bStr] = ipv4Match
  const a = parseInt(aStr, 10)
  const b = parseInt(bStr, 10)

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true
  // 10.0.0.0/8 (Private network)
  if (a === 10) return true
  // 172.16.0.0/12 (Private network: 172.16 - 172.31)
  if (a === 172 && b >= 16 && b <= 31) return true
  // 192.168.0.0/16 (Private network)
  if (a === 192 && b === 168) return true
  // 169.254.0.0/16 (Link-local / Cloud metadata)
  if (a === 169 && b === 254) return true
  // 0.0.0.0/8
  if (a === 0) return true

  return false
}

export const isSafeUrl = (
  urlStr: string
): { safe: boolean; reason?: string } => {
  const trimmed = urlStr.trim()
  if (!trimmed.startsWith("https://")) {
    return {
      safe: false,
      reason: "Only secure HTTPS URLs (starting with https://) are supported.",
    }
  }

  try {
    const parsed = new URL(trimmed)

    if (parsed.protocol !== "https:") {
      return {
        safe: false,
        reason: "Only secure HTTPS URLs (starting with https://) are supported.",
      }
    }

    if (
      !parsed.hostname ||
      !parsed.hostname.includes(".") ||
      parsed.hostname.endsWith(".")
    ) {
      return {
        safe: false,
        reason:
          "Invalid domain name. Please provide a complete domain (e.g. https://yourproduct.com).",
      }
    }

    if (isPrivateIp(parsed.hostname)) {
      return {
        safe: false,
        reason: "Access to private, local, or loopback addresses is prohibited.",
      }
    }

    return { safe: true }
  } catch {
    return { safe: false, reason: "Invalid URL format." }
  }
}

export const fetchHtmlSafely = async (
  normalizedUrl: string,
  timeoutMs = 6000
): Promise<{ html: string; status: number }> => {
  const safety = isSafeUrl(normalizedUrl)
  if (!safety.safe) {
    throw new Error(safety.reason || "Unsafe URL blocked.")
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BuyMyNextLaunchBot/1.0; +https://buymynextlaunch.com)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    })

    if (!response.ok) {
      throw new Error(
        `Website returned error: HTTP ${response.status} (${response.statusText})`
      )
    }

    const contentType = response.headers.get("content-type") || ""
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("text/plain") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error("Target URL is not an HTML webpage.")
    }

    // Read max 1MB to prevent memory exhaustion
    const reader = response.body?.getReader()
    if (!reader) {
      const text = await response.text()
      return { html: text.slice(0, 1_000_000), status: response.status }
    }

    const chunks: Uint8Array[] = []
    let totalBytes = 0
    const maxBytes = 1_000_000

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        totalBytes += value.length
        chunks.push(value)
        if (totalBytes >= maxBytes) break
      }
    }

    const decoder = new TextDecoder("utf-8")
    const combined = new Uint8Array(totalBytes)
    let offset = 0
    for (const chunk of chunks) {
      combined.set(chunk, offset)
      offset += chunk.length
    }

    return { html: decoder.decode(combined), status: response.status }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Connection to website timed out after 6 seconds.")
    }
    if (err instanceof Error) {
      const msg = err.message.toLowerCase()
      if (msg.includes("fetch failed") || msg.includes("enotfound") || msg.includes("econnrefused")) {
        throw new Error("Unable to reach website. Please verify the domain is online and accessible.")
      }
      throw err
    }
    throw new Error("Failed to connect to the provided URL.")
  } finally {
    clearTimeout(timer)
  }
}

