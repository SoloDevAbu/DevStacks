import { GUIDE_SLUGS } from "@/constants/guides/slugs"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { Guide } from "@/types/guides"

export const SUBMIT_STARTUP_GUIDE: Guide = {
  slug: GUIDE_SLUGS.SUBMIT_STARTUP,
  title: "How to Submit Your Startup or AI Tool: A Launch Checklist That Gets Indexed",
  metaTitle: "How to Submit Your Startup or AI Tool (Launch Checklist)",
  description:
    "Where to submit a new startup or AI tool, what to prepare before you submit, and how to make each listing get indexed by Google and cited by AI assistants.",
  publishedOn: "2026-11-24",
  updatedOn: "2026-11-24",
  keywords: [
    "submit startup",
    "submit ai tool",
    "submit your startup",
    "list your startup",
    "where to submit my saas",
    "startup launch checklist",
    "ai tools directory submission",
  ],
  keyTakeaways: [
    "Prepare one submission kit (name, one-line description, long description, category, pricing, logo, screenshots, founder links) and reuse it everywhere, word for word.",
    "Prioritise directories whose listing pages are indexed and give a followed link; check a real listing before you pay.",
    "Spread submissions over two to four weeks instead of one day, so each listing gets crawled and you can answer comments.",
    "After submitting, confirm each listing is indexed and links to the right URL, and add the best ones to your site's 'as seen on' section.",
  ],
  sections: [
    {
      heading: "Step 1: Build a submission kit before you submit anywhere",
      body: `Every directory asks for the same things in slightly different forms. Write them once:

- **Name** and **one-line description** (under 60 characters): "Acme: open-source feature flags for Next.js".
- **Short description** (around 160 characters) and **long description** (150 to 300 words) that state what it does, who it is for, pricing, and what it replaces.
- **Category** and 3 to 5 **tags** that match how people search ("feature flags", "A/B testing").
- **Pricing model**: Free, Freemium, Paid or Open Source, with the starting price.
- **Assets**: square logo (at least 512 px), 3 to 5 screenshots at 1270×760 or larger, an optional 60-second demo video.
- **Links**: website, docs, GitHub, X, LinkedIn, and a founder profile.

Using the **same wording everywhere** matters for AI answers: consistent descriptions across sources make it clear to a model that they all describe one product.`,
    },
    {
      heading: "Step 2: Pick where to submit",
      body: `Not every directory is worth your time. Before submitting, open an existing listing on the site and check three things:

1. **Is the listing page indexed?** Search \`site:directory.com "a listed product"\` in Google.
2. **Is the link followed?** Inspect the outbound link for \`rel="nofollow"\` or \`rel="ugc"\`.
3. **Does it bring the audience you want?** Developer tools do better on developer-focused boards; consumer AI apps do better on AI tool directories.

${SITE_CONFIG.name} keeps a [launch directory database](${ROUTES.DIRECTORIES}) with prices and review times, and a weekly [link check report](${ROUTES.DIRECTORIES_LINK_CHECK_REPORT}) that records whether each directory actually gave a real listing a followed link.

A sensible order for most products:

- **Week 1:** your own channels, plus one or two launch platforms with a weekly or daily leaderboard.
- **Week 2:** niche directories for your category (AI tools, developer tools, SaaS).
- **Week 3:** a [Show HN](${ROUTES.GUIDE(GUIDE_SLUGS.SHOW_HN)}) post if the product is technical and can be tried without signing up.
- **Week 4:** comparison and "alternatives" sites for the competitors you replace.`,
    },
    {
      heading: "Step 3: Write a listing that ranks and gets quoted",
      body: `- Lead with the category and outcome, not a slogan. "AI meeting notes for sales teams" beats "Your meetings, supercharged".
- Name the tool you replace: "a lighter alternative to Gong".
- State the price in text.
- Answer two or three FAQs inside the listing if the form allows it ("Is it free?", "Does it work with Zoom?").
- Use real screenshots of the product, not marketing illustrations. Some directories use the first image as the social card.`,
    },
    {
      heading: "Step 4: After you submit",
      body: `- **Check indexing** a week later. If a listing is not indexed after a month, the directory adds little SEO value.
- **Verify the link** points to the right URL and keeps any UTM parameters you want for attribution.
- **Reply to every comment and review**; activity often keeps a listing higher on the board.
- **Collect badges** from the directories that give real traffic or links, and display them on your site.
- **Track referrals** per directory in analytics so next time you only repeat what worked.`,
    },
    {
      heading: "Submitting to LaunchNests",
      body: `On ${SITE_CONFIG.name} you can [submit a product or a developer tool](${ROUTES.SUBMIT}). Each listing gets:

- an indexed product page with SoftwareApplication structured data;
- a markdown version for AI agents and an entry in [llms.txt](${ROUTES.LLMS_TXT});
- a place in the weekly launch leaderboard, its category page and the "built with" pages of the tools in its stack.

[Pricing](${ROUTES.PRICING}) lists what the free and paid tiers include.`,
    },
  ],
  faqs: [
    {
      question: "How many directories should I submit my startup to?",
      answer:
        "Ten to twenty well-chosen ones beat a hundred low-quality ones. Prioritise directories whose listing pages are indexed, relevant to your audience, and give a followed link.",
    },
    {
      question: "Is it worth paying for directory submissions?",
      answer:
        "Only when the paid tier gives something you can verify, such as guaranteed homepage placement or a followed link, and the directory's listing pages are indexed. Check a current paid listing before paying.",
    },
    {
      question: "Do directory backlinks still help SEO?",
      answer:
        "A few relevant, indexed, followed links help a new domain get discovered and build authority. Mass submissions to low-quality directories do not, and can look spammy.",
    },
    {
      question: "Where should I submit an AI tool?",
      answer:
        "Use AI-specific tool directories for consumer AI apps, developer-focused launch boards for AI developer tools and APIs, plus general launch platforms with weekly leaderboards.",
    },
  ],
  relatedLinks: [
    { label: "Launch directory database", href: ROUTES.DIRECTORIES },
    {
      label: "Free SaaS directories for backlinks",
      href: ROUTES.GUIDE_SAAS_DIRECTORIES,
    },
    {
      label: "Where to launch developer tools",
      href: ROUTES.GUIDE_LAUNCH_DEVTOOLS,
    },
    { label: "Launch directory", href: ROUTES.GLOSSARY_TERM("launch-directory") },
    { label: "Submit your product", href: ROUTES.SUBMIT },
  ],
}
