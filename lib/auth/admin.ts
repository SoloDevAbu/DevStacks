import { auth } from "@/lib/auth"
import { ADMIN_EMAILS, ADMIN_PRIMARY_EMAIL } from "@/constants/admin"

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email || typeof email !== "string") return false
  const normalized = email.trim().toLowerCase()
  if (normalized === ADMIN_PRIMARY_EMAIL) return true
  return ADMIN_EMAILS.includes(normalized)
}

export const getAdminSession = async (reqHeaders?: Headers) => {
  try {
    const session = await auth.api.getSession({
      headers: reqHeaders ?? new Headers(),
    })

    const user = session?.user
    const isAdmin = Boolean(user && isAdminEmail(user.email))

    return {
      session,
      user,
      isAdmin,
    }
  } catch {
    return {
      session: null,
      user: null,
      isAdmin: false,
    }
  }
}
