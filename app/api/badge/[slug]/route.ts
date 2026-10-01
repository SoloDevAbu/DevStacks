import { NextResponse } from "next/server"
import { getToolBySlug } from "@/db/queries/tools/get"
import { getProductBySlug } from "@/db/queries/products/get"

export const dynamic = "force-dynamic"

export const GET = async (
  request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const url = new URL(request.url)
  const style = url.searchParams.get("style") ?? "card" // Default to showcase card
  const type = url.searchParams.get("type") // "tool" | "product"

  let name = slug
  let votes = 0

  if (type === "product") {
    const product = await getProductBySlug(slug)
    if (product) {
      name = product.name
      votes = product.likesCount ?? 0
    }
  } else if (type === "tool") {
    const tool = await getToolBySlug(slug)
    if (tool) {
      name = tool.name
      votes = tool.upvotesCount ?? 0
    }
  } else {
    // Try tool first, then product
    const tool = await getToolBySlug(slug)
    if (tool) {
      name = tool.name
      votes = tool.upvotesCount ?? 0
    } else {
      const product = await getProductBySlug(slug)
      if (product) {
        name = product.name
        votes = product.likesCount ?? 0
      }
    }
  }

  let svg = ""

  if (style === "shield") {
    const rightText =
      votes > 0 ? `${votes.toLocaleString()} upvotes` : "featured"
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="20" role="img" aria-label="launchnests: ${rightText}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="190" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="90" height="20" fill="#0f172a"/>
    <rect x="90" width="100" height="20" fill="#2563eb"/>
    <rect width="190" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="455" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="760">LaunchNests</text>
    <text x="455" y="140" transform="scale(.1)" fill="#fff" textLength="760">LaunchNests</text>
    <text aria-hidden="true" x="1400" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="800">${rightText}</text>
    <text x="1400" y="140" transform="scale(.1)" fill="#fff" textLength="800">${rightText}</text>
  </g>
</svg>`
  } else {
    // Premium light Showcase Card with authentic LaunchNests logo
    svg = `<svg width="216" height="54" viewBox="0 0 216 54" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ln-arc" x1="6" y1="18" x2="34" y2="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0091FF" />
      <stop offset="50%" stop-color="#00D084" />
      <stop offset="100%" stop-color="#FF9500" />
    </linearGradient>
    <linearGradient id="ln-top" x1="12" y1="12" x2="28" y2="22" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00E599" />
      <stop offset="100%" stop-color="#00B4D8" />
    </linearGradient>
    <linearGradient id="ln-mid" x1="10" y1="18" x2="30" y2="26" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0070F3" />
      <stop offset="100%" stop-color="#0051C7" />
    </linearGradient>
    <linearGradient id="ln-bot" x1="10" y1="23" x2="30" y2="33" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF7700" />
      <stop offset="100%" stop-color="#FF4500" />
    </linearGradient>
  </defs>
  <rect x="0.6" y="0.6" width="214.8" height="52.8" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.2"/>
  <g transform="translate(8, 7)">
    <path d="M 8.5 17.5 A 13 13 0 0 1 31.5 17.5" stroke="url(#ln-arc)" stroke-width="2.2" stroke-linecap="round" fill="none" />
    <circle cx="8.5" cy="17.5" r="3.2" fill="#0091FF" />
    <circle cx="20" cy="6.5" r="3.5" fill="#00D084" />
    <circle cx="31.5" cy="17.5" r="3.2" fill="#FF9500" />
    <path d="M 19.3 12.8 C 19.7 12.4 20.3 12.4 20.7 12.8 L 27.2 16.5 C 27.6 16.7 27.6 17.3 27.2 17.5 L 20.7 21.2 C 20.3 21.6 19.7 21.6 19.3 21.2 L 12.8 17.5 C 12.4 17.3 12.4 16.7 12.8 16.5 Z" fill="url(#ln-top)" />
    <path d="M 12.8 21.2 L 19.3 24.9 C 19.7 25.1 20.3 25.1 20.7 24.9 L 27.2 21.2 C 27.8 20.8 28.5 21.3 28.5 22.0 L 27.4 23.3 C 27.2 23.6 26.8 23.8 26.5 24.0 L 20.7 27.3 C 20.3 27.5 19.7 27.5 19.3 27.3 L 13.5 24.0 C 13.2 23.8 12.8 23.6 12.6 23.3 L 11.5 22.0 C 11.5 21.3 12.2 20.8 12.8 21.2 Z" fill="url(#ln-mid)" />
    <path d="M 12.8 26.5 L 19.3 30.2 C 19.7 30.4 20.3 30.4 20.7 30.2 L 27.2 26.5 C 27.8 26.1 28.5 26.6 28.5 27.3 L 27.4 28.6 C 27.2 28.9 26.8 29.1 26.5 29.3 L 20.7 32.6 C 20.3 32.8 19.7 32.8 19.3 32.6 L 13.5 29.3 C 13.2 29.1 12.8 28.9 12.6 28.6 L 11.5 27.3 C 11.5 26.6 12.2 26.1 12.8 26.5 Z" fill="url(#ln-bot)" />
  </g>
  <text x="52" y="22" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="700" letter-spacing="1.2">FEATURED ON</text>
  <text x="52" y="39" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="800">LaunchNests</text>
</svg>`
  }

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
