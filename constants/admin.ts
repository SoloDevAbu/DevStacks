export const ADMIN_PRIMARY_EMAIL = (
  process.env.ADMIN_EMAIL || "support@launchnests.com"
)
  .trim()
  .toLowerCase()

const parseAdminEmails = (): string[] => {
  const envEmails = process.env.ADMIN_EMAILS
  if (!envEmails) return [ADMIN_PRIMARY_EMAIL]
  return envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export const ADMIN_EMAILS: string[] = parseAdminEmails()

export const ADMIN_SECRET_HEADER = "x-admin-secret"

