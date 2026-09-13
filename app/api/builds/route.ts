import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createProduct } from "@/db/queries/products/create"
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
      submitterId: session.user.id,
      authorId: session.user.id,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { tags, builtWithTools, tools, authorId, logoText, logoBg, ...rest } =
      parsed.data

    const toolList = Array.isArray(builtWithTools)
      ? [...builtWithTools]
      : tools
        ? tools
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : []

    const product = await createProduct({
      ...rest,
      submitterId: session.user.id,
      tags: Array.isArray(tags) ? tags : [],
      platforms: (rest.platforms ?? []) as any,
      builtWithTools: toolList.length > 0 ? toolList : undefined,
    })

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message.includes("unique")) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create build" },
      { status: 500 }
    )
  }
}
