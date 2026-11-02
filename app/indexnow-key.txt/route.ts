export const dynamic = "force-dynamic"

export const GET = () => {
  const key = process.env.INDEXNOW_KEY
  if (!key) return new Response("Not found", { status: 404 })

  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex",
    },
  })
}
