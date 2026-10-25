export const slugify = (text: string, fallback = "item"): string => {
  if (!text) return fallback
  const cleaned = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return cleaned.length > 0 ? cleaned : fallback
}
