import { type NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth/admin"
import {
  getAdminSubmissionById,
  updateAdminSubmissionDetails,
  updateAdminSubmissionStatus,
  deleteAdminSubmission,
} from "@/db/queries/admin/submissions"

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) => {
  try {
    const { isAdmin } = await getAdminSession(req.headers)

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator permission required." },
        { status: 403 }
      )
    }

    const { type, id } = await params
    if (type !== "tool" && type !== "product") {
      return NextResponse.json(
        { error: "Invalid item type. Must be 'tool' or 'product'." },
        { status: 400 }
      )
    }

    const item = await getAdminSubmissionById(type, id)
    if (!item) {
      return NextResponse.json(
        { error: `${type} not found.` },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: item }, { status: 200 })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch submission details"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) => {
  try {
    const { isAdmin } = await getAdminSession(req.headers)

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator permission required." },
        { status: 403 }
      )
    }

    const { type, id } = await params
    if (type !== "tool" && type !== "product") {
      return NextResponse.json(
        { error: "Invalid item type. Must be 'tool' or 'product'." },
        { status: 400 }
      )
    }

    const body = await req.json()

    // If only status is passed
    if (body.status && Object.keys(body).length === 1) {
      const updated = await updateAdminSubmissionStatus(
        type,
        id,
        body.status
      )
      return NextResponse.json({ data: updated }, { status: 200 })
    }

    const updated = await updateAdminSubmissionDetails(type, id, body)
    return NextResponse.json({ data: updated }, { status: 200 })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update submission"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) => {
  try {
    const { isAdmin } = await getAdminSession(req.headers)

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator permission required." },
        { status: 403 }
      )
    }

    const { type, id } = await params
    if (type !== "tool" && type !== "product") {
      return NextResponse.json(
        { error: "Invalid item type. Must be 'tool' or 'product'." },
        { status: 400 }
      )
    }

    const deleted = await deleteAdminSubmission(type, id)
    return NextResponse.json({ success: true, data: deleted }, { status: 200 })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete submission"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
