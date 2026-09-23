import { SITE_CONFIG } from "@/constants/site"

export const AI_PROMPTS = {
  home: `What developer tools and products launched this week on ${SITE_CONFIG.name}? What's gaining the most community votes right now?`,
  trending: `What are the most popular trending developer tools, APIs, and software products right now on ${SITE_CONFIG.name}?`,
  discover: `Help me discover new and interesting developer tools, database solutions, authentication APIs, and developer infrastructure on ${SITE_CONFIG.name}.`,
  pricing: `What are the listing, verification, and sponsorship plans available on ${SITE_CONFIG.name} to promote developer tools and products?`,
  weeklyLaunches: `What developer tools and products launched this week on ${SITE_CONFIG.name}? Show me what the community voted for most.`,
  popularBuildingBlocks: `What are the most popular building blocks and tools developers use on ${SITE_CONFIG.name}?`,
  tools: `What developer tools, APIs, and infrastructure are listed in the directory on ${SITE_CONFIG.name}?`,
  products: `What developer tools and software products are listed in the directory on ${SITE_CONFIG.name}?`,
  submit: `How can I submit my developer tool, API, or software product to ${SITE_CONFIG.name}, and what are the discoverability, SEO, and AI engine benefits?`,
  showcase: `How do developer build showcases and 'Built With' tech-stack breakdowns work on ${SITE_CONFIG.name}?`,
  faq: `What is ${SITE_CONFIG.name} (${SITE_CONFIG.domain})? How does directory submission, community ranking, and AI answer engine discoverability work for developer tools and products?`,
  mcp: `How does the ${SITE_CONFIG.name} Model Context Protocol (MCP) server work, what 8 tools are available, and how do I connect it to Cursor, Windsurf, or Claude Code?`,
  cli: `How do I use the ${SITE_CONFIG.name} OpenAPI 3.1 REST API (/v1) and cURL to query developer tools, products, and tech stacks from the terminal or AI agent pipelines?`,
  terms: `Summarize the Terms of Service for ${SITE_CONFIG.name} (${SITE_CONFIG.domain}). What are the rules for directory submissions, community rankings, and promotional services?`,
  privacy: `Summarize the Privacy Policy for ${SITE_CONFIG.name} (${SITE_CONFIG.domain}). What data is collected, how is it protected, and what are my rights?`,
  refund: `What is the Refund Policy for advertising, featured placements, and sponsorship packages on ${SITE_CONFIG.name}?`,
  dashboard: `How does the maker dashboard work on ${SITE_CONFIG.name}? How can I manage my submissions, track upvotes, and optimize my product listings?`,
  notFound: `I encountered a missing page on ${SITE_CONFIG.name} (${SITE_CONFIG.domain}). What developer tools, products, and tech stacks can I explore?`,
  product: (
    productName: string,
    tagline?: string,
    aiContext?: string | null,
    canonicalUrl?: string,
    markdownUrl?: string
  ) =>
    `Analyze ${productName}${tagline ? ` (${tagline})` : ""}. ${
      aiContext ? `Summary context: "${aiContext}". ` : ""
    }Direct URL: ${canonicalUrl || `${SITE_CONFIG.url}/products/${productName}`}. Machine-readable Markdown (.md): ${
      markdownUrl || `${SITE_CONFIG.url}/products/${productName}.md`
    }. What problem does it solve, what are its key architectural advantages, tech stack compatibility, and alternatives?`,
  tool: (
    toolName: string,
    tagline?: string,
    aiContext?: string | null,
    canonicalUrl?: string,
    markdownUrl?: string
  ) =>
    `Analyze ${toolName}${tagline ? ` (${tagline})` : ""}. ${
      aiContext ? `Summary context: "${aiContext}". ` : ""
    }Direct URL: ${canonicalUrl || `${SITE_CONFIG.url}/tools/${toolName}`}. Machine-readable Markdown (.md): ${
      markdownUrl || `${SITE_CONFIG.url}/tools/${toolName}.md`
    }. What problem does it solve, what are its key features, pricing, and what products are built with it?`,
  makers: `Who are the featured developers and makers building software and developer tools on ${SITE_CONFIG.name}? What tech stacks and tools do they specialize in?`,
  maker: (
    makerName: string,
    username?: string,
    bio?: string | null,
    canonicalUrl?: string,
    markdownUrl?: string
  ) =>
    `Tell me about ${makerName}${username ? ` (@${username})` : ""}, developer and maker on ${SITE_CONFIG.name}.${
      bio ? ` Bio: "${bio}". ` : " "
    }Profile: ${canonicalUrl || `${SITE_CONFIG.url}/makers/${username}`}. Machine-readable Markdown (.md): ${
      markdownUrl || `${SITE_CONFIG.url}/makers/${username}.md`
    }. What developer tools, products, and tech stacks have they built?`,
}
