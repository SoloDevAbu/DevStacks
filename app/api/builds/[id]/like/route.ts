import { type NextRequest, NextResponse } from "next/server"

// The old /api/builds/[id]/like route is deprecated.
// Products are now liked via /api/products/[slug]/like
export const POST = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  return NextResponse.json(
    { error: `Route deprecated. Use /api/products/${id}/like instead.` },
    { status: 410 }
  )
}
