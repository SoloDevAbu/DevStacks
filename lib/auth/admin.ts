import { cache } from "react"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"

// Admin access is decided only by this allowlist. No fallback: an unset variable means no admins.
const ADMIN_EMAILS: readonly string[] = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

export interface AdminIdentity {
  id: string
  email: string
  name: string
}

interface SessionUser {
  id: string
  email: string
  name: string
  emailVerified: boolean
}

export const isAdminUser = (user?: SessionUser | null): boolean => {
  if (!user?.emailVerified || typeof user.email !== "string") return false
  return ADMIN_EMAILS.includes(user.email.trim().toLowerCase())
}

// The cookie cache is skipped so removing an email from the allowlist, or revoking a session,
// takes effect on the very next admin request.
export const getAdminSession = async (reqHeaders?: Headers) => {
  try {
    const session = await auth.api.getSession({
      headers: reqHeaders ?? new Headers(),
      query: { disableCookieCache: true },
    })
    const user = session?.user ?? null
    const isAdmin = isAdminUser(user)
    const admin: AdminIdentity | null =
      user && isAdmin ? { id: user.id, email: user.email, name: user.name } : null
    return { session, user, isAdmin, admin }
  } catch {
    return { session: null, user: null, isAdmin: false, admin: null }
  }
}

// Server Components call this at the top of every admin page. Non-admins get a plain 404 so the
// panel's existence isn't revealed.
export const requireAdmin = cache(async (): Promise<AdminIdentity> => {
  const { admin } = await getAdminSession(await headers())
  if (!admin) notFound()
  return admin
})
