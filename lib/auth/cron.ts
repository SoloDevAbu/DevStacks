import type { NextRequest } from "next/server"

export const isCronAuthorized = (req: NextRequest) => {
  const secret = process.env.CRON_SECRET
  return Boolean(secret) && req.headers.get("authorization") === `Bearer ${secret}`
}
