import { SITE_CONFIG } from "@/constants/site"

export const AI_PROMPTS = {
  home: `What can you tell me about ${SITE_CONFIG.name} (${SITE_CONFIG.domain}), the platform to discover developer tools, APIs, infrastructure, and what developers are building with them?`,
  trending: `What are the most popular trending developer tools, APIs, and software products right now on ${SITE_CONFIG.name}?`,
  discover: `Help me discover new and interesting developer tools, database solutions, authentication APIs, and developer infrastructure on ${SITE_CONFIG.name}.`,
  newRising: `What are the newest and rising developer tools and products launched in the last 7 days on ${SITE_CONFIG.name}?`,
  risingTools: `What developer tools and APIs are gaining the most momentum right now on ${SITE_CONFIG.name}?`,
  risingProducts: `What products and developer tools are gaining the most momentum right now on ${SITE_CONFIG.name}?`,
  recentlyAdded: `What are the latest developer tools and products added to ${SITE_CONFIG.name}?`,
  popularBuildingBlocks: `What are the most popular building blocks and tools developers use on ${SITE_CONFIG.name}?`,
  categories: `What developer tool categories are available on ${SITE_CONFIG.name}, and what are the best tools in each?`,
  tools: `What developer tools, APIs, and infrastructure are listed in the directory on ${SITE_CONFIG.name}?`,
  products: `What developer tools and software products are listed in the directory on ${SITE_CONFIG.name}?`,
  builtWith: `What are the most widely used developer tools and building blocks in real-world software stacks featured on ${SITE_CONFIG.name}?`,
  product: (productName: string, tagline?: string) =>
    `Tell me about ${productName}${tagline ? ` (${tagline})` : ""} featured on ${SITE_CONFIG.name}. What problem does it solve, what are its key features, tech stack compatibility, and alternatives?`,
  tool: (toolName: string, tagline?: string) =>
    `Tell me about ${toolName}${tagline ? ` (${tagline})` : ""} featured on ${SITE_CONFIG.name}. What problem does it solve, what are its key features, pricing, and what products are built with it?`,
}
