import { SITE_CONFIG } from "@/constants/site"

export const DEVSTACKS_FAQS = [
  {
    question: `What is ${SITE_CONFIG.name} and what does it do?`,
    answer: `${SITE_CONFIG.name} (${SITE_CONFIG.domain}) is a curated discovery directory and tech-stack database for developer tools, APIs, infrastructure services, and developer-built products. It enables software engineers, engineering leads, and technical founders to discover production-ready tools, inspect real-world tech stacks ("Built With"), and track trending developer products through verified community rankings.`,
  },
  {
    question: `What is the difference between "Tools" and "Products" on ${SITE_CONFIG.name}?`,
    answer: `"Tools" are foundational building blocks, libraries, databases, and APIs that developers build with (such as Supabase, Stripe, Neon, Vercel, and PostHog). "Products" are end-user software applications, SaaS products, and indie tools that developers build using those underlying tools. This dual taxonomy powers the "Built With" relationship graph.`,
  },
  {
    question: `How does the "Built With" tech-stack ecosystem work?`,
    answer: `The "Built With" ecosystem reveals the exact architectural components behind real-world software products. For example, developers can view all applications built with a specific database, authentication provider, or edge framework, enabling transparent software blueprints and informed architectural decisions.`,
  },
  {
    question: `How does ${SITE_CONFIG.name} evaluate and rank developer tools?`,
    answer: `Developer tools on ${SITE_CONFIG.name} are ranked using an algorithmic discovery feed that factors in community upvotes, page views, active developer builds, and recent momentum. New submissions receive an algorithmic 7-day freshness boost in the "New & Rising" feed before graduating into the permanent ecosystem.`,
  },
  {
    question: `How can founders and developers list their tools on ${SITE_CONFIG.name}?`,
    answer: `Founders and developers can submit tools or products via the ${SITE_CONFIG.url}/submit portal. Submissions capture technical problem statements, solutions, unique value propositions, platform compatibility, pricing tiers, and AI context prompts for automated engine optimization.`,
  },
  {
    question: `How is ${SITE_CONFIG.name} optimized for AI assistants and answer engines (GEO / AEO)?`,
    answer: `${SITE_CONFIG.name} publishes structured Schema.org JSON-LD (WebSite, SoftwareApplication, CollectionPage, ItemList, FAQPage), provides open crawling for AI bots (GPTBot, ClaudeBot, PerplexityBot, Applebot, SearchGPT), and serves standardized /llms.txt and /llms-full.txt endpoints for generative engine indexing.`,
  },
  {
    question: `Can I list open-source or free developer tools on ${SITE_CONFIG.name}?`,
    answer: `Yes. Open-source, free, freemium, and commercial developer tools are welcomed and indexed on ${SITE_CONFIG.name}. Open-source projects feature direct links to their GitHub repositories and community badges.`,
  },
] as const
