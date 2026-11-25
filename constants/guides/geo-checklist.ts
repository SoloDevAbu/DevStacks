import { GUIDE_SLUGS } from "@/constants/guides/slugs"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { Guide } from "@/types/guides"

export const GEO_CHECKLIST_GUIDE: Guide = {
  slug: GUIDE_SLUGS.GEO_CHECKLIST,
  title:
    "Generative Engine Optimization (GEO) for SaaS and Developer Tools: A Practical Checklist",
  metaTitle: "Generative Engine Optimization Checklist for SaaS (GEO & AEO)",
  description:
    "A 20-point GEO and AEO checklist for SaaS, AI and developer tools: crawl access, answer-first pages, structured data, markdown for agents, and third-party mentions.",
  publishedOn: "2026-11-24",
  updatedOn: "2026-11-24",
  keywords: [
    "generative engine optimization",
    "generative engine optimization checklist",
    "answer engine optimization",
    "geo for saas",
    "ai search optimization",
    "aeo checklist",
  ],
  keyTakeaways: [
    "GEO (generative engine optimization) and AEO (answer engine optimization) both mean making your content easy for AI systems to retrieve, understand and cite.",
    "The work splits into four layers: access, page content, machine-readable data, and off-site mentions.",
    "Most SaaS sites fail on the basics first: AI bots blocked by a firewall rule, key copy rendered only by JavaScript, or no plain answer to 'what does this cost'.",
    "Off-site mentions on comparison pages, directories and communities decide most product recommendations.",
  ],
  sections: [
    {
      heading: "GEO and AEO in one paragraph",
      body: `**Generative engine optimization is the practice of shaping your content so AI answer engines, such as ChatGPT, Perplexity, Claude, Gemini and Google AI Overviews, retrieve it, understand it and cite it.** Answer engine optimization is the older name for the same idea, from the days of featured snippets and voice assistants. Classic SEO gets you ranked; GEO gets the sentence the AI writes to be about you, and ideally to link to you.`,
    },
    {
      heading: "Layer 1: Access (can the engines read you?)",
      body: `- [ ] AI search bots are allowed in \`robots.txt\`: OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot, and Googlebot for AI Overviews.
- [ ] Your CDN or WAF bot rules do not challenge those user agents. Check the firewall logs, not just robots.txt.
- [ ] The main content is in the server-rendered HTML. Fetch a page with \`curl\` and confirm the product description is there.
- [ ] Important pages are in your XML sitemap with honest \`lastmod\` dates.
- [ ] Pages return 200 quickly. Answer engines time out on slow pages more readily than Googlebot does.`,
    },
    {
      heading: "Layer 2: Page content (can they quote you?)",
      body: `- [ ] The first sentence on the homepage says what the product is, who it is for, and its price model.
- [ ] A pricing page states numbers in text, not only inside images or a calculator widget.
- [ ] Every key page answers its main question in the first 40 to 60 words, then expands.
- [ ] Comparison and "alternatives" content names competitors in plain text and says when each one is the better pick.
- [ ] Facts carry a date ("checked on …") and the page shows when it was last updated.
- [ ] An FAQ answers the literal questions buyers type, such as "Is X free?", "Does X support Y?" and "X vs Z".`,
    },
    {
      heading: "Layer 3: Machine-readable data (can they parse you?)",
      body: `- [ ] Organization and WebSite structured data on the homepage, with \`sameAs\` links to your social and directory profiles.
- [ ] SoftwareApplication structured data on product pages (category, OS, offers).
- [ ] FAQPage structured data that matches the visible FAQ.
- [ ] An [llms.txt](${ROUTES.GUIDE(GUIDE_SLUGS.LLMS_TXT)}) file listing your key pages.
- [ ] [Markdown versions of key pages](${ROUTES.GUIDE(GUIDE_SLUGS.MARKDOWN_FOR_AGENTS)}) for agents, served by content negotiation or a \`.md\` URL.
- [ ] For APIs: an OpenAPI spec at a stable URL, and optionally an MCP server.`,
    },
    {
      heading: "Layer 4: Off-site mentions (do other sources vouch for you?)",
      body: `- [ ] Listed on launch directories and category directories in your niche, with a consistent name and one-line description.
- [ ] Present on the comparison and "alternatives" pages that rank for your competitors' names.
- [ ] Mentioned in community threads where people ask for recommendations, written as a genuine answer and disclosed as your own product.
- [ ] Your product appears in tutorials or docs as a building block (integrations and "built with" pages count).
- [ ] Reviews or case studies exist on at least one site you do not control.`,
    },
    {
      heading: "How LaunchNests applies this checklist",
      body: `${SITE_CONFIG.name} is built to cover layers 1, 3 and 4 for every product launched on it:

- every listing page is server-rendered, in the sitemap, and pinged to search engines through IndexNow when it changes;
- each listing has SoftwareApplication, breadcrumb and FAQ structured data;
- each listing has a markdown twin (append \`.md\` to the URL, or send \`Accept: text/markdown\`) and an entry in [llms.txt](${ROUTES.LLMS_TXT});
- listings appear on category, built-with, alternatives and weekly launch pages, which gives AI engines several crawlable sources that mention the product.

Run the free [AI readiness checker](${ROUTES.FREE_TOOL("ai-readiness-checker")}) on your own site to see which items you are missing.`,
    },
  ],
  faqs: [
    {
      question: "What is the difference between GEO and SEO?",
      answer:
        "SEO aims to rank pages in search results. GEO aims to have AI systems retrieve, summarise and cite your content in generated answers. GEO depends on SEO basics like crawlability and indexing, then adds a focus on quotable facts and third-party mentions.",
    },
    {
      question: "Is GEO the same as AEO?",
      answer:
        "Mostly. Answer engine optimization is the older term from featured snippets and voice search; generative engine optimization refers to large-language-model answers. The practical checklist is nearly identical.",
    },
    {
      question: "How do I measure GEO results?",
      answer:
        "Track referral visits from AI assistants in analytics, and run a fixed set of buyer questions through ChatGPT, Perplexity, Claude and Google each month, logging mentions and cited sources.",
    },
  ],
  relatedLinks: [
    {
      label: "Generative engine optimization",
      href: ROUTES.GLOSSARY_TERM("generative-engine-optimization"),
    },
    {
      label: "Answer engine optimization",
      href: ROUTES.GLOSSARY_TERM("answer-engine-optimization"),
    },
    { label: "Structured data", href: ROUTES.GLOSSARY_TERM("structured-data") },
    {
      label: "AI readiness checker",
      href: ROUTES.FREE_TOOL("ai-readiness-checker"),
    },
  ],
}
