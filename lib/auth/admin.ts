import { auth } from "@/lib/auth"
import {
  ADMIN_EMAILS,
  ADMIN_PRIMARY_EMAIL,
  ADMIN_SECRET_HEADER,
} from "@/constants/admin"

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email || typeof email !== "string") return false
  const normalized = email.trim().toLowerCase()
  if (normalized === ADMIN_PRIMARY_EMAIL) return true
  return ADMIN_EMAILS.includes(normalized)
}

export const getAdminSession = async (reqHeaders?: Headers) => {
  const secretKey = process.env.ADMIN_SECRET_KEY?.trim()
  if (secretKey && reqHeaders) {
    const passedSecret = reqHeaders.get(ADMIN_SECRET_HEADER)
    if (passedSecret && passedSecret === secretKey) {
      return {
        session: null,
        user: { email: ADMIN_PRIMARY_EMAIL, name: "Admin (Secret Key)" },
        isAdmin: true,
      }
    }
  }

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

