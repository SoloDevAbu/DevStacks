import "dotenv/config"

export const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env`)
  return value
}

export const daysAgo = (days: number, from = Date.now()) =>
  new Date(from - days * 86_400_000)

export const isoDate = (date: Date) => date.toISOString().slice(0, 10)
