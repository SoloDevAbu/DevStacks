import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const authMetadata = {
    issuer: SITE_CONFIG.url,
    authorization_endpoint: `${SITE_CONFIG.url}/api/auth/signin`,
    token_endpoint: `${SITE_CONFIG.url}/api/auth/callback`,
    userinfo_endpoint: `${SITE_CONFIG.url}/api/auth/session`,
    registration_endpoint: `${SITE_CONFIG.url}/api/auth/signin`,
    scopes_supported: ["openid", "email", "profile"],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    service_documentation: `${SITE_CONFIG.url}/auth.md`,
    ui_locales_supported: ["en-US"],
    agent_auth: {
      skill: `${SITE_CONFIG.url}/auth.md`,
      register_uri: `${SITE_CONFIG.url}/api/auth/signin`,
      claim_uri: `${SITE_CONFIG.url}/api/auth/signin`,
      identity_types_supported: ["identity_assertion"],
      identity_assertion: {
        assertion_types_supported: ["verified_email"],
      },
      credential_types_supported: ["oauth_session_cookie"],
    },
  }

  return NextResponse.json(authMetadata, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
