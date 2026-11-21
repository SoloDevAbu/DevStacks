export const buildPageHref = (
  basePath: string,
  page: number,
  params?: Record<string, string | undefined>
): string => {
  const sp = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val && key !== "page" && val.toLowerCase() !== "all") {
        sp.set(key, val)
      }
    })
  }
  if (page > 1) {
    sp.set("page", page.toString())
  }
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}
