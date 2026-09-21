import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  id: string
  title: string
  description: string
  headerThemeKey: "launching" | "sponsorship" | "seo" | "agents"
  badge?: string
  badgeClass?: string
  items: FaqItem[]
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "launching-and-directory",
    title: "Launching & Directory",
    description:
      "Everything about listing your developer tools, product showcases, community voting, and the tech stack graph.",
    // badge: "9 Questions",
    headerThemeKey: "launching",
    badgeClass:
      "border-rose-200 bg-rose-50/80 text-rose-700 font-mono text-[10px] font-bold tracking-wider uppercase",
    items: [
      {
        question: `What is ${SITE_CONFIG.name}?`,
        answer: `${SITE_CONFIG.name} (${SITE_CONFIG.domain}) is a curated discovery directory and tech-stack database for developer tools, APIs, infrastructure services, and developer-built products. It enables software engineers, tech leads, and indie founders to discover production-ready tooling, inspect real-world architecture blueprints, and track trending developer products through verified community rankings.`,
      },
      {
        question: `Who is ${SITE_CONFIG.name} built for?`,
        answer: `${SITE_CONFIG.name} is built for software engineers, technical founders, devtools creators, and autonomous AI agents. Developers use the platform to evaluate curated libraries, discover modern infrastructure, and explore architectural dependencies. Creators use it to launch their products, earn high-authority organic backlinks, and gain discoverability across both search engines and AI assistants.`,
      },
      {
        question: `How is ${SITE_CONFIG.name} different from Product Hunt or other launch platforms?`,
        answer: `Unlike generic launch directories where listings fade after a 24-hour voting cycle, ${SITE_CONFIG.name} is engineered specifically for software developers and perpetual discovery. Every listing receives permanent indexing, bidirectional cross-discovery through our "Built With" tech-stack graph, automated inclusion in machine-readable /llms.txt and MCP server feeds, and algorithmic ranking based on continuous utility rather than temporary upvote spikes.`,
      },
      {
        question: `What is the difference between a Tool and a Product on ${SITE_CONFIG.name}?`,
        answer: `"Tools" are foundational building blocks, libraries, databases, dev utilities, and APIs that developers build with (such as Supabase, Stripe, Docker, Neon, and Prisma). "Products" are end-user software applications, SaaS products, desktop utilities, and indie apps built by developers using those underlying tools. This distinction forms our relational ecosystem, allowing users to discover products by their tech stack and vice versa.`,
      },
      {
        question: `How do I submit my developer tool or product?`,
        answer: `Submitting is simple: sign in using your GitHub or Google account, then navigate to ${ROUTES.SUBMIT} for developer tools or ${ROUTES.SHOWCASE} for products. Fill in your project name, tagline, website URL, description, pricing model, supported platforms, and optional AEO/SEO metadata. Once submitted, our moderation team reviews it for authenticity and technical relevance.`,
      },
      {
        question: `Is listing on ${SITE_CONFIG.name} free?`,
        answer: `Yes, listing on ${SITE_CONFIG.name} is 100% free for open-source projects, indie hackers, and developer tool companies. Every approved tool or product receives full directory indexing, structured schema markup, and inclusion in AI crawler feeds. As part of our launch promotion, new submissions also receive free lifetime Verified Premium upgrades with Do-Follow backlinks.`,
      },
      {
        question: `How does the community ranking and voting system work?`,
        answer: `Rankings across ${SITE_CONFIG.name} are transparent, verified, and community-driven across four core views:\n\n• Homepage: Features "Today's Launches" and "This Week's Launches", ranked strictly by live community votes (upvotes for developer tools, likes for products, with comment count as a tie-breaker). We do not have a separate "New & Rising" section or page—every new launch enters the live feed immediately and ranks purely on genuine community support. The homepage also highlights "Popular Building Blocks" (the most-used tools across verified projects).\n• Trending Page (/trending): An algorithmic momentum leaderboard that measures velocity by weighting community engagement (upvotes and likes) alongside page views with time decay across selectable timeframes (Today, This Week, This Month, and All Time), with category filtering.\n• Tools Directory (/tools): The comprehensive developer infrastructure catalog, filterable by category and pricing model (Free, Freemium, Paid, Open Source), and sortable by "Upvoted" (community upvotes) and "Most Builds" (number of live products built with the tool).\n• Products Directory (/products): The showcase of developer-built applications with declared tech stacks, filterable by category and pricing model, and sortable by "Upvoted" (community likes) and "Most Viewed" (total page views).\n\nTo preserve community integrity, voting requires verified GitHub or Google authentication to eliminate bots, duplicate voting, and artificial manipulation.`,
      },

      {
        question: `What is the "Built With" tech stack graph and how does it work?`,
        answer: `The "Built With" tech stack graph maps the exact architectural components powering modern software products. When submitting a product, makers tag the developer tools, databases, and APIs used to build it. This establishes two-way discovery: product pages display an interactive tech stack blueprint, while tool pages showcase all live applications built with their software.`,
      },
      {
        question: `How long does it take for my listing to go live?`,
        answer: `Our moderation team reviews every submission to ensure verified URLs, correct developer categorization, and accurate technical descriptions. Most submissions are reviewed and approved within 12 to 24 hours. Once approved, your listing goes live immediately across directory feeds, search indexes, and AI assistant feeds.`,
      },
    ],
  },
  {
    id: "sponsorship-and-visibility",
    title: "Sponsorship & Visibility",
    description:
      "Advertising placements, partner sponsorships, high-authority backlinks, and promotional packages.",
    // badge: "5 Questions",
    headerThemeKey: "sponsorship",
    badgeClass:
      "border-amber-200 bg-amber-50/80 text-amber-700 font-mono text-[10px] font-bold tracking-wider uppercase",
    items: [
      {
        question: `What sponsorship and promotion options are available?`,
        answer: `${SITE_CONFIG.name} offers high-impact sponsorship packages including persistent sidebar advertising rails across desktop and tablet views, featured category spotlight cards, top-of-feed promotional banners, and dedicated showcase highlights. All placements are designed to engage high-intent software engineers and technical decision-makers.`,
      },
      {
        question: `Where do sponsored placements appear on the site?`,
        answer: `Sponsored units appear in prime viewing locations: the persistent navigation sidebar visible across all directory browsing pages, tool detail pages, product showcase profiles, and category-filtered views. This guarantees continuous visibility without disrupting developer browsing experiences.`,
      },
      {
        question: `What is included in a sponsored listing?`,
        answer: `A sponsored listing includes your brand logo, custom headline, value proposition copy, verified sponsor badge, direct link with custom UTM parameters, category-specific targeting, and a permanent Do-Follow SEO backlink from our high-authority developer platform.`,
      },
      {
        question: `Do sponsored listings include a dofollow backlink?`,
        answer: `Yes. All verified sponsorships and premium featured placements include direct, permanent Do-Follow backlinks. These pass search engine authority and improve organic search rankings for your domain alongside direct referral traffic from engineers.`,
      },
      {
        question: `How do I reserve a sponsorship slot?`,
        answer: `Sponsorship slots are booked on a weekly or monthly basis with category exclusivity options. You can review current placement options on our Pricing page (${ROUTES.PRICING}) and reserve a slot by direct messaging our founder on X (${SITE_CONFIG.socials.x}) or contacting our team at support@launchnests.com.`,
      },
    ],
  },
  {
    id: "seo-and-ai-discoverability",
    title: "SEO & AI Discoverability",
    description:
      "Answer Engine Optimization (AEO), LLM citation indexing, search crawlers, and structured schema.",
    // badge: "6 Questions",
    headerThemeKey: "seo",
    badgeClass:
      "border-indigo-200 bg-indigo-50/80 text-indigo-700 font-mono text-[10px] font-bold tracking-wider uppercase",
    items: [
      {
        question: `How does listing on ${SITE_CONFIG.name} improve my tool's SEO?`,
        answer: `${SITE_CONFIG.name} provides high-domain-authority directory indexing, Server-Side Rendered (SSR) HTML for lightning-fast crawling, automated favicon and metadata extraction, and contextual Do-Follow links within technical content. Our optimized directory taxonomy creates strong internal linking signals that boost your organic search footprint on Google and Bing.`,
      },
      {
        question: `Will my tool appear when someone asks ChatGPT, Claude, or Perplexity for recommendations?`,
        answer: `Yes. ${SITE_CONFIG.name} is engineered from the ground up for generative AI citation. When users prompt ChatGPT, Claude, Perplexity, or Gemini for tool recommendations in your category, these answer engines retrieve structured information directly from our /llms.txt, /llms-full.txt, and markdown endpoints, making your tool far more likely to be cited.`,
      },
      {
        question: `What is AEO (Answer Engine Optimization) and how does ${SITE_CONFIG.name} support it?`,
        answer: `AEO (Answer Engine Optimization) is the process of optimizing web content for synthetic answer generation rather than traditional ten blue links. ${SITE_CONFIG.name} collects structured problem statements, technical solutions, unique value propositions, and AI context prompts during submission, formatting them into semantic markup that LLMs easily digest and synthesize.`,
      },
      {
        question: `How does ${SITE_CONFIG.name} make tool pages readable by AI models?`,
        answer: `Every page on ${SITE_CONFIG.name} is dual-rendered: human users experience a modern, responsive web application, while AI bots and crawlers can consume clean, lightweight Markdown (.md), structured Schema.org JSON-LD, and raw text endpoints without parsing JavaScript bundles or bloated DOM trees.`,
      },
      {
        question: `How long does it take for my listing to be indexed by AI assistants?`,
        answer: `Autonomous web crawlers from OpenAI (GPTBot, SearchGPT), Anthropic (ClaudeBot), and PerplexityBot continuously ingest ${SITE_CONFIG.name}'s /llms.txt and sitemaps. Listings typically begin appearing in AI answer engine retrieval passes within 24 to 72 hours of approval.`,
      },
      {
        question: `What structured data and schema markup does ${SITE_CONFIG.name} use?`,
        answer: `${SITE_CONFIG.name} embeds rich Schema.org JSON-LD on every page, including SoftwareApplication for tools, WebSite with SearchAction, CollectionPage and ItemList for directory feeds, BreadcrumbList for hierarchical navigation, and FAQPage schema for direct question answering in Google rich snippets.`,
      },
    ],
  },
  {
    id: "for-ai-agents-and-developers",
    title: "For AI Agents & Developers",
    description:
      "Public APIs, MCP server endpoints, llms.txt specifications, and agent-friendly machine data feeds.",
    // badge: "5 Questions",
    headerThemeKey: "agents",
    badgeClass:
      "border-emerald-200 bg-emerald-50/80 text-emerald-700 font-mono text-[10px] font-bold tracking-wider uppercase",
    items: [
      {
        question: `Does ${SITE_CONFIG.name} have a public API?`,
        answer: `Yes. ${SITE_CONFIG.name} provides an open, read-only REST API v1 accessible at /v1. Endpoints include /v1/tools, /v1/products, /v1/makers, /v1/leaderboard, and /v1/search. Complete interactive API documentation and OpenAPI 3.1 definitions are available at /openapi.json.`,
      },
      {
        question: `Does ${SITE_CONFIG.name} have an MCP server?`,
        answer: `Yes. ${SITE_CONFIG.name} runs a production Model Context Protocol (MCP) server over Streamable HTTP at /api/mcp. It exposes 8 specialized tools—including search_tools, search_products, get_tool, get_product, get_leaderboard, get_maker_profile, get_daily_launches, and get_weekly_launches—for direct integration into Cursor, Claude Desktop, and Windsurf.`,
      },
      {
        question: `What is llms.txt and where can agents find it?`,
        answer: `/llms.txt is an open standard file located at the root of our website (${SITE_CONFIG.url}/llms.txt) that provides LLMs with a clean, curated summary of the site's developer resources. ${SITE_CONFIG.name} also provides /llms-full.txt containing in-depth technical specifications, categorizations, and listings for deep model context windows.`,
      },
      {
        question: `How can AI agents or crawlers access ${SITE_CONFIG.name} data without scraping?`,
        answer: `AI agents can retrieve ${SITE_CONFIG.name} data cleanly and without brittle scraping by querying our /api/mcp server, requesting structured JSON from /v1 REST endpoints, reading /llms.txt, or appending .md to documentation routes (e.g. /mcp.md, /auth.md, /cli.md). All agent endpoints are free and rate-limited for high reliability.`,
      },
      {
        question: `What markdown and machine-readable formats does ${SITE_CONFIG.name} support?`,
        answer: `${SITE_CONFIG.name} natively supports Schema.org JSON-LD, OpenAPI 3.1 JSON specifications, Model Context Protocol (JSON-RPC streamable HTTP), raw GitHub-flavored Markdown endpoints (.md), /llms.txt and /llms-full.txt files, and standard XML sitemaps and RSS feeds.`,
      },
    ],
  },
]

export const LAUNCHNESTS_FAQS: FaqItem[] = FAQ_CATEGORIES.flatMap(
  (category) => category.items
)
