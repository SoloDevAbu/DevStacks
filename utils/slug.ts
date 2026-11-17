export const slugify = (text: string, fallback = "item"): string => {
  if (!text) return fallback
  const cleaned = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return cleaned.length > 0 ? cleaned : fallback
}

const decodeSlug = (slug: string): string => {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

// Slugs with Hangul or accented letters exist in both composed and decomposed Unicode forms,
// depending on when they were stored and how the URL was encoded, so lookups accept either.
// Pages prerendered from generateStaticParams receive non-ASCII slugs still percent-encoded,
// which cached a 404 for them, so the decoded form is tried too.
export const getSlugLookupForms = (slug: string): string[] => {
  const decoded = decodeSlug(slug)
  return [
    ...new Set([
      slug,
      decoded,
      decoded.normalize("NFC"),
      decoded.normalize("NFD"),
    ]),
  ]
}
