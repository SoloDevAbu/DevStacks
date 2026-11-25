import { GUIDE_SLUGS } from "@/constants/guides/slugs"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { Guide } from "@/types/guides"

export const AI_RECOMMENDATIONS_GUIDE: Guide = {
  slug: GUIDE_SLUGS.AI_RECOMMENDATIONS,
  title: "How to Get Your Product Recommended by ChatGPT, Claude and Perplexity",
  metaTitle: "How to Get Your Product Recommended by ChatGPT & Perplexity",
  description:
    "AI assistants recommend products they can crawl, understand and see mentioned elsewhere. A practical, step-by-step playbook for SaaS, AI and developer tools.",
  publishedOn: "2026-11-24",
  updatedOn: "2026-11-24",
  keywords: [
    "how to rank in chatgpt",
    "chatgpt seo",
    "get recommended by chatgpt",
    "llm seo",
    "how to get mentioned by ai",
    "perplexity seo",
    "ai search visibility",
  ],
  keyTakeaways: [
    "Assistants with live search pick products from pages they retrieve, so your pages must be crawlable by their bots and rank in the indexes they use.",
    "Most recommendations come from third-party pages, such as comparisons, directories, reviews and community threads, not from a product's own site.",
    "State what the product is, who it is for, what it costs and what it replaces in plain sentences near the top of the page; that is the text models quote.",
    "Measure it: ask the assistants your buyers' questions every month and log whether you appear and which source they cite.",
  ],
  sections: [
    {
      heading: "How AI assistants choose which products to recommend",
      body: `When someone asks "what is the best tool for X", an assistant answers from two places:

- **What the model learned in training.** Well-known products are recommended from memory. A new product is not in it, and won't be until a later model is trained.
- **What it retrieves right now.** ChatGPT search, Perplexity, Claude with web search and Google AI Overviews run a search, read the top pages, and summarise them with citations.

For a product launched this year, **retrieval is the only door in**. Your goal is to be on the pages the assistant retrieves, described clearly enough that it can repeat the description.`,
    },
    {
      heading: "Step 1: Let AI crawlers read your site",
      body: `Each assistant uses its own user agents. Blocking them in \`robots.txt\`, or behind a bot-protection rule, removes you from their answers.

| Company | Search / answer bot | Training bot |
|---|---|---|
| OpenAI | OAI-SearchBot, ChatGPT-User | GPTBot |
| Anthropic | Claude-SearchBot, Claude-User | ClaudeBot |
| Perplexity | PerplexityBot, Perplexity-User | n/a |
| Google | Googlebot (AI Overviews use the Search index) | Google-Extended (Gemini training only) |

You can block training bots and still allow search bots. Also make sure your main content is in the HTML response, not only rendered by client-side JavaScript; several of these bots do not run scripts.`,
    },
    {
      heading: "Step 2: Write pages a model can quote",
      body: `Models lift sentences, so write the sentences you want lifted.

- **Open with a definition.** "Acme is an open-source feature-flag service for Next.js teams, free to self-host, with a paid cloud plan from $20/month." One sentence answers what, who, and how much.
- **Name what you replace.** Assistants answer "alternatives to X" questions constantly. Say "an alternative to LaunchDarkly" in plain text.
- **Put facts in tables and lists.** Pricing tiers, limits, integrations and platforms are extracted far more reliably from a table than from a paragraph.
- **Add an FAQ with real questions**, such as "Is Acme free?", "Does Acme work with Vercel?", each answered in its first sentence.
- **Date your facts.** "Pricing checked on 24 November 2026" makes a page a safer source to cite.`,
    },
    {
      heading: "Step 3: Get mentioned on the pages assistants retrieve",
      body: `Search "best [your category] tools" and "[competitor] alternatives" in ChatGPT and Perplexity and look at the cited sources. They are usually:

- **comparison and alternatives pages** on directories and review sites;
- **launch directories and product listings**, which give a crawlable page with a name, description, category and link;
- **community threads** on Reddit, Hacker News and niche forums;
- **docs and tutorials** that mention your product as a building block.

Getting onto these pages is the AI-era equivalent of link building. A listing on ${SITE_CONFIG.name}, for example, creates an indexed product page, a markdown version for agents, an entry in the site's [llms.txt](${ROUTES.LLMS_TXT}), and a place on the category and built-with pages that cover your stack.`,
    },
    {
      heading: "Step 4: Make your product machine-readable",
      body: `Beyond the page text:

- add **SoftwareApplication** structured data with name, category, operating system and offers;
- keep your name, one-line description and category **identical** everywhere you are listed, so the entity looks consistent;
- publish an [llms.txt file](${ROUTES.GUIDE(GUIDE_SLUGS.LLMS_TXT)}) and markdown versions of your docs for agents that read them;
- if you have an API, publish an OpenAPI spec and consider an MCP server so agents can use the product, not just describe it.`,
    },
    {
      heading: "Step 5: Measure whether it is working",
      body: `There is no "AI Search Console" yet, so measure by hand:

1. Write 10 to 20 questions your buyers ask, such as "best open source X", "X alternative for small teams", or "is there a free tool that does Y".
2. Ask them in ChatGPT (with search), Perplexity, Claude and Google every month.
3. Record whether you are mentioned, the position, and the cited source.
4. Check referral traffic from chatgpt.com, perplexity.ai and claude.ai in your analytics.

When a competitor is cited and you are not, open the cited page. That page is your next target: get listed on it, or publish a better version of it.`,
    },
  ],
  faqs: [
    {
      question: "How long does it take for ChatGPT to recommend a new product?",
      answer:
        "Through live search it can happen within days of your pages being indexed and mentioned on sources it retrieves. Appearing in answers without search depends on future model training, which can take many months.",
    },
    {
      question: "Can I pay to be recommended by ChatGPT?",
      answer:
        "Organic AI answers are not sold. What you can do is be present on the third-party pages the assistants retrieve and cite, and make your own pages easy to quote.",
    },
    {
      question: "Does blocking GPTBot stop ChatGPT from recommending me?",
      answer:
        "Blocking GPTBot stops training crawls. ChatGPT search uses OAI-SearchBot and ChatGPT-User, so allow those if you want to appear in search-based answers.",
    },
    {
      question: "Is AI SEO different from normal SEO?",
      answer:
        "It builds on it. Crawlability, indexing and links still matter; AI answers add a premium on clear factual sentences, structured comparisons and mentions on third-party pages.",
    },
  ],
  relatedLinks: [
    {
      label: "Generative engine optimization",
      href: ROUTES.GLOSSARY_TERM("generative-engine-optimization"),
    },
    { label: "AI citation", href: ROUTES.GLOSSARY_TERM("ai-citation") },
    { label: "AI crawler", href: ROUTES.GLOSSARY_TERM("ai-crawler") },
    {
      label: "AI readiness checker",
      href: ROUTES.FREE_TOOL("ai-readiness-checker"),
    },
    { label: "Launch your product", href: ROUTES.SUBMIT },
  ],
}
