interface BoundedIntOptions {
  fallback: number
  min: number
  max: number
}

// Query params are untrusted: non-numeric input falls back instead of becoming NaN.
export const parseBoundedInt = (
  value: string | null,
  { fallback, min, max }: BoundedIntOptions
): number => {
  const parsed = Number.parseInt(value ?? "", 10)
  if (Number.isNaN(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

export const pickOption = <T extends string>(
  value: string | null,
  options: readonly T[],
  fallback: T
): T => (options.includes(value as T) ? (value as T) : fallback)
