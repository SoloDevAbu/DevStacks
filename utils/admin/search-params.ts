export type AdminSearchParams = Record<string, string | string[] | undefined>

export const readParam = (params: AdminSearchParams, key: string) => {
  const value = params[key]
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
}

export const readPage = (params: AdminSearchParams) => {
  const page = Number(readParam(params, "page"))
  return Number.isInteger(page) && page > 0 ? page : 1
}

export const readEnumParam = <T extends string>(
  params: AdminSearchParams,
  key: string,
  allowed: readonly T[],
  fallback: T
): T => {
  const value = readParam(params, key)
  return allowed.includes(value as T) ? (value as T) : fallback
}

export const readOptionalEnumParam = <T extends string>(
  params: AdminSearchParams,
  key: string,
  allowed: readonly T[]
): T | undefined => {
  const value = readParam(params, key)
  return allowed.includes(value as T) ? (value as T) : undefined
}

export const totalPages = (total: number, pageSize: number) =>
  Math.max(1, Math.ceil(total / pageSize))
