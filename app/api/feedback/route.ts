import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createFeedback } from "@/db/queries/feedback/create"
import { FEEDBACK_LIMITS } from "@/constants/feedback"

const feedbackSchema = z.object({
  type: z
    .enum(["bug", "improvement", "feature", "other"])
    .default("improvement"),
  title: z
    .string()
    .max(FEEDBACK_LIMITS.TITLE_MAX)
    .optional()
    .nullable()
    .transform((val) => val ?? null),
  message: z
    .string()
    .min(FEEDBACK_LIMITS.MESSAGE_MIN, {
      message: `Message must be at least ${FEEDBACK_LIMITS.MESSAGE_MIN} characters.`,
    })
    .max(FEEDBACK_LIMITS.MESSAGE_MAX, {
      message: `Message must not exceed ${FEEDBACK_LIMITS.MESSAGE_MAX} characters.`,
    }),
  email: z
    .string()
    .email({ message: "Please provide a valid email address." })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val ? val : null)),
  pageUrl: z
    .string()
    .max(500)
    .optional()
    .nullable()
    .transform((val) => val ?? null),
})

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    const body = await req.json()

    const parsed = feedbackSchema.safeParse(body)
    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? "Invalid feedback data."
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { type, title, message, email, pageUrl } = parsed.data

    const feedback = await createFeedback({
      userId: session?.user?.id ?? null,
      type,
      title,
      message,
      email: email ?? session?.user?.email ?? null,
      pageUrl,
    })

    return NextResponse.json({ success: true, data: feedback }, { status: 201 })
  } catch (error) {
    console.error("Failed to submit feedback:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    )
  }
}
