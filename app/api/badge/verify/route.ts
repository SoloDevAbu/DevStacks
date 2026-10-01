import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const { url, slug } = body as {
      url?: string
      slug?: string
      type?: "tool" | "product"
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { verified: false, message: "A valid website URL is required." },
        { status: 400 }
      )
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`)
    } catch {
      return NextResponse.json(
        { verified: false, message: "Invalid website URL format." },
        { status: 400 }
      )
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    try {
      const res = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; LaunchNests-BadgeBot/1.0; +https://launchnests.com)",
          Accept: "text/html,application/xhtml+xml,text/plain",
        },
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        return NextResponse.json({
          verified: false,
          message: `Site returned HTTP ${res.status}. Please check your website URL.`,
        })
      }

      const html = (await res.text()).toLowerCase()
      const searchSlug = (slug || "").toLowerCase()

      const hasLaunchNestsMention =
        html.includes("launchnests.com") || html.includes("launchnests")
      const hasBadgeSnippet =
        html.includes("api/badge") ||
        (searchSlug && html.includes(searchSlug)) ||
        html.includes("featured on launchnests")

      if (hasLaunchNestsMention && hasBadgeSnippet) {
        return NextResponse.json({
          verified: true,
          message: "Badge verified! Your listing has been verified.",
        })
      }

      return NextResponse.json({
        verified: false,
        message:
          "Badge embed snippet was not detected on the homepage yet. Ensure your site is deployed, or click 'Add later'.",
      })
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId)
      const isTimeout =
        fetchErr instanceof Error && fetchErr.name === "AbortError"
      return NextResponse.json({
        verified: false,
        message: isTimeout
          ? "Request timed out while checking your website. Please try again."
          : "Could not reach website to verify badge. Please check your domain.",
      })
    }
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to verify badge"
    return NextResponse.json(
      { verified: false, message: errorMsg },
      { status: 500 }
    )
  }
}
