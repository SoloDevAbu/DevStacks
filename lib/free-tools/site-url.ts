import { isSafeUrl } from "@/lib/ai/url-security"

// Accepts "example.com", "www.example.com/path" or a full https:// URL from a request body.
export const parseSiteUrl = (raw: unknown) => {
  if (typeof raw !== "string" || !raw.trim()) return null
  const trimmed = raw.trim()
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`
  if (!isSafeUrl(withScheme).safe) return null
  try {
    return new URL(withScheme)
  } catch {
    return null
  }
}

export const readSiteUrl = async (req: Request) => {
  const body = (await req.json().catch(() => null)) as { url?: unknown } | null
  return parseSiteUrl(body?.url)
}
