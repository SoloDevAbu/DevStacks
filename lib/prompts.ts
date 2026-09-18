import { SITE_CONFIG } from "@/constants/site"

export const AI_PROMPTS = {
  home: `What tools and products are launching today and this week on ${SITE_CONFIG.name}? What's gaining the most community votes right now?`,
  trending: `What are the most popular trending developer tools, APIs, and software products right now on ${SITE_CONFIG.name}?`,
  discover: `Help me discover new and interesting developer tools, database solutions, authentication APIs, and developer infrastructure on ${SITE_CONFIG.name}.`,
  pricing: `What are the listing, verification, and sponsorship plans available on ${SITE_CONFIG.name} to promote developer tools and products?`,
  newRising: `What are the newest and rising developer tools and products launched in the last 7 days on ${SITE_CONFIG.name}?`,
  dailyLaunches: `What developer tools and products are launching today on ${SITE_CONFIG.name}? Which ones are getting the most community votes?`,
  weeklyLaunches: `What developer tools and products launched this week on ${SITE_CONFIG.name}? Show me what the community voted for most.`,
  risingTools: `What developer tools and APIs are gaining the most momentum right now on ${SITE_CONFIG.name}?`,
  risingProducts: `What products and developer tools are gaining the most momentum right now on ${SITE_CONFIG.name}?`,
  recentlyAdded: `What are the latest developer tools and products added to ${SITE_CONFIG.name}?`,
  popularBuildingBlocks: `What are the most popular building blocks and tools developers use on ${SITE_CONFIG.name}?`,
  tools: `What developer tools, APIs, and infrastructure are listed in the directory on ${SITE_CONFIG.name}?`,
  products: `What developer tools and software products are listed in the directory on ${SITE_CONFIG.name}?`,
  submit: `How can I submit my developer tool, API, or software product to ${SITE_CONFIG.name}, and what are the discoverability, SEO, and AI engine benefits?`,
  showcase: `How do developer build showcases and 'Built With' tech-stack breakdowns work on ${SITE_CONFIG.name}?`,
  faq: `What is ${SITE_CONFIG.name} (${SITE_CONFIG.domain})? How does directory submission, community ranking, and AI answer engine discoverability work for developer tools and products?`,
  mcp: `How does the ${SITE_CONFIG.name} Model Context Protocol (MCP) server work, what 8 tools are available, and how do I connect it to Cursor, Windsurf, or Claude Code?`,
  cli: `How do I use the ${SITE_CONFIG.name} CLI and OpenAPI 3.1 REST API (/v1) to query developer tools, products, and tech stacks from the terminal or AI pipelines?`,
  terms: `Summarize the Terms of Service for ${SITE_CONFIG.name} (${SITE_CONFIG.domain}). What are the rules for directory submissions, community rankings, and promotional services?`,
  privacy: `Summarize the Privacy Policy for ${SITE_CONFIG.name} (${SITE_CONFIG.domain}). What data is collected, how is it protected, and what are my rights?`,
  refund: `What is the Refund Policy for advertising, featured placements, and sponsorship packages on ${SITE_CONFIG.name}?`,
  dashboard: `How does the maker dashboard work on ${SITE_CONFIG.name}? How can I manage my submissions, track upvotes, and optimize my product listings?`,
  notFound: `I encountered a missing page on ${SITE_CONFIG.name} (${SITE_CONFIG.domain}). What developer tools, products, and tech stacks can I explore?`,
  product: (productName: string, tagline?: string) =>
    `Tell me about ${productName}${tagline ? ` (${tagline})` : ""} featured on ${SITE_CONFIG.name}. What problem does it solve, what are its key features, tech stack compatibility, and alternatives?`,
  tool: (toolName: string, tagline?: string) =>
    `Tell me about ${toolName}${tagline ? ` (${tagline})` : ""} featured on ${SITE_CONFIG.name}. What problem does it solve, what are its key features, pricing, and what products are built with it?`,
  makers: `Who are the featured developers and makers building software and developer tools on ${SITE_CONFIG.name}? What tech stacks and tools do they specialize in?`,
  maker: (makerName: string, username?: string, bio?: string | null) =>
    `Tell me about ${makerName}${username ? ` (@${username})` : ""}, developer and maker on ${SITE_CONFIG.name}.${bio ? ` Bio: "${bio}".` : ""} What developer tools, products, and tech stacks have they built?`,
}

export interface PageAiGuide {
  title: string
  whatItIs: string
  howToUse: string
  prompt: string
  suggestedQuestions: string[]
}

export const getPageAiGuide = (pathname: string): PageAiGuide => {
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "") || "/"

  if (cleanPath === "/") {
    return {
      title: "Today's Launches & Live Feed",
      whatItIs:
        "The real-time discovery feed of developer tools, APIs, and software products launched today and this week, ranked by live community upvotes.",
      howToUse:
        "Toggle between Today and This Week tabs, upvote tools you love, click product cards to inspect verified tech stacks, or click tools to see live builds.",
      prompt: AI_PROMPTS.home,
      suggestedQuestions: [
        "What are the top 3 launches today?",
        "How does the daily launch ranking work?",
        "Which new developer tools launched this week?",
      ],
    }
  }

  if (cleanPath === "/trending") {
    return {
      title: "Trending Stacks & Momentum",
      whatItIs:
        "The algorithmic leaderboard tracking developer tools and products with the highest momentum, upvote velocity, and community engagement.",
      howToUse:
        "Select a timeframe (Today, Week, Month, All-Time), filter by category pills (AI, Database, Auth), and evaluate battle-tested technologies.",
      prompt: AI_PROMPTS.trending,
      suggestedQuestions: [
        "Why are these tools trending right now?",
        "Compare the top 2 trending tools on this list",
        "Show trending tools in AI and Databases",
      ],
    }
  }

  if (cleanPath.startsWith("/tools/")) {
    const slug = cleanPath.replace("/tools/", "")
    return {
      title: `Tool Deep Dive (${slug})`,
      whatItIs:
        "The canonical technical profile of this developer infrastructure tool, showing verified builds, pricing models, feature specs, and community upvotes.",
      howToUse:
        "Upvote the tool, scroll down to see real-world products built with it, or click 'Showcase Your Build' to link your own project.",
      prompt: AI_PROMPTS.tool(slug),
      suggestedQuestions: [
        "What makes this tool unique vs competitors?",
        "Show me products built with this tool",
        "Explain the pricing model and free tier",
      ],
    }
  }

  if (cleanPath === "/tools") {
    return {
      title: "Developer Tools Directory",
      whatItIs:
        "The comprehensive database of developer infrastructure, APIs, SDKs, backend platforms, and building blocks cataloged on LaunchNests.",
      howToUse:
        "Filter by category and pricing model (Free, Freemium, Open Source), sort by Most Builds or Most Upvotes, and click any tool to inspect real products using it.",
      prompt: AI_PROMPTS.tools,
      suggestedQuestions: [
        "Recommend the best open-source tools",
        "Compare top database tools on LaunchNests",
        "What developer tools have the most verified builds?",
      ],
    }
  }

  if (cleanPath.startsWith("/products/")) {
    const slug = cleanPath.replace("/products/", "")
    return {
      title: `Product Architecture (${slug})`,
      whatItIs:
        "An in-depth case study and architectural profile of this software product, including verified 'Built With' tech stack, demo video, and creator profile.",
      howToUse:
        "Click 'Like' to boost ranking, explore the tools chip list to inspect the product's underlying stack, or click the maker badge to view their other projects.",
      prompt: AI_PROMPTS.product(slug),
      suggestedQuestions: [
        "Explain how this product's tech stack works",
        "What problem does this product solve?",
        "Who are the main alternatives to this product?",
      ],
    }
  }

  if (cleanPath === "/products") {
    return {
      title: "Products Showcase Directory",
      whatItIs:
        "The public showcase of developer-built applications, SaaS platforms, and production software, highlighting transparent 'Built With' tech stacks.",
      howToUse:
        "Search for products by name or problem space, filter by category and pricing, and inspect tech stack badges on each card to discover what powers them.",
      prompt: AI_PROMPTS.products,
      suggestedQuestions: [
        "What are the most popular products on LaunchNests?",
        "Find products built with Next.js and Supabase",
        "How do I submit my own product to this directory?",
      ],
    }
  }

  if (cleanPath.startsWith("/makers/")) {
    const username = cleanPath.replace("/makers/", "")
    return {
      title: `Maker Profile (@${username})`,
      whatItIs:
        "The verified public portfolio of a developer or maker, showcasing their bio, location, social links, submitted tools, launched products, and custom FAQs.",
      howToUse:
        "Explore all tools and products launched by this creator, inspect their development philosophy in their custom FAQs, and connect via their verified social links.",
      prompt: AI_PROMPTS.maker(username, username),
      suggestedQuestions: [
        `What products has @${username} built?`,
        "What tech stack does this maker specialize in?",
        "Summarize this maker's developer FAQs",
      ],
    }
  }

  if (cleanPath === "/makers") {
    return {
      title: "Developers & Makers Directory",
      whatItIs:
        "The community directory of engineers, founders, and indie hackers actively shipping software and developer infrastructure on LaunchNests.",
      howToUse:
        "Browse makers by location and portfolio size, click any maker card to inspect their shipped tools and products, or submit your own projects to join.",
      prompt: AI_PROMPTS.makers,
      suggestedQuestions: [
        "Who are the most active makers on LaunchNests?",
        "Find makers building open-source developer tools",
        "How do I get listed in the Makers directory?",
      ],
    }
  }

  if (cleanPath === "/showcase") {
    return {
      title: "Showcase a Build",
      whatItIs:
        "The community build gallery where developers publish their production software and declare the exact developer tools and APIs used to build it.",
      howToUse:
        "Enter your product details, website URL, and select the tools in your tech stack. Submitting creates verified cross-promotional backlinks on tool pages.",
      prompt: AI_PROMPTS.showcase,
      suggestedQuestions: [
        "How does showcasing my build help SEO and backlinks?",
        "How do I tag tools in my tech stack?",
        "Where will my showcase appear on LaunchNests?",
      ],
    }
  }

  if (cleanPath === "/submit") {
    return {
      title: "Submit a Tool or Product",
      whatItIs:
        "The maker onboarding portal to catalog a new developer tool, API, or software product with structured metadata for SEO, GEO, and AI answer engines.",
      howToUse:
        "Select Tool or Product, fill in name, problem statement, solution, unique value, and AI context to ensure instant indexing across search engines and AI models.",
      prompt: AI_PROMPTS.submit,
      suggestedQuestions: [
        "What is the difference between a Tool and a Product?",
        "What should I write in the AI Context field?",
        "How does community voting work on launches?",
      ],
    }
  }

  if (cleanPath === "/pricing") {
    return {
      title: "Sidebar Sponsorship & Pricing",
      whatItIs:
        "Transparent details on directory submission (100% free forever) and premium sidebar sponsorship packages seen across all pages on LaunchNests.",
      howToUse:
        "Review impressions, audience reach (50,000+ developers), and sponsorship packages. Direct message on X or reach out to reserve exclusive placement.",
      prompt: AI_PROMPTS.pricing,
      suggestedQuestions: [
        "How much does directory submission cost?",
        "Where do sponsored sidebar placements appear?",
        "What developer audience does LaunchNests reach?",
      ],
    }
  }

  if (cleanPath === "/faq") {
    return {
      title: "FAQ & Platform Knowledge Base",
      whatItIs:
        "Answers to common questions about directory submissions, community voting, tech-stack linking, sponsorships, and AI answer engine discoverability.",
      howToUse:
        "Explore the 4 categories (Launching, Sponsorship, SEO/AEO, and AI Agents) or use the 1-click AI buttons to ask conversational questions.",
      prompt: AI_PROMPTS.faq,
      suggestedQuestions: [
        "How is LaunchNests different from Product Hunt?",
        "What sponsorship and advertising options are available?",
        "How does LaunchNests optimize tools for AI answer engines (AEO)?",
        "Does LaunchNests have a public API and MCP server?",
      ],
    }
  }

  if (cleanPath === "/discover/weekly-launches") {
    return {
      title: "This Week's Launches",
      whatItIs:
        "The weekly discovery feed of developer tools and products that launched over the past 7 days, ranked by community momentum.",
      howToUse:
        "Review top performers from the current weekly cohort, check out their verified builds, and upvote tools that solve your workflow pain points.",
      prompt: AI_PROMPTS.weeklyLaunches,
      suggestedQuestions: [
        "What was the most upvoted tool this week?",
        "Summarize the best developer products launched this week",
        "How does the weekly leaderboard reset?",
      ],
    }
  }

  if (cleanPath === "/discover/popular-building-blocks") {
    return {
      title: "Popular Building Blocks",
      whatItIs:
        "The essential foundational technologies, databases, auth providers, and cloud services most frequently utilized in verified developer builds.",
      howToUse:
        "Inspect the core building blocks used by high-traction apps to make informed architectural decisions for your own tech stack.",
      prompt: AI_PROMPTS.popularBuildingBlocks,
      suggestedQuestions: [
        "What are the top 5 building blocks used by developers?",
        "Which database tools have the most verified builds?",
        "What auth solutions do indie developers prefer?",
      ],
    }
  }

  if (cleanPath.startsWith("/discover")) {
    return {
      title: "Developer Launches & Discovery",
      whatItIs:
        "Curated discovery hub featuring developer tools, APIs, and software products ranked by community upvotes and verified adoption.",
      howToUse:
        "Use category and pricing filters, explore daily and weekly leaderboards, and discover tools that boost developer productivity.",
      prompt: AI_PROMPTS.discover,
      suggestedQuestions: [
        "What are the best developer tools launched this week?",
        "Which tools offer free tiers for developers?",
        "How does community voting work on LaunchNests?",
      ],
    }
  }

  if (cleanPath === "/mcp") {
    return {
      title: "Model Context Protocol (MCP) Server",
      whatItIs:
        "Documentation and connection guides for the public LaunchNests Model Context Protocol streamable HTTP server exposing 8 real-time developer tools.",
      howToUse:
        "Connect Cursor, Windsurf, Claude Code, or custom AI agents by adding the streamable HTTP endpoint (POST /api/mcp) to your local mcp.json configuration.",
      prompt: AI_PROMPTS.mcp,
      suggestedQuestions: [
        "What 8 MCP tools are available on LaunchNests?",
        "How do I configure Cursor to use the LaunchNests MCP server?",
        "Can I query live tech stacks and upvotes from Claude Code?",
      ],
    }
  }

  if (cleanPath === "/cli") {
    return {
      title: "CLI & Public REST API (/v1)",
      whatItIs:
        "Developer access guide for querying the LaunchNests catalog directly via terminal CLI commands, cURL, or the OpenAPI 3.1 REST API.",
      howToUse:
        "Run CLI commands or make direct HTTP GET requests to /v1/tools, /v1/products, and /v1/search. No API key required for public read requests.",
      prompt: AI_PROMPTS.cli,
      suggestedQuestions: [
        "How do I query developer tools using cURL or CLI?",
        "What REST endpoints are exposed under /v1?",
        "Where can I find the OpenAPI 3.1 JSON specification?",
      ],
    }
  }

  if (cleanPath === "/terms") {
    return {
      title: "Terms of Service",
      whatItIs:
        "The legal terms governing use of LaunchNests, directory submissions, community voting, account responsibilities, and promotional placements.",
      howToUse:
        "Read user guidelines, maker submission requirements, community integrity policies, and intellectual property provisions.",
      prompt: AI_PROMPTS.terms,
      suggestedQuestions: [
        "How does directory listing and launch voting work?",
        "What are the sponsorship and Do-Follow backlink rules?",
        "What are the protocols for AI agents and MCP tools?",
        "What are the rules on upvote manipulation and acceptable use?",
      ],
    }
  }

  if (cleanPath === "/privacy") {
    return {
      title: "Privacy Policy",
      whatItIs:
        "Comprehensive explanation of how LaunchNests collects, uses, and safeguards user, maker, and visitor data.",
      howToUse:
        "Review information collection practices, cookie policies, edge geolocation handling, and data deletion rights.",
      prompt: AI_PROMPTS.privacy,
      suggestedQuestions: [
        "What personal and technical data does LaunchNests collect?",
        "How is maker content indexed by AI answer engines and crawlers?",
        "What are my rights under GDPR and the DPDP Act?",
        "How do I request account and listing data deletion?",
      ],
    }
  }

  if (cleanPath === "/refund") {
    return {
      title: "Refund Policy",
      whatItIs:
        "Clear terms and refund conditions for sidebar sponsorship placements, verified maker badges, and promotional packages.",
      howToUse:
        "Check cancellation windows, scheduling adjustment terms, and customer support contact methods.",
      prompt: AI_PROMPTS.refund,
      suggestedQuestions: [
        "Are developer tool and product listings free on LaunchNests?",
        "What is the cancellation policy for sidebar sponsorships?",
        "What happens if my listing is rejected after purchasing promotion?",
        "How do I submit a refund request to billing support?",
      ],
    }
  }

  if (cleanPath.startsWith("/dashboard")) {
    return {
      title: "Maker Dashboard",
      whatItIs:
        "The creator control center to manage submitted tools, products, tech-stack backlinks, and monitor community upvote performance.",
      howToUse:
        "Review submission statuses, edit tool descriptions and AI Context, view live upvote metrics, and link new builds.",
      prompt: AI_PROMPTS.dashboard,
      suggestedQuestions: [
        "How do I edit my submitted tool or product?",
        "How can I track community upvotes on my projects?",
        "How do I add custom maker FAQs to my profile?",
      ],
    }
  }

  return {
    title: "LaunchNests Ecosystem",
    whatItIs:
      "The premier developer tools discovery directory, APIs database, and tech-stack ecosystem platform.",
    howToUse:
      "Explore tools, discover software products, inspect verified tech stacks, and find trending technologies.",
    prompt: AI_PROMPTS.notFound,
    suggestedQuestions: [
      "What is LaunchNests and what can I find here?",
      "How do I search for developer tools by category?",
      "How do developers showcase what they built?",
    ],
  }
}
