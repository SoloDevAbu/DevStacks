import { SITE_CONFIG } from "@/constants/site"

export const AI_PROMPTS = {
  home: `What can you tell me about ${SITE_CONFIG.name} (${SITE_CONFIG.domain}), the platform to discover developer tools, APIs, infrastructure, and what developers are building with them?`,
  trending: `What are the most popular trending developer tools, APIs, and software products right now on ${SITE_CONFIG.name}?`,
  discover: `Help me discover new and interesting developer tools, database solutions, authentication APIs, and developer infrastructure on ${SITE_CONFIG.name}.`,
  builtWith: `What are the most widely used developer tools and building blocks in real-world software stacks featured on ${SITE_CONFIG.name}?`,
  product: (productName: string, tagline?: string) =>
    `Tell me about ${productName}${tagline ? ` (${tagline})` : ""} featured on ${SITE_CONFIG.name}. What problem does it solve, what are its key features, tech stack compatibility, and alternatives?`,
}
