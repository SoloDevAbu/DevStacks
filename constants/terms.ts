import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export interface TermItem {
  id: string
  number: number
  title: string
  content: string
  bulletPoints?: string[]
}

export interface TermCategory {
  id: string
  title: string
  description: string
  headerThemeKey: "core" | "directory" | "protocols" | "legal"
  items: TermItem[]
}

export const TERMS_LAST_UPDATED = "September 19, 2026"

export const TERMS_CATEGORIES: TermCategory[] = [
  {
    id: "core-terms-and-access",
    title: "Core Terms & Platform Access",
    description:
      "Acceptance criteria, user account governance, authentication, and acceptable use policies.",
    headerThemeKey: "core",
    items: [
      {
        id: "acceptance-of-terms",
        number: 1,
        title: "Acceptance of Terms",
        content: `By accessing or using ${SITE_CONFIG.name} (${SITE_CONFIG.domain}) (the "Service"), including our website, REST API, Model Context Protocol server, and machine-readable feeds, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.\n\nThe Service is operated by ${SITE_CONFIG.name}. You must be at least 16 years old, or the minimum digital consent age in your country, and legally capable of entering into a binding agreement in your jurisdiction to create an account or submit a listing.`,
      },
      {
        id: "accounts-and-authentication",
        number: 2,
        title: "Accounts & Authentication",
        content: `Accounts on ${SITE_CONFIG.name} are authenticated through supported OAuth providers (including Google OAuth, powered by BetterAuth). You are responsible for maintaining the security of your account and for all activity that occurs under it.`,
        bulletPoints: [
          "One account per person or legal entity.",
          "You must provide accurate information — including your display name, maker profile, and listing details.",
          `Notify us immediately at ${SITE_CONFIG.supportEmail} of any unauthorised access or suspected security breach.`,
          "We reserve the right to suspend or terminate accounts that provide fraudulent information or violate these Terms.",
        ],
      },
      {
        id: "acceptable-use",
        number: 3,
        title: "Acceptable Use",
        content: `You agree to use ${SITE_CONFIG.name} only for lawful, technical, and community purposes. You agree not to:`,
        bulletPoints: [
          "Submit content you do not own or lack express legal authorization to publish.",
          "Submit unlawful, deceptive, defamatory, infringing, or harmful material — including malware, phishing schemes, scams, hate speech, adult content, or material that facilitates illegal activity.",
          "Artificially manipulate upvotes, rankings, views, or community signals — including coordinated inauthentic behaviour, bot-generated votes, fake or duplicate accounts, or disposable-email voting.",
          "Post spam, promotional comments, or unsolicited links in community areas (comments, showcases, or discussion threads).",
          "Scrape the Service in a manner that impairs performance or bypasses our publicly provided machine-readable endpoints (we provide /llms.txt, /llms-full.txt, /api/ai, MCP, and OpenAPI 3.1 specifically so scraping is unnecessary).",
          "Reverse engineer, decompile, or attempt to extract source code from the Service.",
          "Circumvent authentication, rate limits, or platform access controls.",
        ],
      },
    ],
  },
  {
    id: "directory-and-community",
    title: "Directory Listings & Community Rules",
    description:
      "Submission guidelines, live launch rankings, the 'Built With' graph, and comment standards.",
    headerThemeKey: "directory",
    items: [
      {
        id: "maker-content-and-licence",
        number: 4,
        title: "Maker Content & Licence",
        content: `Product listings, tool submissions, showcase entries, comments, and other technical content you contribute ("Maker Content") remain your intellectual property. By submitting Maker Content, you grant ${SITE_CONFIG.name} a worldwide, non-exclusive, royalty-free licence to host, display, distribute, cache, and index your content.\n\nThis includes serving Maker Content in structured formats such as JSON, Markdown, and machine-readable representations (via /api/md/, llms.txt, and MCP tools), and featuring it in platform summaries, AI-readable snapshots, and promotional materials for ${SITE_CONFIG.name}.\n\nYou acknowledge that public Maker Content is intentionally crawlable and may be ingested by third-party search engines, AI assistants, and answer engines as a core feature of the platform. You warrant that you have all necessary rights, licenses, and permissions for all submitted content, logos, screenshots, and URLs.`,
      },
      {
        id: "directory-listings-tools-and-products",
        number: 5,
        title: "Directory Listings — Tools & Products",
        content: `${SITE_CONFIG.name} operates a dual-taxonomy directory of developer Tools and Products:\n\n• Tools are foundational building blocks, APIs, libraries, databases, and infrastructure services.\n• Products are end-user software applications, SaaS products, desktop utilities, and indie apps built by developers.\n\nSubmissions are subject to editorial review for authenticity, verified URLs, and developer categorization. Approval is not guaranteed. We reserve the right to reject, remove, unpublish, or recategorize listings that are misleading, low-quality, malicious, or outside our technical scope.\n\nRankings across the platform are transparent, verified, and community-driven:\n• Once approved, new listings are scheduled for and feature in "This Week's Launches" for the specific ISO calendar week to which the user submitted their project, ranked strictly by live community votes (upvotes for tools, likes for products, comments tie-breaker). Every launch competes on genuine community merit during its scheduled launch week.\n• The homepage highlights the current week's active developer launches alongside "Popular Building Blocks".\n• Directory catalogs (${ROUTES.TOOLS} and ${ROUTES.PRODUCTS}) provide filtering by category and pricing, and sorting by Upvoted, Most Builds (connected projects), or Most Viewed.\n• The Trending leaderboard (${ROUTES.TRENDING}) ranks items algorithmically based on vote and view velocity with time decay.`,
      },
      {
        id: "built-with-tech-stack-graph",
        number: 6,
        title: '"Built With" Tech Stack Graph',
        content: `The "Built With" feature allows product makers to declare the developer tools, databases, and APIs powering their software, establishing an interactive graph of verified architectural relationships.\n\nBy declaring a "Built With" relationship, you represent and warrant that the cited tool is genuinely used in the listed product. Misrepresenting architectural dependencies or falsely claiming tool adoption violates these Terms and may result in listing removal or backlink revocation.`,
      },
      {
        id: "comments-and-community",
        number: 7,
        title: "Comments & Community Standards",
        content: `Signed-in users may post comments and reviews on live product and tool profiles. Comments are public Maker Content displayed alongside your authenticated account name.`,
        bulletPoints: [
          "Constructive feedback: Comments must provide genuine technical feedback, architectural questions, or authentic user reviews.",
          "No link spam or self-promotion: Templated promotional comments, affiliate links, automated link-dropping, or competitor solicitation are strictly prohibited.",
          "Automated sanitization: HTML tags and markup are automatically stripped from comment submissions to ensure platform safety.",
          "Moderation: We reserve the right to remove non-compliant comments and suspend abusive accounts under Section 3 without prior notice.",
        ],
      },
    ],
  },
  {
    id: "sponsorships-seo-and-ai",
    title: "Sponsorships, SEO & AI Protocols",
    description:
      "Advertising terms, Do-Follow backlink policies, machine-readable twins, and MCP server rules.",
    headerThemeKey: "protocols",
    items: [
      {
        id: "sponsorships-and-paid-placements",
        number: 8,
        title: "Sponsorships & Paid Placements",
        content: `${SITE_CONFIG.name} offers optional paid sidebar sponsorships and promotional placements ("Sponsorships"). Sponsorship slots can be booked instantly through our self-serve checkout powered by Dodo Payments or arranged via direct communication (email or X / Twitter DM) as outlined on our Pricing page (${ROUTES.PRICING}).`,
        bulletPoints: [
          "Paid placements are clearly labeled as sponsored across the Service.",
          "Sponsorships include a verified sponsor badge and a direct Do-Follow backlink to the advertiser's landing page for the duration of the paid period.",
          "Sponsorship slots are time-bound (weekly or monthly) and non-transferable unless agreed in writing.",
          `Refunds and cancellations for paid placements are governed exclusively by our Refund Policy (${ROUTES.REFUND}).`,
        ],
      },
      {
        id: "backlinks-and-seo",
        number: 9,
        title: "Backlinks & SEO Infrastructure",
        content: `Every approved listing on ${SITE_CONFIG.name} receives a canonical public directory page (${SITE_CONFIG.url}/tools/[slug] or ${SITE_CONFIG.url}/products/[slug]) indexed by search engines with Server-Side Rendered (SSR) HTML and structured JSON-LD schema.`,
        bulletPoints: [
          "Standard directory indexing: Free listings receive permanent search indexation. As part of our active launch promotion, approved submissions receive complimentary lifetime Verified status including permanent Do-Follow backlinks.",
          "Sponsorship backlinks: Paid sponsorships receive persistent, sitewide Do-Follow backlinks for the duration of the placement.",
          "No performance guarantee: We do not guarantee specific Domain Authority (DA/DR) increases, search engine rankings, indexing latency, or referral traffic volumes.",
          "Comment links prohibited: Community comments may not be used to acquire backlinks (see Section 7).",
        ],
      },
      {
        id: "ai-agent-access-and-protocols",
        number: 10,
        title: "AI Agent Access & Machine-Readable Protocols",
        content: `${SITE_CONFIG.name} is engineered as an open platform for autonomous AI agents, LLM answer engines, and automated developer tooling. We provide the following machine-readable endpoints:`,
        bulletPoints: [
          "llms.txt & llms-full.txt — structured text mirror for LLM indexing and training citations.",
          "/api/ai — cached, bounded JSON snapshot of live tools, products, and ecosystem statistics.",
          "Model Context Protocol (MCP) — Streamable HTTP JSON-RPC 2.0 endpoint at /api/mcp supporting 8 core tools: search_tools, search_products, get_tool, get_product, get_leaderboard, get_maker_profile, get_daily_launches, and get_weekly_launches.",
          "OpenAPI 3.1 & REST API — public contracts at /openapi.json and REST endpoints at /v1.",
          "Markdown Twins — every entity is available as text/markdown via .md suffix or Accept: text/markdown header (including /terms.md, /faq.md, /mcp.md, /cli.md).",
          "ai.txt — behavioral guidelines defining crawler permissions and citation rules.",
        ],
      },
    ],
  },
  {
    id: "legal-governance-and-liability",
    title: "Liability, Legal Governance & Notices",
    description:
      "Intellectual property, disclaimers, liability limitations, indemnification, and jurisdiction.",
    headerThemeKey: "legal",
    items: [
      {
        id: "intellectual-property",
        number: 11,
        title: "Intellectual Property",
        content: `${SITE_CONFIG.name}, its logos, design system, ranking algorithms, and software code are the intellectual property of ${SITE_CONFIG.name}. Third-party product names, logos, and trademarks displayed on the platform belong to their respective owners and are shown solely for discovery, technical reference, and identification purposes. Inclusion on ${SITE_CONFIG.name} does not constitute endorsement or affiliation.`,
      },
      {
        id: "third-party-services",
        number: 12,
        title: "Third-Party Services & Infrastructure",
        content: `The Service relies on industry-standard third-party providers. Your use of ${SITE_CONFIG.name} is also subject to their respective terms:`,
        bulletPoints: [
          "Hosting & Edge Network: Vercel Inc.",
          "Database & Storage: Neon Serverless PostgreSQL",
          "Authentication: BetterAuth with Google OAuth",
          "Payments & Billing: Dodo Payments Inc. (Merchant of record and checkout provider)",
        ],
      },
      {
        id: "third-party-links-and-products",
        number: 13,
        title: "Third-Party Links & External Software",
        content: `Tool and product profiles link to external websites, code repositories, and pricing pages not controlled by ${SITE_CONFIG.name}. We are not responsible for the availability, content, pricing accuracy, security, or privacy practices of external sites. Visiting external links is at your own risk.`,
      },
      {
        id: "disclaimers-and-warranties",
        number: 14,
        title: "Disclaimers & Warranties",
        content: `The Service is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.\n\n${SITE_CONFIG.name} does not warrant that directory listings are complete, accurate, or free of errors, or that the Service will operate uninterrupted. Community upvotes and rankings represent platform user signals, not editorial endorsements or technical audits.`,
      },
      {
        id: "limitation-of-liability",
        number: 15,
        title: "Limitation of Liability",
        content: `To the fullest extent permitted by applicable law, ${SITE_CONFIG.name}'s total aggregate liability for any claim arising out of or relating to the Service is limited to the greater of:\n\n(a) the total amount you paid to ${SITE_CONFIG.name} in the 12 months preceding the claim, or\n(b) USD 50.\n\n${SITE_CONFIG.name} is not liable for any indirect, incidental, special, consequential, exemplary, or punitive damages — including loss of profits, loss of data, loss of goodwill, or business interruption — even if advised of the possibility of such damages.`,
      },
      {
        id: "indemnification",
        number: 16,
        title: "Indemnification",
        content: `You agree to indemnify, defend, and hold harmless ${SITE_CONFIG.name}, its operator, and affiliates from any claims, damages, liabilities, losses, costs, and expenses (including reasonable legal fees) arising out of:`,
        bulletPoints: [
          "Your Maker Content or submitted product/tool listings.",
          "Your use of or access to the Service.",
          "Your violation of these Terms.",
          "Your violation of any third-party right, including intellectual property, privacy, or contractual rights.",
        ],
      },
      {
        id: "termination",
        number: 17,
        title: "Account Suspension & Termination",
        content: `You may request account deletion at any time by contacting ${SITE_CONFIG.supportEmail}. Account deletion removes your profile and personal data subject to our Privacy Policy retention obligations.\n\n${SITE_CONFIG.name} may suspend or permanently terminate accounts or unpublish listings that violate these Terms, manipulate community signals (upvotes, rankings, reviews), engage in spam or abusive conduct, or expose the platform to legal or operational risk. Termination for cause does not entitle you to a refund of any paid fees.`,
      },
      {
        id: "changes-to-these-terms",
        number: 18,
        title: "Changes to These Terms",
        content: `We may revise these Terms from time to time. The "Last updated" date at the top of this page indicates the most recent revision. Continued use of the Service after revised Terms are posted constitutes your acceptance of the changes. For material changes affecting paid features or active obligations, we will provide advance notice via platform announcement.`,
      },
      {
        id: "governing-law-and-disputes",
        number: 19,
        title: "Governing Law & Disputes",
        content: `These Terms are governed by and construed in accordance with the laws of India. Any legal action, suit, or dispute arising out of or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Assam, India.\n\nNothing in this section deprives consumers of mandatory statutory protections available under the laws of their country of residence.`,
      },
      {
        id: "contact-and-legal-notices",
        number: 20,
        title: "Contact & Legal Notices",
        content: `For questions about these Terms, copyright inquiries, or legal notices, please contact us:`,
        bulletPoints: [
          `Email: ${SITE_CONFIG.supportEmail}`,
          `X / Twitter: ${SITE_CONFIG.socials.x}`,
          `Canonical URL: ${SITE_CONFIG.url}/terms`,
        ],
      },
    ],
  },
]

export const ALL_TERMS_ITEMS = TERMS_CATEGORIES.flatMap((cat) => cat.items)
