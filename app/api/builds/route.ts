import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createBuild } from "@/db/queries/builds/create"
import { submitBuildSchema } from "@/lib/validation/build"

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to showcase a build." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = submitBuildSchema.safeParse({
      ...body,
      authorId: session.user.id,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { productIds, ...buildData } = parsed.data
    const build = await createBuild(
      {
        ...buildData,
        authorId: session.user.id,
      },
      productIds
    )

    return NextResponse.json({ data: build }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create build" },
      { status: 500 }
    )
  }
}
