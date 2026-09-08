import { ImageResponse } from "next/og"
import { SITE_CONFIG } from "@/constants/site"

export const runtime = "edge"
export const alt = `${SITE_CONFIG.name} — Discover Developer Tools & Products`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#090d16",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(99, 102, 241, 0.15) 10%, transparent 60%)",
        padding: "80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: 800,
            boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)",
          }}
        >
          DS
        </div>
        <span
          style={{
            fontSize: "36px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_CONFIG.name}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "900px",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "#f8fafc",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Discover Developer Tools, APIs & Products
        </h1>
        <p
          style={{
            fontSize: "26px",
            fontWeight: 500,
            color: "#94a3b8",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Explore community upvotes, battle-tested tech stacks, and what
          builders are creating.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            padding: "10px 20px",
            borderRadius: "9999px",
            backgroundColor: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "#a5b4fc",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Trending Tools
        </div>
        <div
          style={{
            padding: "10px 20px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#cbd5e1",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Built With Stacks
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
