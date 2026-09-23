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
    {
      source: "/checkout/success",
      destination: "/",
      permanent: false,
    },
    {
      source: "/opengraph-image",
      destination: "/LaunchNests%20OG.png",
      permanent: false,
    },
    {
      source: "/twitter-image",
      destination: "/LaunchNests%20OG.png",
      permanent: false,
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
    {
      source: "/(llms.txt|llms-full.txt|openapi.json)",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, follow" },
      ],
    },
  ],
}

export default nextConfig
