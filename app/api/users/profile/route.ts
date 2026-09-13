import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getCurrentUserProfile } from "@/db/queries/users/get-profile"
import { updateUserProfile } from "@/db/queries/users/update-profile"
import { updateProfileSchema } from "@/lib/validation/profile"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, and, ne, sql } from "drizzle-orm"

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await getCurrentUserProfile(session.user.id)
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ data: profile })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateProfileSchema.safeParse(body)

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      const firstError =
        Object.values(fieldErrors).flat()[0] || "Validation failed"
      return NextResponse.json(
        {
          error: firstError,
          details: fieldErrors,
        },
        { status: 400 }
      )
    }

    const { username, ...rest } = parsed.data

    if (username) {
      const lowerUsername = username.toLowerCase().trim()
      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            eq(sql`lower(${users.username})`, lowerUsername),
            ne(users.id, session.user.id)
          )
        )
        .limit(1)

      if (existingUser) {
        return NextResponse.json(
          {
            error: `The username "@${lowerUsername}" is already taken. Please choose a different handle.`,
          },
          { status: 409 }
        )
      }
    }

    const updatedUser = await updateUserProfile(session.user.id, {
      ...rest,
      ...(username ? { username } : {}),
    })

    const fullProfile = await getCurrentUserProfile(session.user.id)

    return NextResponse.json({
      data: fullProfile ?? updatedUser,
      message: "Profile updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
