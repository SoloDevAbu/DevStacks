import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { deleteStorageObject, getStorageKeyFromUrl } from "@/lib/storage/s3"

const deleteSchema = z
  .object({
    url: z.string().optional(),
    key: z.string().optional(),
  })
  .refine((data) => Boolean(data.url || data.key), {
    message: "Either url or key must be provided",
  })

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to delete media." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = deleteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { url, key: rawKey } = parsed.data
    const key = rawKey
      ? rawKey.replace(/^\/+/, "")
      : url
        ? getStorageKeyFromUrl(url)
        : null

    if (!key) {
      return NextResponse.json(
        { error: "Invalid storage asset URL or key" },
        { status: 400 }
      )
    }

    const userId = session.user.id
    const isOwned =
      key.startsWith(`logos/${userId}/`) ||
      key.startsWith(`screenshots/${userId}/`)

    if (!isOwned) {
      return NextResponse.json(
        { error: "Forbidden. You can only delete your own uploaded media." },
        { status: 403 }
      )
    }

    await deleteStorageObject(key)

    return NextResponse.json({
      success: true,
      key,
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete storage asset"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
