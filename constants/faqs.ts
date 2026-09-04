import { SITE_CONFIG } from "@/constants/site"

export const DEVSTACKS_FAQS = [
  {
    question: `What is ${SITE_CONFIG.name}?`,
    answer: `${SITE_CONFIG.name} is a curated directory, discovery platform, and ecosystem for developer tools, APIs, and infrastructure software. It helps software engineers, technical founders, and builders discover production-ready tools, explore real-world tech stacks, and showcase products.`,
  },
  {
    question: `How does ${SITE_CONFIG.name} evaluate and rank developer tools?`,
    answer: `Developer tools on ${SITE_CONFIG.name} are ranked by community upvotes, page views, active developer builds, and verified user endorsements. High-tier verified products receive distinct ecosystem badges.`,
  },
  {
    question: `What is the "Built With" ecosystem on ${SITE_CONFIG.name}?`,
    answer: `The "Built With" section highlights which foundational building blocks—such as databases, authentication providers, edge hosting, and payment APIs—are used across real developer projects, providing transparent architectural blueprints.`,
  },
  {
    question: `How can founders and developers list their tools on ${SITE_CONFIG.name}?`,
    answer: `Anyone can submit a developer tool or API via the ${SITE_CONFIG.url}/submit portal. Submissions include technical problem statements, solutions, unique value propositions, supported platforms, pricing models, and AI context prompts.`,
  },
  {
    question: `How is ${SITE_CONFIG.name} optimized for AI search engines and answer engines (AEO / GEO)?`,
    answer: `${SITE_CONFIG.name} publishes structured Schema.org JSON-LD (WebSite, SoftwareApplication, ItemList, FAQPage), supports open crawling for AI bots like SearchGPT, Claude, and Perplexity, and serves standardized /llms.txt and /llms-full.txt endpoints for automated reasoning agents.`,
  },
] as const
