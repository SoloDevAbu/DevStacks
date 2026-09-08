import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const metadata = {
    resource: SITE_CONFIG.url,
    resource_name: SITE_CONFIG.name,
    resource_documentation: `${SITE_CONFIG.url}/auth.md`,
    authorization_servers: [
      SITE_CONFIG.url,
      "https://accounts.google.com",
      "https://github.com/login/oauth/authorize",
    ],
    bearer_methods_supported: ["header", "cookie"],
    scopes_supported: ["openid", "email", "profile"],
    resource_policy_uri: `${SITE_CONFIG.url}/pricing`,
    resource_tos_uri: `${SITE_CONFIG.url}/terms`,
  }

  return NextResponse.json(metadata, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
