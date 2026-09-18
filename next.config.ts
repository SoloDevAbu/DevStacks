import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/discover/daily-launches",
      destination: "/",
      permanent: true,
    },
    {
      source: "/discover/new-rising",
      destination: "/trending",
      permanent: true,
    },
    {
      source: "/discover/rising-tools",
      destination: "/tools",
      permanent: true,
    },
    {
      source: "/discover/rising-products",
      destination: "/products",
      permanent: true,
    },
    {
      source: "/discover/recently-added",
      destination: "/products",
      permanent: true,
    },
    {
      source: "/discover",
      destination: "/discover/weekly-launches",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ],
    },
  ],
}

export default nextConfig
