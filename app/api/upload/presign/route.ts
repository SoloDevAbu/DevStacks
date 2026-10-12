import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { randomUUID } from "crypto"
import { STORAGE_CONFIG } from "@/constants/storage"
import { createPresignedUploadUrl } from "@/lib/storage/s3"

const presignSchema = z.object({
  kind: z.enum(["logo", "screenshot"]),
  contentType: z.string(),
  fileSize: z.number().positive(),
  fileName: z.string().optional(),
})

const getExtension = (contentType: string, fileName?: string) => {
  if (fileName && fileName.includes(".")) {
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (ext && /^[a-z0-9]+$/.test(ext)) return ext
  }

  switch (contentType) {
    case "image/png":
      return "png"
    case "image/jpeg":
      return "jpg"
    case "image/webp":
      return "webp"
    case "image/svg+xml":
      return "svg"
    default:
      return "bin"
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload media." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = presignSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid upload request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { kind, contentType, fileSize, fileName } = parsed.data

    if (kind === "logo") {
      const allowed = STORAGE_CONFIG.LOGO.ALLOWED_TYPES as readonly string[]
      if (!allowed.includes(contentType)) {
        return NextResponse.json(
          {
            error: `Invalid logo type. Allowed: ${allowed.join(", ")}`,
          },
          { status: 400 }
        )
      }
      if (fileSize > STORAGE_CONFIG.LOGO.MAX_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `Logo size exceeds maximum allowed of ${STORAGE_CONFIG.LOGO.MAX_SIZE_BYTES / (1024 * 1024)}MB`,
          },
          { status: 400 }
        )
      }
    } else {
      const allowed = STORAGE_CONFIG.SCREENSHOTS.ALLOWED_TYPES as readonly string[]
      if (!allowed.includes(contentType)) {
        return NextResponse.json(
          {
            error: `Invalid screenshot type. Allowed: ${allowed.join(", ")}`,
          },
          { status: 400 }
        )
      }
      if (fileSize > STORAGE_CONFIG.SCREENSHOTS.MAX_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `Screenshot size exceeds maximum allowed of ${STORAGE_CONFIG.SCREENSHOTS.MAX_SIZE_BYTES / (1024 * 1024)}MB`,
          },
          { status: 400 }
        )
      }
    }

    const ext = getExtension(contentType, fileName)
    const folder = kind === "logo" ? "logos" : "screenshots"
    const key = `${folder}/${session.user.id}/${randomUUID()}.${ext}`

    const { uploadUrl, publicUrl } = await createPresignedUploadUrl({
      key,
      contentType,
    })

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate upload URL"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
