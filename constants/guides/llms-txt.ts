import { GUIDE_SLUGS } from "@/constants/guides/slugs"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { Guide } from "@/types/guides"

export const LLMS_TXT_GUIDE: Guide = {
  slug: GUIDE_SLUGS.LLMS_TXT,
  title: "What Is llms.txt? Format, Examples and Whether You Need One",
  metaTitle: "What Is llms.txt? Format, Examples & Should You Create One",
  description:
    "llms.txt is a markdown file at your site root that gives AI assistants a curated map of your most useful pages. Here is the format, a real example and an honest take on what it does.",
  publishedOn: "2026-11-24",
  updatedOn: "2026-11-24",
  keywords: [
    "llms.txt",
    "what is llms.txt",
    "llms.txt file",
    "llms.txt example",
    "llms.txt format",
    "should i create an llms.txt file",
    "llms-full.txt",
  ],
  keyTakeaways: [
    "llms.txt is a plain markdown file served at /llms.txt that lists a site's most useful pages for language models, with a one-line note per link.",
    "It was proposed in September 2024 at llmstxt.org. It is a convention, not a standard, and no major search engine has said it uses the file for ranking.",
    "It is cheap to publish and helps agents and coding assistants that fetch it directly, so most product sites should add one, but it does not replace crawlable HTML.",
    "The format is: one H1 with the site name, a blockquote summary, optional prose, then H2 sections of markdown link lists.",
  ],
  sections: [
    {
      heading: "What llms.txt is",
      body: `**llms.txt is a markdown file at the root of a website that tells large language models which pages matter and what each one contains.** Where \`robots.txt\` says what a crawler may fetch and \`sitemap.xml\` lists every URL, \`llms.txt\` is a short, hand-picked reading list written for a model with a limited context window.

The idea was proposed in September 2024 on llmstxt.org. The reasoning is simple: HTML pages carry navigation, scripts and layout that waste tokens, so a site can point models at a compact summary and at clean markdown versions of its key pages instead.`,
    },
    {
      heading: "The llms.txt format",
      body: `The file is ordinary markdown with a fixed order:

1. **An H1** with the name of the project or site. This is the only required part.
2. **A blockquote** with a one or two sentence summary.
3. **Optional paragraphs or lists** with context a model should know before reading further.
4. **H2 sections**, each holding a markdown list of links. Every item is \`- [Title](url): what the page covers\`.
5. An optional section named **Optional** for links a model can skip when it is short on context.

A minimal file looks like this:

\`\`\`markdown
# Acme Analytics

> Privacy-first product analytics for SaaS teams. Self-hostable, with a free cloud tier.

## Docs
- [Quickstart](https://acme.dev/docs/quickstart.md): install the SDK and send a first event
- [API reference](https://acme.dev/docs/api.md): every endpoint with request and response examples

## Product
- [Pricing](https://acme.dev/pricing.md): plans, limits and what the free tier includes

## Optional
- [Changelog](https://acme.dev/changelog.md): release notes since 2023
\`\`\`

Many sites also publish **llms-full.txt**, a single file with the full text of the important pages, so an agent can load everything in one request.`,
    },
    {
      heading: "A real example: the LaunchNests llms.txt",
      body: `${SITE_CONFIG.name} publishes both files. [/llms.txt](${ROUTES.LLMS_TXT}) lists this week's launches, earlier launch weeks, categories, comparisons, curated alternatives and the glossary, each with a one-line description and a link to its markdown version. [/llms-full.txt](${ROUTES.LLMS_FULL_TXT}) carries the longer descriptions.

Two details make the files more useful than a copied sitemap:

- **Every link points at a markdown twin** (for example \`/tools/supabase.md\`), so the model reads clean text instead of rendered HTML.
- **The files are regenerated hourly** from the database, so a product launched this morning is in the file the same day.

Both files are served with \`X-Robots-Tag: noindex\` so they never compete with the real pages in Google.`,
    },
    {
      heading: "Does llms.txt actually help? An honest answer",
      body: `It depends on who reads it.

- **Search engines:** Google has said publicly that it does not use llms.txt for Search or AI Overviews. Treat it as having no direct ranking effect.
- **AI assistants browsing the web:** ChatGPT, Claude and Perplexity fetch pages when they answer with live search. None has committed to reading llms.txt first, so you cannot count on it being used.
- **Agents and coding tools:** this is where it pays off today. Developer agents, IDE assistants and MCP clients often fetch \`/llms.txt\` or a docs page's \`.md\` version on purpose, because it is the cheapest way to load accurate context.

So llms.txt is low effort and has a real but narrow benefit. What still decides whether AI engines mention you is the content they can crawl, and whether other trusted sites mention you too.`,
    },
    {
      heading: "Should you create an llms.txt file?",
      body: `**Yes, if you have docs, an API, or more than a handful of pages a model would need to understand your product.** It takes under an hour and has no downside when you keep it accurate.

Skip it, or keep it to a few lines, if your site is a single landing page. A model can read that page directly.

A good llms.txt:

- links to pages that answer real questions: pricing, docs, comparisons, changelog;
- writes each description as a plain fact, not marketing copy;
- links to markdown versions of pages where you have them;
- is regenerated when content changes, rather than hand-edited once and left stale.`,
    },
    {
      heading: "How to check your site is ready for AI agents",
      body: `llms.txt is one of several signals. Also check that AI crawlers are allowed in \`robots.txt\`, that key pages render their main content without JavaScript, and that your pages carry structured data.

The free [AI readiness checker](${ROUTES.FREE_TOOL("ai-readiness-checker")}) tests a URL for these in one pass. When you launch on ${SITE_CONFIG.name}, your listing gets its own markdown twin and appears in the site's llms.txt the same day.`,
    },
  ],
  faqs: [
    {
      question: "Where do I put the llms.txt file?",
      answer:
        "At the root of your domain, so it loads at https://yourdomain.com/llms.txt, served as plain text or markdown. Subpaths such as /docs/llms.txt are also used for documentation sites.",
    },
    {
      question: "Is llms.txt the same as robots.txt?",
      answer:
        "No. robots.txt controls which URLs crawlers may fetch. llms.txt does not block or allow anything; it is a curated guide to the pages a language model should read.",
    },
    {
      question: "Does Google use llms.txt?",
      answer:
        "Google has said it does not use llms.txt for Search or AI Overviews. The file mainly helps agents and assistants that choose to fetch it directly.",
    },
    {
      question: "What is the difference between llms.txt and llms-full.txt?",
      answer:
        "llms.txt is a short index of links with descriptions. llms-full.txt is an optional companion that includes the full text of those pages in one file.",
    },
  ],
  relatedLinks: [
    { label: "llms.txt glossary entry", href: ROUTES.GLOSSARY_TERM("llms-txt") },
    {
      label: "AI readiness checker",
      href: ROUTES.FREE_TOOL("ai-readiness-checker"),
    },
    { label: "LaunchNests llms.txt", href: ROUTES.LLMS_TXT },
    { label: "Launch your product", href: ROUTES.SUBMIT },
  ],
}
