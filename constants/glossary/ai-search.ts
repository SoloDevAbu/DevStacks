import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { GlossaryTerm } from "@/types/glossary"

export const AI_SEARCH_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "llms-txt",
    term: "llms.txt",
    aliases: ["llms.txt file", "llms-full.txt"],
    category: "ai-search",
    shortDefinition:
      "llms.txt is a proposed standard: a Markdown file at a site's root that gives large language models a concise, curated map of the site's most useful content.",
    definition: [
      "Proposed by Jeremy Howard of Answer.AI in September 2024, /llms.txt starts with the site name and a short summary, followed by sections of links with one-line descriptions. A companion /llms-full.txt often includes the full text in one file.",
      "It is a convention, not an official web standard, and support varies by AI provider. It is cheap to add and gives AI tools and agents a clean entry point instead of parsing navigation-heavy HTML.",
    ],
    whyItMatters: [
      "It gives AI assistants and coding agents a short, accurate summary of what a site offers.",
      "Pointing to Markdown versions of pages saves agents from parsing complex HTML.",
      "It is a low-effort part of making a site readable by AI systems.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} publishes /llms.txt and /llms-full.txt with trending launches, categories, guides, alternatives and comparisons, plus Markdown versions of listing pages.`,
    relatedTerms: [
      "generative-engine-optimization",
      "ai-crawler",
      "model-context-protocol",
    ],
    relatedLinks: [
      {
        label: "Free AI readiness checker",
        href: ROUTES.FREE_TOOL("ai-readiness-checker"),
      },
      { label: `${SITE_CONFIG.name} llms.txt`, href: ROUTES.LLMS_TXT },
      {
        label: `${SITE_CONFIG.name} llms-full.txt`,
        href: ROUTES.LLMS_FULL_TXT,
      },
    ],
    faqs: [
      {
        question: "Does Google use llms.txt?",
        answer:
          "Google has said it does not need llms.txt for Search. Its value is mainly for AI tools and agents that choose to read it.",
      },
      {
        question: "Is llms.txt the same as robots.txt?",
        answer:
          "No. robots.txt controls what crawlers may fetch; llms.txt is a guide that points AI tools to the most useful content.",
      },
    ],
  },
  {
    slug: "generative-engine-optimization",
    term: "Generative Engine Optimization (GEO)",
    aliases: ["GEO", "AI SEO", "LLM optimization"],
    category: "ai-search",
    shortDefinition:
      "Generative engine optimization is the practice of making content more likely to be used and cited in answers from AI systems such as ChatGPT, Perplexity, Gemini and Google AI Overviews.",
    definition: [
      "The term was popularised by a 2023 research paper that tested how content changes affected visibility in AI-generated answers. Additions such as citations, statistics and quotations made sources more likely to appear.",
      "GEO builds on SEO: AI search tools still retrieve pages from search indexes, so crawlable, well-structured pages with clear, specific facts are the foundation.",
    ],
    whyItMatters: [
      "More product research now starts in AI assistants instead of a list of links.",
      "Being cited in an answer can bring high-intent visitors even when overall clicks fall.",
      "Clear facts, comparisons and dates make content easier for models to quote accurately.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} pages state checked facts with dates, publish structured data and Markdown versions, and are listed in llms.txt so AI tools can cite launches accurately.`,
    relatedTerms: [
      "answer-engine-optimization",
      "ai-citation",
      "llms-txt",
      "structured-data",
    ],
    relatedLinks: [
      {
        label: "Free AI readiness checker",
        href: ROUTES.FREE_TOOL("ai-readiness-checker"),
      },
      { label: "Developer tool comparisons", href: ROUTES.COMPARE_HUB },
    ],
    faqs: [
      {
        question: "Is GEO different from SEO?",
        answer:
          "It extends SEO rather than replacing it. AI search still depends on crawlable, indexed pages, but GEO focuses on being quoted inside an answer rather than ranking as a link.",
      },
      {
        question: "How do you measure GEO?",
        answer:
          "Track whether AI assistants mention or cite your brand for your target questions, and watch referral traffic from AI tools in your analytics.",
      },
    ],
  },
  {
    slug: "answer-engine-optimization",
    term: "Answer Engine Optimization (AEO)",
    aliases: ["AEO"],
    category: "ai-search",
    shortDefinition:
      "Answer engine optimization means structuring content so search engines and AI assistants can lift it directly as the answer to a question.",
    definition: [
      "AEO started with featured snippets and voice assistants and now covers AI answers. It favours pages that answer a specific question clearly near the top, then add detail.",
      "Question-led headings, short direct answers, FAQ sections and tables are common AEO patterns.",
    ],
    whyItMatters: [
      "Direct answers are what featured snippets and AI tools extract.",
      "It aligns content with the real questions people search for.",
      "Clear answers also help human readers who skim.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} glossary, comparison and alternatives pages open with a direct one-sentence answer and end with FAQs built from the same checked facts.`,
    relatedTerms: [
      "generative-engine-optimization",
      "ai-overviews",
      "structured-data",
    ],
    relatedLinks: [{ label: `${SITE_CONFIG.name} FAQ`, href: ROUTES.FAQ }],
    faqs: [
      {
        question: "What is the difference between AEO and GEO?",
        answer:
          "They overlap heavily. AEO focuses on being the direct answer to a question; GEO focuses on being used and cited by generative AI systems.",
      },
      {
        question: "Do FAQ sections still help?",
        answer:
          "Google shows FAQ rich results for very few sites now, but clear question-and-answer content still helps readers and AI tools that extract answers.",
      },
    ],
  },
  {
    slug: "ai-overviews",
    term: "AI Overviews",
    plural: true,
    aliases: ["Google AI Overviews", "SGE", "Search Generative Experience"],
    category: "ai-search",
    shortDefinition:
      "AI Overviews are AI-generated summaries that Google shows at the top of some search results, with links to the sources they draw on.",
    definition: [
      "Google tested the feature as the Search Generative Experience and launched it as AI Overviews in the US in May 2024, later expanding to many more countries and languages.",
      "Overviews appear mostly for informational and comparison queries. They can reduce clicks to individual results, while the pages linked inside the overview can gain visibility.",
    ],
    whyItMatters: [
      "They change click-through rates for informational queries even when rankings stay the same.",
      "Pages cited in an overview get prominent placement above the regular results.",
      "Pages that rank well in normal results are more likely to be cited.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} comparison pages answer \"X vs Y\" questions with a short verdict and a fact table, the format AI summaries tend to draw from.`,
    relatedTerms: [
      "click-through-rate",
      "generative-engine-optimization",
      "ai-citation",
    ],
    relatedLinks: [
      { label: "Developer tool comparisons", href: ROUTES.COMPARE_HUB },
    ],
    faqs: [
      {
        question: "Can you opt out of AI Overviews?",
        answer:
          "Only partly. The nosnippet and max-snippet controls limit what Google can show, but they also limit regular snippets.",
      },
      {
        question: "How do you get cited in AI Overviews?",
        answer:
          "There is no separate submission. Rank well for the query, answer it clearly and back claims with specific, checkable facts.",
      },
    ],
  },
  {
    slug: "ai-citation",
    term: "AI Citation",
    article: "an",
    aliases: ["LLM citation", "AI mention"],
    category: "ai-search",
    shortDefinition:
      "An AI citation is a link or reference to a source shown alongside an AI-generated answer, such as in ChatGPT search, Perplexity or Google AI Overviews.",
    definition: [
      "AI search tools retrieve web pages, write an answer and attach the sources they used. Being one of those sources is the AI-search equivalent of ranking on page one.",
      "Mentions without a link also matter: a model that has seen a brand described consistently across many sites is more likely to recommend it.",
    ],
    whyItMatters: [
      "Visitors from AI citations arrive already informed and often convert well.",
      "Citations build brand recognition even when the reader does not click.",
      "Consistent descriptions across directories and profiles help models describe a product correctly.",
    ],
    onLaunchNests: `A ${SITE_CONFIG.name} listing adds one more consistent, crawlable description of a product, available as HTML, Markdown and through the ${SITE_CONFIG.name} MCP server.`,
    relatedTerms: [
      "generative-engine-optimization",
      "ai-overviews",
      "llms-txt",
    ],
    relatedLinks: [
      { label: `${SITE_CONFIG.name} MCP server`, href: ROUTES.MCP },
    ],
    faqs: [
      {
        question:
          "Why does an AI assistant recommend competitors but not my product?",
        answer:
          "Usually because the product is mentioned on fewer pages the assistant can retrieve. More consistent listings, reviews and comparisons help.",
      },
      {
        question: "Can I track AI citations?",
        answer:
          "Partly. Check referral traffic from AI tools in analytics and regularly ask assistants your target questions to see which sources they cite.",
      },
    ],
  },
  {
    slug: "ai-crawler",
    term: "AI Crawler",
    article: "an",
    aliases: ["AI bot", "GPTBot", "ClaudeBot", "PerplexityBot"],
    category: "ai-search",
    shortDefinition:
      "An AI crawler is a bot run by an AI company to fetch web pages, either to train models or to retrieve pages live for AI search answers.",
    definition: [
      "Examples include OpenAI's GPTBot (training) and OAI-SearchBot (ChatGPT search), Anthropic's ClaudeBot, and PerplexityBot. Each publishes a user-agent that sites can allow or block in robots.txt.",
      "Training and search crawlers are often separate, so a site can block training while still allowing its pages to appear in AI search answers.",
    ],
    whyItMatters: [
      "Blocking AI search crawlers can remove a site from AI-generated answers.",
      "Many AI crawlers do not run JavaScript, so content rendered only on the client may be invisible to them.",
      "Server logs show which AI bots visit and which pages they fetch.",
    ],
    onLaunchNests: `${SITE_CONFIG.name}'s robots.txt explicitly allows the major AI crawlers and answer engines, and listing pages are server-rendered so bots that skip JavaScript still see the content.`,
    relatedTerms: ["robots-txt", "llms-txt", "crawl-budget"],
    relatedLinks: [
      {
        label: "Free AI readiness checker",
        href: ROUTES.FREE_TOOL("ai-readiness-checker"),
      },
      { label: `${SITE_CONFIG.name} llms.txt`, href: ROUTES.LLMS_TXT },
    ],
    faqs: [
      {
        question: "Should I block AI crawlers?",
        answer:
          "It depends on your goals. Blocking training crawlers keeps content out of future models; blocking search crawlers also removes you from AI answers that could send visitors.",
      },
      {
        question: "Do AI crawlers render JavaScript?",
        answer:
          "Many do not. Server-rendered HTML is the safest way to make content visible to them.",
      },
    ],
  },
  {
    slug: "robots-txt",
    term: "robots.txt",
    aliases: ["robots exclusion protocol"],
    category: "ai-search",
    shortDefinition:
      "robots.txt is a text file at a site's root that tells crawlers which paths they may and may not fetch.",
    definition: [
      "The file groups rules by user-agent, with Allow and Disallow lines and optional Sitemap lines. The Robots Exclusion Protocol was standardised as RFC 9309 in 2022.",
      "robots.txt controls crawling, not indexing. A blocked URL can still be indexed if other pages link to it; a noindex directive is needed to keep a crawlable page out of results.",
    ],
    whyItMatters: [
      "It keeps crawlers out of admin, checkout and filter URLs that waste crawl budget.",
      "It is where sites allow or block specific AI crawlers.",
      "A single wrong Disallow line can hide a whole site from search.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} blocks private areas such as the dashboard and checkout, and filter parameters, while allowing search engines and AI crawlers everywhere else.`,
    relatedTerms: ["ai-crawler", "xml-sitemap", "crawl-budget"],
    relatedLinks: [
      {
        label: "Free AI readiness checker",
        href: ROUTES.FREE_TOOL("ai-readiness-checker"),
      },
      { label: `${SITE_CONFIG.name} sitemap`, href: ROUTES.SITEMAP },
    ],
    faqs: [
      {
        question: "Does robots.txt stop a page from being indexed?",
        answer:
          "No. It stops crawling. Use a noindex meta tag or header on a crawlable page to keep it out of the index.",
      },
      {
        question: "Do all bots obey robots.txt?",
        answer:
          "Reputable search engines and most AI companies do. Malicious scrapers may ignore it, so it is not a security control.",
      },
    ],
  },
  {
    slug: "model-context-protocol",
    term: "Model Context Protocol (MCP)",
    article: "the",
    aliases: ["MCP", "MCP server"],
    category: "ai-search",
    shortDefinition:
      "The Model Context Protocol is an open standard that lets AI assistants connect to external tools and data sources through MCP servers.",
    definition: [
      "Anthropic introduced MCP in November 2024. An MCP server exposes tools, resources and prompts; an MCP client such as Claude, Cursor or another AI app connects to it and lets the model call those tools.",
      "For a website, an MCP server is a structured way for AI agents to query its data directly instead of scraping pages.",
    ],
    whyItMatters: [
      "AI agents can use a site's data accurately and in real time.",
      "One server works with any MCP-compatible client.",
      "It makes a product or dataset available inside the tools developers already use.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} runs a public MCP server that lets AI assistants search tools and products, read listings and fetch daily and weekly launch rankings.`,
    relatedTerms: ["llms-txt", "ai-citation", "api-client"],
    relatedLinks: [
      { label: `${SITE_CONFIG.name} MCP server`, href: ROUTES.MCP },
      { label: `${SITE_CONFIG.name} CLI`, href: ROUTES.CLI },
    ],
    faqs: [
      {
        question: "Is MCP only for Claude?",
        answer:
          "No. It is an open protocol supported by many AI clients and developer tools.",
      },
      {
        question: "What is the difference between an MCP server and an API?",
        answer:
          "An MCP server usually wraps an API, but describes its tools in a standard way that AI clients can discover and call without custom integration code.",
      },
    ],
  },
]
