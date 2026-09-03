import { type NextRequest, NextResponse } from "next/server"
import { getBuildById } from "@/db/queries/builds/get"

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Invalid build ID" }, { status: 400 })
    }

    const build = await getBuildById(id)

    if (!build) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 })
    }

    return NextResponse.json({ data: build }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch build" },
      { status: 500 }
    )
  }
}
