import { SITE_CONFIG } from "@/constants/site"
import {
  DOMAIN_RATING_API,
  LLMS_TXT_GENERATOR,
} from "@/constants/free-tools/config"
import type { FreeTool, FreeToolSlug } from "@/types/free-tools"

const DR_ATTRIBUTION_NOTE = `Domain Rating data comes from Ahrefs' free Domain Rating API and is shown with the credit "Domain Rating by Ahrefs", as Ahrefs' licence requires. ${SITE_CONFIG.name} is not affiliated with Ahrefs.`

const DR_GUIDE = [
  {
    heading: "What is Domain Rating?",
    paragraphs: [
      "Domain Rating (DR) is an Ahrefs metric from 0 to 100 that estimates how strong a website's backlink profile is compared with every other site in Ahrefs' index. It is based on how many unique websites link to the domain with followed links, and how strong those linking websites are.",
      "The scale is logarithmic. Moving from DR 10 to DR 20 takes far fewer new links than moving from DR 60 to DR 70.",
    ],
  },
  {
    heading: "How to use DR when launching a product",
    paragraphs: [
      "Use DR to compare link opportunities. A followed link from a relevant DR 60 directory usually does more for a new domain than many links from DR 5 sites.",
      "Check the DR of pages already ranking for your target searches. If they are all DR 80 and your site is DR 10, aim for longer, more specific searches first.",
      "DR is a third-party estimate. Google does not use it, and it says nothing about traffic or whether a site's links are followed. Check those separately.",
    ],
  },
] as const

export const FREE_TOOLS: readonly FreeTool[] = [
  {
    slug: "domain-rating-checker",
    name: "Domain Rating Checker",
    metaTitle: "Free Domain Rating Checker: Check Any Site's DR",
    metaDescription:
      "Check any website's Ahrefs Domain Rating (DR) for free. No sign-up. See how strong a domain's backlink profile is before you pitch, launch or buy a link.",
    tagline:
      "Check any website's Domain Rating (DR) for free, no sign-up needed.",
    cardDescription:
      "Look up the Ahrefs Domain Rating of any website in one click.",
    howTo: [
      {
        name: "Enter a domain",
        text: "Type or paste a domain or URL, such as example.com.",
      },
      {
        name: "Run the check",
        text: "Press Check DR. The tool asks Ahrefs' free Domain Rating API for the score.",
      },
      {
        name: "Read the result",
        text: "See the DR from 0 to 100 and what that band usually means for a site.",
      },
    ],
    guide: [
      ...DR_GUIDE,
      {
        heading: "Where the data comes from",
        paragraphs: [DR_ATTRIBUTION_NOTE],
      },
    ],
    faqs: [
      {
        question: "Is this Domain Rating checker free?",
        answer:
          "Yes. It is free with no sign-up. Results are cached for a day, so repeated checks of the same domain return the same score.",
      },
      {
        question: "What is a good Domain Rating?",
        answer:
          "It depends on the niche. New sites start near 0, many established small businesses sit between 20 and 50, and large publishers are often above 80. Compare against sites in your own space.",
      },
      {
        question: "Is Domain Rating the same as Domain Authority?",
        answer:
          "No. Domain Rating is from Ahrefs and Domain Authority is from Moz. Both estimate link strength, but they use different data and formulas, so the numbers differ.",
      },
      {
        question: "How can I increase my Domain Rating?",
        answer:
          "Earn followed links from relevant, established websites: launch directories that give followed links, guest posts, tools and data others cite, and mentions from partners and customers.",
      },
    ],
  },
  {
    slug: "bulk-domain-rating-checker",
    name: "Bulk Domain Rating Checker",
    metaTitle: "Free Bulk Domain Rating Checker: Check DR in Bulk",
    metaDescription: `Check the Ahrefs Domain Rating of up to ${DOMAIN_RATING_API.BULK_MAX_DOMAINS} domains at once for free. Sort by DR and download the results as CSV.`,
    tagline: `Check the Domain Rating of up to ${DOMAIN_RATING_API.BULK_MAX_DOMAINS} domains at once and export them as CSV.`,
    cardDescription: `Check DR for up to ${DOMAIN_RATING_API.BULK_MAX_DOMAINS} domains at once and download a CSV.`,
    howTo: [
      {
        name: "Paste your domains",
        text: `Paste up to ${DOMAIN_RATING_API.BULK_MAX_DOMAINS} domains or URLs, one per line or separated by commas.`,
      },
      {
        name: "Run the bulk check",
        text: "Press Check DR. Duplicates and invalid entries are flagged instead of stopping the run.",
      },
      {
        name: "Sort and export",
        text: "Results are sorted from highest to lowest DR. Download them as CSV for your spreadsheet.",
      },
    ],
    guide: [
      {
        heading: "When to check DR in bulk",
        paragraphs: [
          "Bulk checks are useful when you have a list to prioritise: launch directories to submit to, sites to pitch for guest posts, competitors' backlinks, or partners for a co-marketing push.",
          "Sorting by DR shows where a single link is likely to matter most. Pair it with relevance and whether the site's links are actually followed.",
        ],
      },
      ...DR_GUIDE,
      {
        heading: "Where the data comes from",
        paragraphs: [DR_ATTRIBUTION_NOTE],
      },
    ],
    faqs: [
      {
        question: "How many domains can I check at once?",
        answer: `Up to ${DOMAIN_RATING_API.BULK_MAX_DOMAINS} per run. Run the tool again for longer lists.`,
      },
      {
        question: "Can I export the results?",
        answer:
          "Yes. Download the results as a CSV file with each domain and its Domain Rating.",
      },
      {
        question: "Why did a domain return no rating?",
        answer:
          "The entry may not be a valid domain, or Ahrefs may not have data for it. Check the spelling and try the root domain, such as example.com.",
      },
    ],
  },
  {
    slug: "ai-readiness-checker",
    name: "AI Readiness Checker",
    metaTitle: "AI Readiness Checker: Test llms.txt & AI Crawler Access",
    metaDescription:
      "Free AI readiness checker. Test whether ChatGPT, Claude, Perplexity and Gemini crawlers can read your site: robots.txt rules, llms.txt, JSON-LD and server-rendered content.",
    tagline:
      "See whether AI assistants and their crawlers can find, read and cite your website.",
    cardDescription:
      "Check AI crawler access, llms.txt, structured data and server-rendered content.",
    howTo: [
      {
        name: "Enter your website",
        text: "Type your homepage address, such as https://example.com.",
      },
      {
        name: "Run the check",
        text: "The tool fetches your homepage, robots.txt, sitemap, llms.txt and llms-full.txt like a crawler would.",
      },
      {
        name: "Fix what fails",
        text: "Each check explains what it found and what to change. Fix the failed checks first; they carry the most weight.",
      },
    ],
    guide: [
      {
        heading: "What the AI readiness score measures",
        paragraphs: [
          "The score out of 100 combines ten checks that decide whether AI systems can find and understand a site: whether the homepage responds, whether its content is in the HTML before JavaScript runs, title and meta description, JSON-LD structured data, a canonical URL, robots.txt, AI crawler access, a sitemap, llms.txt and llms-full.txt.",
          "Failed checks score zero, warnings score half. Crawler access, server-rendered content and structured data carry the most weight, because without them AI tools cannot read or identify the site at all.",
        ],
      },
      {
        heading: "Why AI crawler access matters",
        paragraphs: [
          "ChatGPT search, Claude, Perplexity and other AI tools fetch pages with their own crawlers. If robots.txt blocks them, the site cannot appear in their answers, however well it ranks on Google.",
          "Training crawlers and search crawlers are often separate, for example GPTBot and OAI-SearchBot. You can block training while still allowing search.",
        ],
      },
      {
        heading: "What is llms.txt?",
        paragraphs: [
          "llms.txt is a proposed standard: a Markdown file at the site root that summarises the site and links to its most useful pages for AI tools. It is not an official web standard and support varies, but it is cheap to add.",
          `${SITE_CONFIG.name} publishes its own /llms.txt and /llms-full.txt, which you can use as an example.`,
        ],
      },
    ],
    faqs: [
      {
        question: "Does this tool check every page on my site?",
        answer:
          "No. It checks the homepage plus the site-wide files: robots.txt, sitemap.xml, llms.txt and llms-full.txt. Run it on other important URLs to check their HTML.",
      },
      {
        question: "Does Google use llms.txt?",
        answer:
          "Google has said it does not need llms.txt for Search. It mainly helps AI tools and agents that choose to read it.",
      },
      {
        question: "Should I block AI crawlers?",
        answer:
          "It depends on your goals. Blocking training crawlers keeps content out of future models; blocking search crawlers also removes the site from AI answers that could send visitors.",
      },
      {
        question: "Why does my site fail the JavaScript check?",
        answer:
          "Its main content is rendered in the browser. Many AI crawlers do not run JavaScript, so use server-side rendering or static generation for important pages.",
      },
    ],
  },
  {
    slug: "llms-txt-generator",
    name: "llms.txt Generator & Validator",
    metaTitle: "llms.txt Generator & Validator (Free)",
    metaDescription:
      "Generate an llms.txt file for your website from its sitemap, or validate the llms.txt file you already have against the llmstxt.org format. Free, no sign-up.",
    tagline:
      "Validate your llms.txt file against the llmstxt.org format, or generate a ready-to-copy one from your sitemap.",
    cardDescription:
      "Check an existing llms.txt file or draft one from your sitemap and page titles.",
    howTo: [
      {
        name: "Enter your domain",
        text: "Type your domain, such as example.com.",
      },
      {
        name: "Run the check",
        text: "The tool fetches /llms.txt, your sitemap (from robots.txt or /sitemap.xml) and the title and description of your homepage and top pages.",
      },
      {
        name: "Fix or publish",
        text: "If you already have an llms.txt, fix the issues it lists. Otherwise copy or download the generated file, review it, and upload it to the root of your site as /llms.txt.",
      },
    ],
    guide: [
      {
        heading: "What is llms.txt?",
        paragraphs: [
          "llms.txt is a plain Markdown file at the root of a website, such as example.com/llms.txt, that tells AI assistants and agents what the site is and which pages matter most. It was proposed in 2024 as an easy, curated alternative to making AI tools crawl and parse every HTML page.",
          "It is a proposal, not an official web standard. Some AI tools and agents read it, many do not yet, and it has no effect on Google rankings.",
        ],
      },
      {
        heading: "What a valid llms.txt file looks like",
        paragraphs: [
          "The llmstxt.org format is short. The file starts with an H1 holding the site or project name, which is the only required part. A blockquote (a line starting with >) follows with a one-sentence summary.",
          "After that come ## sections, such as ## Docs or ## Products. Each section lists links in the form - [Page name](https://example.com/page): a short description. A section called ## Optional marks links an AI tool can skip when it is short on context.",
        ],
      },
      {
        heading: "How the generator builds your draft",
        paragraphs: [
          `It reads the sitemap listed in robots.txt, or /sitemap.xml, and falls back to links on your homepage. URLs are grouped by their first path segment, so /blog/... pages become a ## Blog section. Up to ${LLMS_TXT_GENERATOR.MAX_SECTIONS} sections with ${LLMS_TXT_GENERATOR.MAX_LINKS_PER_SECTION} links each are kept, shallow pages first.`,
          "Each link uses the page's own title and meta description. Review the draft before you publish it: reorder sections, drop pages that do not help, and rewrite descriptions so they say what each page answers.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is llms.txt?",
        answer:
          "llms.txt is a Markdown file at the root of a website that summarises the site for AI tools and links to its most useful pages, each with a short description. The format is described at llmstxt.org.",
      },
      {
        question: "Should I create an llms.txt file?",
        answer:
          "If you want AI assistants and agents to find your key pages, yes. It is one small file and takes minutes with this generator. Not every AI tool reads it yet and it does not change Google rankings, so treat it as an extra, not a replacement for server-rendered pages, a sitemap and robots.txt rules that allow AI crawlers.",
      },
      {
        question: "Where do I put my llms.txt file?",
        answer:
          "At the root of your domain, so it loads at https://yourdomain.com/llms.txt. Serve it as text/plain or text/markdown, not as an HTML page.",
      },
      {
        question: "What is the difference between llms.txt and llms-full.txt?",
        answer:
          "llms.txt is a short index of links. llms-full.txt is an optional companion that holds the full text of your key pages in one file, so an AI tool can read everything with a single request.",
      },
      {
        question: "Is this llms.txt generator free?",
        answer:
          "Yes. It is free with no sign-up. The tool only reads public pages on the domain you enter and does not store the result.",
      },
    ],
  },
]

const TOOLS_BY_SLUG = new Map(FREE_TOOLS.map((tool) => [tool.slug, tool]))

export const getFreeTool = (slug: string) =>
  TOOLS_BY_SLUG.get(slug as FreeToolSlug) ?? null

export const FREE_TOOLS_HUB = {
  title: "Free SEO & AI Search Tools for Makers",
  heading: "Free Tools",
  description: `Free tools from ${SITE_CONFIG.name} for checking Domain Rating, AI search readiness and llms.txt files before and after a launch. No sign-up needed.`,
} as const
