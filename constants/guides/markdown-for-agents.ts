import { GUIDE_SLUGS } from "@/constants/guides/slugs"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { Guide } from "@/types/guides"

export const MARKDOWN_FOR_AGENTS_GUIDE: Guide = {
  slug: GUIDE_SLUGS.MARKDOWN_FOR_AGENTS,
  title: "Markdown for AI Agents: Serving text/markdown Pages in Next.js",
  metaTitle: "Markdown for AI Agents: Serve text/markdown in Next.js",
  description:
    "How LaunchNests serves a markdown twin of every page to AI agents with content negotiation, .md URLs and Link headers in Next.js, without hurting SEO.",
  publishedOn: "2026-11-24",
  updatedOn: "2026-11-24",
  keywords: [
    "markdown for ai agents",
    "markdown for llms",
    "text/markdown content negotiation",
    "nextjs markdown route",
    "serve markdown to ai",
    "accept text/markdown",
  ],
  keyTakeaways: [
    "A markdown twin is a clean-text version of an HTML page that an agent can read at a fraction of the tokens.",
    "Serve it at the same URL for requests with Accept: text/markdown, and at a .md URL for tools that cannot set headers.",
    "Advertise it with a Link rel=alternate header and Vary: Accept so caches keep the two versions apart.",
    "Mark the markdown response noindex and point Content-Location at the HTML page so search engines never treat it as duplicate content.",
  ],
  sections: [
    {
      heading: "Why serve markdown to AI agents",
      body: `An HTML product page is mostly layout, navigation, scripts and repeated chrome. An agent that only needs the product's description, pricing and FAQs spends most of its context window on noise, and sometimes gets the facts wrong because of it.

A **markdown twin** fixes that: the same facts as the page, in plain headings, lists and tables. On ${SITE_CONFIG.name} a listing's markdown version is typically under a tenth of the size of its HTML. Coding assistants, MCP clients and research agents increasingly ask for markdown directly, which is why documentation sites started publishing \`.md\` versions of every page.`,
    },
    {
      heading: "The three ways an agent can ask for markdown",
      body: `Support all three. Different clients use different ones.

1. **Content negotiation**: the client sends \`Accept: text/markdown\` to the normal URL and gets markdown back.
2. **A .md URL**: \`/tools/supabase.md\` next to \`/tools/supabase\`. This works for any client, including ones that cannot set headers, and is easy to put in llms.txt.
3. **Discovery headers**: the HTML response carries \`Link: </tools/supabase.md>; rel="alternate"; type="text/markdown"\`, so a client that fetched HTML first learns where the cleaner version lives.`,
    },
    {
      heading: "Implementation in Next.js middleware",
      body: `${SITE_CONFIG.name} keeps one table of routes that have a twin, shared by the negotiation logic and the Link header, so they can never disagree:

\`\`\`ts
// constants/markdown-twins.ts
export const MARKDOWN_TWIN_ROUTES = [
  {
    pattern: /^\\/(tools|products|blog|makers)\\/([^/.]+)$/,
    twin: ([, section, slug]) => \`/api/md/\${section}/\${slug}\`,
    alias: ([, section, slug]) => \`/\${section}/\${slug}.md\`,
  },
]
\`\`\`

The middleware then does two things:

\`\`\`ts
// middleware.ts (simplified)
const wantsMarkdown = (req: NextRequest) =>
  /text\\/(x-)?markdown/.test(req.headers.get("accept") ?? "")

export const middleware = (req: NextRequest) => {
  const twin = findTwin(MARKDOWN_TWIN_ROUTES, req.nextUrl.pathname)
  if (twin && wantsMarkdown(req)) {
    return NextResponse.rewrite(new URL(twin.path, req.url))
  }
  const res = NextResponse.next()
  if (twin) {
    res.headers.set("Link", \`<\${twin.alias}>; rel="alternate"; type="text/markdown"\`)
    res.headers.append("Vary", "Accept")
  }
  return res
}
\`\`\`

The markdown itself comes from ordinary route handlers under \`/api/md/...\` that read the same database queries as the page and return a string.`,
    },
    {
      heading: "Response headers that keep SEO safe",
      body: `The markdown response is a second representation of the same page, so tell search engines which one is canonical:

| Header | Value | Why |
|---|---|---|
| \`Content-Type\` | \`text/markdown; charset=utf-8\` | Clients recognise the format |
| \`Content-Location\` | the HTML page's canonical URL | Ties the twin to its page |
| \`X-Robots-Tag\` | \`noindex, follow\` | Keeps the twin out of search results |
| \`Vary\` | \`Accept\` | CDNs cache HTML and markdown separately |
| \`Cache-Control\` | a normal public TTL | Twins are cheap to serve at the edge |

Without \`Vary: Accept\` a CDN can serve markdown to a browser, or HTML to an agent, depending on who asked first.`,
    },
    {
      heading: "What to put in a markdown twin",
      body: `Keep the facts and drop the chrome:

- an H1 with the page subject and a one-sentence summary in a blockquote;
- a small YAML or list block of key fields such as category, pricing, platforms, URL and last-updated date;
- the main description, features, FAQs and comparison tables;
- links to related pages, as absolute URLs, pointing at their own \`.md\` versions where possible.

Then list the twins in [llms.txt](${ROUTES.GUIDE(GUIDE_SLUGS.LLMS_TXT)}) so agents can find them without crawling.`,
    },
    {
      heading: "Try it on LaunchNests",
      body: `Every product, tool, alternatives, glossary and launch-week page on ${SITE_CONFIG.name} has a twin. Fetch one with:

\`\`\`bash
curl -H "Accept: text/markdown" ${SITE_CONFIG.url}${ROUTES.ALTERNATIVES("docker")}
\`\`\`

When you [launch a product](${ROUTES.SUBMIT}) here, its listing gets the same treatment automatically.`,
    },
  ],
  faqs: [
    {
      question: "Will markdown versions of my pages cause duplicate content?",
      answer:
        "Not if the markdown response sends X-Robots-Tag: noindex and a Content-Location header pointing at the HTML page. Search engines then index only the HTML version.",
    },
    {
      question: "Should I use Accept headers or .md URLs?",
      answer:
        "Both. Content negotiation keeps one URL per page for capable clients; .md URLs work for every client and are easy to list in llms.txt.",
    },
    {
      question: "Do ChatGPT and Claude request text/markdown?",
      answer:
        "Behaviour varies by client and changes often. Coding agents and MCP-based tools are the most likely to request markdown or .md URLs today, which is why supporting all three methods is safest.",
    },
  ],
  relatedLinks: [
    { label: "What is llms.txt?", href: ROUTES.GUIDE(GUIDE_SLUGS.LLMS_TXT) },
    {
      label: "Model Context Protocol",
      href: ROUTES.GLOSSARY_TERM("model-context-protocol"),
    },
    { label: "LaunchNests MCP server", href: ROUTES.MCP },
    { label: "Canonical URL", href: ROUTES.GLOSSARY_TERM("canonical-url") },
  ],
}
