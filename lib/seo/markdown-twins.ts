import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

interface ToolTwinInput {
  name: string
  slug: string
  tagline?: string | null
  description?: string | null
  websiteUrl?: string | null
  logoUrl?: string | null
  category?: string | null
  pricing?: string | null
  buildsCount?: number | null
  upvotesCount?: number | null
  viewsCount?: number | null
  createdAt?: Date | string | null
}

interface ProductTwinInput {
  name: string
  slug: string
  tagline?: string | null
  description?: string | null
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  websiteUrl?: string | null
  logoUrl?: string | null
  githubUrl?: string | null
  category?: string | null
  tags?: string[] | null
  platforms?: string[] | null
  pricing?: string | null
  tier?: string | null
  builtWithTools?: Array<string | { name: string; toolSlug?: string }> | null
  likesCount?: number | null
  viewsCount?: number | null
  createdAt?: Date | string | null
  submitter?: {
    name?: string | null
  } | null
}


export const generateToolMarkdown = (
  tool: ToolTwinInput,
  relatedBuildsCount = 0
): string => {
  const canonical = `${SITE_CONFIG.url}/tools/${tool.slug}`
  const createdDate = tool.createdAt
    ? new Date(tool.createdAt).toISOString().split("T")[0]
    : "2026-01-01"

  return `# ${tool.name} — ${tool.tagline ?? "Developer Infrastructure & API"}

> ${tool.tagline ?? tool.description ?? "Developer tool cataloged on DevStacks"}

\`\`\`yaml
url: "${canonical}"
website: "${tool.websiteUrl ?? ""}"
category: "${tool.category ?? "Developer Tools"}"
pricing: "${tool.pricing ?? "Free / Paid"}"
builds_count: ${tool.buildsCount ?? relatedBuildsCount}
upvotes: ${tool.upvotesCount ?? 0}
created: "${createdDate}"
logo: "${tool.logoUrl ?? ""}"
\`\`\`

## About ${tool.name}

${tool.description ?? `${tool.name} is a developer tool and software building block cataloged on ${SITE_CONFIG.name}.`}

## Community Impact & Usage
- **Verified Builds**: ${tool.buildsCount ?? relatedBuildsCount} developer products actively declare ${tool.name} in their tech stack.
- **Community Upvotes**: ${tool.upvotesCount ?? 0} upvotes on ${SITE_CONFIG.name}.
- **Pricing Model**: ${tool.pricing ?? "Not specified"}.

## Integration & Official Links
- **Website**: ${tool.websiteUrl ?? canonical}
- **DevStacks Profile**: ${canonical}
- **Machine Discovery**: ${SITE_CONFIG.url}/api/md/tools/${tool.slug}
`
}

export const generateProductMarkdown = (product: ProductTwinInput): string => {
  const canonical = `${SITE_CONFIG.url}/products/${product.slug}`
  const createdDate = product.createdAt
    ? new Date(product.createdAt).toISOString().split("T")[0]
    : "2026-01-01"

  const toolsList = (product.builtWithTools ?? [])
    .map((t) => (typeof t === "string" ? t : t.name))
    .join(", ")
  const tagsList = (product.tags ?? []).join(", ")
  const platformsList = (product.platforms ?? []).join(", ")

  return `# ${product.name} — ${product.tagline ?? "Developer Product"}

> ${product.tagline ?? product.description ?? "Developer product on DevStacks"}

\`\`\`yaml
url: "${canonical}"
website: "${product.websiteUrl ?? ""}"
tier: "${product.tier ?? "free"}"
likes: ${product.likesCount ?? 0}
views: ${product.viewsCount ?? 0}
category: "${product.category ?? "Developer Tools"}"
tags: "${tagsList}"
platforms: "${platformsList}"
pricing: "${product.pricing ?? "Free"}"
built_with: "${toolsList}"
maker: "${product.submitter?.name ?? "Independent Developer"}"
created: "${createdDate}"
github: "${product.githubUrl ?? ""}"
logo: "${product.logoUrl ?? ""}"
\`\`\`

## About ${product.name}

${product.description ?? `${product.name} is a developer product cataloged on ${SITE_CONFIG.name}.`}

## Overview

### Problem
${product.problemStatement ?? "Modern software development presents complex integration and workflow challenges."}

### Solution
${product.solution ?? `${product.name} simplifies developer workflows with purpose-built tooling.`}

### What Makes It Unique
${product.uniqueValue ?? `${product.name} combines developer ergonomics with high performance.`}

## Tech Stack (Built With)
${
  product.builtWithTools && product.builtWithTools.length > 0
    ? product.builtWithTools
        .map((t) => {
          const name = typeof t === "string" ? t : t.name
          const slug =
            typeof t === "string"
              ? t.toLowerCase().replace(/\s+/g, "-")
              : (t.toolSlug ?? t.name.toLowerCase().replace(/\s+/g, "-"))
          return `- [${name}](${SITE_CONFIG.url}/tools/${slug})`
        })
        .join("\n")
    : "- Tech stack details available on the canonical product page."
}

## Canonical & Machine Links
- **Product Page**: ${canonical}
- **Official Website**: ${product.websiteUrl ?? canonical}
- **Markdown Twin**: ${SITE_CONFIG.url}/api/md/products/${product.slug}
`

}

export const createMarkdownResponse = (
  content: string,
  canonicalUrl: string
): NextResponse => {
  const tokens = Math.ceil(content.length / 4)

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": canonicalUrl,
      "X-Markdown-Tokens": tokens.toString(),
      "X-AEO-Version": "1.0.0",
      "X-Robots-Tag": "noindex, follow",
      "Vary": "Accept, Origin",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
