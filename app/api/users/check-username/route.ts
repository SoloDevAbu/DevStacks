import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, sql, and, ne } from "drizzle-orm"

const USERNAME_REGEX = /^[a-z0-9_-]{2,30}$/i

export const GET = async (req: NextRequest) => {
  try {
    const rawUsername = req.nextUrl.searchParams.get("username")
    if (!rawUsername) {
      return NextResponse.json(
        { available: false, message: "Username is required" },
        { status: 400 }
      )
    }

    const cleanUsername = rawUsername.trim().toLowerCase().replace(/^@/, "")

    if (!USERNAME_REGEX.test(cleanUsername)) {
      return NextResponse.json({
        available: false,
        message: "Must be 2-30 characters, letters, numbers, - or _ only",
      })
    }

    const session = await auth.api.getSession({
      headers: req.headers,
    })

    const conditions = [eq(sql`lower(${users.username})`, cleanUsername)]

    if (session?.user?.id) {
      // If current user already owns it, it's valid for them
      const [currentUser] = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)

      if (currentUser?.username?.toLowerCase() === cleanUsername) {
        return NextResponse.json({
          available: true,
          isCurrent: true,
          message: "Current handle",
        })
      }

      conditions.push(ne(users.id, session.user.id))
    }

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(...conditions))
      .limit(1)

    if (existing) {
      return NextResponse.json({
        available: false,
        message: `@${cleanUsername} is already taken`,
      })
    }

    return NextResponse.json({
      available: true,
      message: `@${cleanUsername} is available`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        available: false,
        message: error instanceof Error ? error.message : "Failed to check handle",
      },
      { status: 500 }
    )
  }
}
