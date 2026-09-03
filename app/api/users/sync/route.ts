import { type NextRequest, NextResponse } from "next/server"
import { upsertUser } from "@/db/queries/users/upsert"
import { z } from "zod"

const syncUserSchema = z.object({
  id: z.string().min(1, "User ID required"),
  name: z.string().min(1, "Name required"),
  email: z.string().email("Valid email required"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
})

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const parsed = syncUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const user = await upsertUser({
      ...parsed.data,
      avatarUrl: parsed.data.avatarUrl || null,
    })

    return NextResponse.json({ data: user }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    )
  }
}
