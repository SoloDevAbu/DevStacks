export const countryCodeToFlag = (code?: string | null): string => {
  if (!code || code.length !== 2) return ""
  const upper = code.toUpperCase()
  const first = upper.charCodeAt(0) - 65 + 0x1f1e6
  const second = upper.charCodeAt(1) - 65 + 0x1f1e6
  return String.fromCodePoint(first, second)
}

export const countryCodeToName = (code?: string | null): string => {
  if (!code || code.length !== 2) return ""
  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" })
    return displayNames.of(code.toUpperCase()) || code.toUpperCase()
  } catch {
    return code.toUpperCase()
  }
}

export const formatLocation = (
  country?: string | null,
  state?: string | null
): string => {
  const parts: string[] = []
  if (state?.trim()) {
    parts.push(state.trim())
  }
  if (country?.trim()) {
    const countryName = countryCodeToName(country.trim())
    if (countryName) {
      parts.push(countryName)
    }
  }
  return parts.join(", ")
}

export const formatGeoMetaTags = (
  country?: string | null,
  state?: string | null
): Record<string, string> => {
  const meta: Record<string, string> = {}
  if (country?.trim()) {
    const code = country.trim().toUpperCase()
    const cleanState = state?.trim()
    meta["geo.region"] = cleanState ? `${code}-${cleanState}` : code
    const countryName = countryCodeToName(code)
    meta["geo.placename"] = cleanState
      ? `${cleanState}, ${countryName}`
      : countryName
    meta["DC.Coverage"] = countryName
  }
  return meta
}

