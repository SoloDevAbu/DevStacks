import { type NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth/admin"
import {
  getAdminSubmissions,
  bulkUpdateAdminSubmissionStatus,
} from "@/db/queries/admin/submissions"
import type {
  AdminStatusFilter,
  AdminItemTypeFilter,
  AdminSortOption,
} from "@/constants/admin"

export const GET = async (req: NextRequest) => {
  try {
    const { isAdmin } = await getAdminSession(req.headers)

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have administrator permissions to access this data.",
        },
        { status: 403 }
      )
    }

    const { searchParams } = req.nextUrl
    const status = (searchParams.get("status") || "pending") as AdminStatusFilter
    const itemType = (searchParams.get("itemType") ||
      "all") as AdminItemTypeFilter
    const search = searchParams.get("search") || undefined
    const sortBy = (searchParams.get("sortBy") || "recent") as AdminSortOption
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "30", 10)

    const result = await getAdminSubmissions({
      status,
      itemType,
      search,
      sortBy,
      page,
      limit,
    })

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch admin submissions"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const PATCH = async (req: NextRequest) => {
  try {
    const { isAdmin } = await getAdminSession(req.headers)

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have administrator permissions to perform this action.",
        },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { items } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload: 'items' array is required." },
        { status: 400 }
      )
    }

    const results = await bulkUpdateAdminSubmissionStatus(items)

    return NextResponse.json(
      { success: true, updatedCount: results.length },
      { status: 200 }
    )
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to bulk update submissions"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
