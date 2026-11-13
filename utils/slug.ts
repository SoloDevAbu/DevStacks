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

// Slugs with Hangul or accented letters exist in both composed and decomposed Unicode forms,
// depending on when they were stored and how the URL was encoded, so lookups accept either.
export const getSlugLookupForms = (slug: string): string[] => [
  ...new Set([slug, slug.normalize("NFC"), slug.normalize("NFD")]),
]
