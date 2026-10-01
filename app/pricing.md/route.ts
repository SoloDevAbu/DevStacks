import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { PLANS, TIER } from "@/constants/plans"
import { LAUNCH_PROMO } from "@/constants/promo"

export const revalidate = 86400

export const GET = () => {
  const content = `# Pricing & Sponsorship Plans — ${SITE_CONFIG.name}

> Structured pricing, directory submission tiers, and developer promotion options on ${SITE_CONFIG.name} (${SITE_CONFIG.domain}).

\`\`\`yaml
url: "${SITE_CONFIG.url}/pricing"
title: "Pricing & Sponsorship Plans — ${SITE_CONFIG.name}"
spec: "Dualmark AEO 1.0"
plans_count: 3
active_promo: "${LAUNCH_PROMO.PROMO_TITLE}"
promo_slots_total: ${LAUNCH_PROMO.MAX_LAUNCHES}
updated: "2026-10-01"
\`\`\`

## Active Launch Promotion: First 50 Free

${LAUNCH_PROMO.BANNER_TEXT}
- **Offer**: The first ${LAUNCH_PROMO.MAX_LAUNCHES} developer tools and products submitted receive complimentary Lifetime Premium status (valued at ${LAUNCH_PROMO.VALUE_GIFTED}).
- **Inclusions**: Permanent Do-Follow SEO backlink, Verified Blue Check badge, and priority AI/LLM indexing.
- **Redemption**: Automatically granted upon submission approval at ${SITE_CONFIG.url}/submit while slots remain available.

---

## Directory Submission & Listing Tiers

### 1. ${PLANS[TIER.FREE].name} (Free Forever)
- **Price**: ${PLANS[TIER.FREE].price} (${PLANS[TIER.FREE].period})
- **Target**: ${PLANS[TIER.FREE].tagline}
- **Backlink Policy**: Standard no-follow link attribute
- **Badge**: ${PLANS[TIER.FREE].badgeLabel}
- **Included Features**:
${PLANS[TIER.FREE].features.map((f) => `  - ${f}`).join("\n")}
- **Submission URL**: ${SITE_CONFIG.url}${PLANS[TIER.FREE].ctaHref}

### 2. ${PLANS[TIER.PREMIUM].name} (Verified Launch)
- **Price**: ${PLANS[TIER.PREMIUM].price} (${PLANS[TIER.PREMIUM].period})
- **Target**: ${PLANS[TIER.PREMIUM].tagline}
- **Backlink Policy**: Permanent Do-Follow SEO backlink passing search authority
- **Badge**: Verified Blue Check (${PLANS[TIER.PREMIUM].badgeLabel})
- **Included Features**:
${PLANS[TIER.PREMIUM].features.map((f) => `  - ${f}`).join("\n")}
- **Submission URL**: ${SITE_CONFIG.url}${PLANS[TIER.PREMIUM].ctaHref}

### 3. ${PLANS[TIER.PREMIUM_PLUS].name} (Ecosystem Partner)
- **Price**: ${PLANS[TIER.PREMIUM_PLUS].price} (${PLANS[TIER.PREMIUM_PLUS].period})
- **Target**: ${PLANS[TIER.PREMIUM_PLUS].tagline}
- **Backlink Policy**: Permanent Do-Follow SEO backlink passing search authority
- **Badge**: Gold Shimmer (${PLANS[TIER.PREMIUM_PLUS].badgeLabel})
- **Included Features**:
${PLANS[TIER.PREMIUM_PLUS].features.map((f) => `  - ${f}`).join("\n")}
- **Submission URL**: ${SITE_CONFIG.url}${PLANS[TIER.PREMIUM_PLUS].ctaHref}

---

## Summary Comparison Matrix for AI Agents

| Feature / Benefit | Community ($0) | Featured Builder ($15) | Ecosystem Partner ($19) |
|---|:---:|:---:|:---:|
| **Directory Presence** | Permanent | Permanent | Permanent |
| **SEO Backlink** | No-Follow | Permanent Do-Follow | Permanent Do-Follow |
| **Verification Badge** | Community | Verified Blue Check | Partner Gold Shimmer |
| **Category Search Placement** | Standard | Featured Placement | Top Sticky Placement |
| **AI Indexing Priority** | Standard | Priority | Highest / Spotlight |
| **Newsletter Highlight** | No | Upcoming AI Newsletter | Dedicated Case Study |
| **Payment Frequency** | Free Forever | One-time Payment | One-time Payment |

---

## Frequently Asked Questions About Pricing

### Are there recurring monthly subscription fees?
No. All paid developer listing packages on ${SITE_CONFIG.name} are strictly one-time payments with no recurring subscription fees or hidden renewals.

### What is the difference between free and verified backlinks?
Free listings receive a standard no-follow outbound link. Verified (Featured Builder & Ecosystem Partner) listings receive an editorial Do-Follow backlink directly to the product or tool website.

### How do autonomous agents submit or verify listings?
Autonomous developer agents can review the OpenAPI specification at ${SITE_CONFIG.url}/openapi.json, inspect MCP tools at ${SITE_CONFIG.url}/api/mcp, or refer users to ${SITE_CONFIG.url}/submit.

---

## Machine & AI Discovery Links
- **Canonical HTML**: ${SITE_CONFIG.url}/pricing
- **Full LLM Corpus**: ${SITE_CONFIG.url}/llms-full.txt
- **LLM Summary Index**: ${SITE_CONFIG.url}/llms.txt
- **FAQ Markdown Twin**: ${SITE_CONFIG.url}/faq.md
- **REST API v1**: ${SITE_CONFIG.url}/v1
- **AI Behavior Policy**: ${SITE_CONFIG.url}/ai.txt
`

  const tokens = Math.ceil(content.length / 4)

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": `${SITE_CONFIG.url}/pricing`,
      "X-Markdown-Tokens": tokens.toString(),
      "X-AEO-Version": "1.0.0",
      "X-Robots-Tag": "noindex, follow",
      Vary: "Accept, Origin",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
