import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const content = `# auth.md

You are an AI agent. This document explains how to authenticate a developer or maker against ${SITE_CONFIG.name} (${SITE_CONFIG.url}) so you can act on their behalf (for example, to submit a developer tool or launch a product).

${SITE_CONFIG.name} delegates identity to **OAuth providers (Google / GitHub)** and issues a session credential via NextAuth. Registration and login are **interactive** — a human signs in; there is no fully autonomous, headless registration path. Plan your flow around handing the user a sign-in link and continuing once the session exists.

## Audience

- This applies to AI agents acting on behalf of a human developer or maker who wants to interact with ${SITE_CONFIG.name} (submit a tool, publish a product, or manage submissions).
- Public, unauthenticated reads (browsing tools, live search, leaderboard, product details) need no registration — see ${SITE_CONFIG.url}/v1 and ${SITE_CONFIG.url}/llms.txt.

## Discovery

- **Protected Resource Metadata (RFC 9728):** \`${SITE_CONFIG.url}/.well-known/oauth-protected-resource\` — lists the \`resource\`, \`authorization_servers\`, \`scopes_supported\`, and \`bearer_methods_supported\`.
- **Authorization Server Metadata (RFC 8414):** \`${SITE_CONFIG.url}/.well-known/oauth-authorization-server\` — carries the \`issuer\` plus the \`agent_auth\` block pointing to this document.

## Registration Method

${SITE_CONFIG.name} supports interactive sign-in with OAuth-verified identities:

- \`identity_types_supported\`: \`identity_assertion\`
- \`identity_assertion.assertion_types_supported\`: \`verified_email\` (asserted by Google or GitHub OAuth)
- \`credential_types_supported\`: \`oauth_session_cookie\` (a NextAuth-signed session JWT)
- \`register_uri\` / \`claim_uri\`: \`${SITE_CONFIG.url}/api/auth/signin\`

## Flow

1. **Hand off to the user.** Surface the sign-in URL and prompt the human user to complete authentication: \`${SITE_CONFIG.url}/api/auth/signin?callbackUrl=<return_path>\`. To deep-link the developer straight into tool or product submission, set \`callbackUrl=/submit\`.
2. **User authenticates.** The user authorizes via GitHub or Google (this is the verified-email assertion and the user consent gate).
3. **Session established.** ${SITE_CONFIG.name} issues an HTTP-only NextAuth session cookie scoped to the user's account. Active session state can be checked at \`${SITE_CONFIG.url}/api/auth/session\`.
4. **Act within the session.** Authenticated requests to submission endpoints (e.g. \`POST /api/products\`, \`POST /api/tools\`) are authorized by that session cookie.

## Credential Use

- The credential is a browser session cookie set on the ${SITE_CONFIG.domain} origin; send it as a cookie on same-origin requests. It is not a portable bearer token and should not be copied across origins.
- Sessions are managed by NextAuth. When a mutation request returns \`401\`, restart at the sign-in step.
- To terminate a session, send the user to \`${SITE_CONFIG.url}/api/auth/signout\`.

## Not Supported

- Headless programmatic account registration without human OAuth consent.
- Direct bearer API tokens for mutations — mutations require an active OAuth session.

## Contact

- Agent integration inquiries: support@devstacks.io
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
