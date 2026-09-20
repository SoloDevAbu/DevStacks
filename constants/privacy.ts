import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export interface PrivacyItem {
  id: string
  number: number
  title: string
  content: string
  bulletPoints?: string[]
}

export interface PrivacyCategory {
  id: string
  title: string
  description: string
  headerThemeKey: "core" | "directory" | "protocols" | "legal"
  items: PrivacyItem[]
}

export const PRIVACY_LAST_UPDATED = "September 19, 2026"

export const PRIVACY_CATEGORIES: PrivacyCategory[] = [
  {
    id: "core-privacy-and-collection",
    title: "Core Privacy & Data Collection",
    description:
      "Data controller details, categories of personal data collected, and primary processing purposes.",
    headerThemeKey: "core",
    items: [
      {
        id: "data-controller",
        number: 1,
        title: "Data Controller & Scope",
        content: `The data controller is ${SITE_CONFIG.name} (${SITE_CONFIG.domain}), reachable at support@${SITE_CONFIG.domain}. This Privacy Policy explains how ${SITE_CONFIG.name} collects, uses, shares, and protects your personal data when you visit our website, submit developer tools or products, authenticate as a maker, or interact with our APIs and machine-readable surfaces.\n\nWe respond to verified data-subject requests within 30 days.`,
      },
      {
        id: "data-we-collect",
        number: 2,
        title: "Categories of Data We Collect",
        content: `We collect minimal, developer-focused data necessary to provide discovery services, authenticate makers, and prevent community manipulation:`,
        bulletPoints: [
          "Account Data: Display name, email address, profile avatar, and a stable provider identifier from your authentication service (Google OAuth via BetterAuth). Optional profile fields include maker bio, location, and social links.",
          `Listing & Submission Data: Tool and product specifications, taglines, URLs, logos, screenshots, pricing tiers, platform tags, problem/solution descriptions, and declared tech stack ("Built With") graph relationships.`,
          "Engagement Data: Upvotes cast, comments posted, live product visits while signed in, and community leaderboard interactions.",
          "Payment & Sponsorship Data: Transaction IDs, sponsorship tiers, and invoice statuses. Credit card numbers, CVVs, and banking credentials are handled directly by our PCI-DSS compliant payment processor and never touch our servers.",
          "Technical & Edge Logs: Device type, browser user-agent, IP address, edge geolocation (country and region derived from IP), and HTTP access logs. Server logs are automatically purged within 30 days.",
          "Analytics Data: Aggregated, anonymized page views, referrers, and device categories collected via privacy-first analytics with zero cross-site tracking or advertising identifiers.",
          `Communications: Direct inquiries sent to support@${SITE_CONFIG.domain} or notifications regarding listing reviews.`,
        ],
      },
      {
        id: "how-we-use-data",
        number: 3,
        title: "How We Use Your Data",
        content: `We process your data for transparent, technical, and operational purposes:`,
        bulletPoints: [
          "Operating the Discovery Directory: Authenticating sessions, rendering tool and product profiles, calculating live launch rankings, and resolving tech-stack dependencies.",
          "Content Moderation & Integrity: Detecting and preventing artificial upvote manipulation, bot farms, disposable-email voting, and fraudulent listings.",
          "Sponsorship Delivery: Fulfilling booked sidebar advertising placements, managing invoices, and verifying backlink activations.",
          "Transactional Notifications: Sending listing approval notices, editorial feedback, and critical account security alerts.",
          "Platform Optimization: Debugging edge routing, monitoring API performance, and optimizing database queries.",
          "Machine-Readable AI Indexing: Serving structured, public listing data to AI search crawlers, answer engines, and LLMs via /llms.txt, /llms-full.txt, /api/ai, and Model Context Protocol (MCP) endpoints.",
          "Legal & Regulatory Compliance: Retaining required tax records and cooperating with lawful requests.",
        ],
      },
    ],
  },
  {
    id: "legal-bases-and-public-content",
    title: "Legal Bases, Public Content & Sharing",
    description:
      "Lawful processing grounds under GDPR/DPDP, the public nature of maker content, and data processors.",
    headerThemeKey: "directory",
    items: [
      {
        id: "legal-bases",
        number: 4,
        title: "Legal Bases under GDPR & DPDP",
        content: `Where GDPR, India's Digital Personal Data Protection (DPDP) Act, or equivalent privacy frameworks apply, we process personal data under the following lawful grounds:`,
        bulletPoints: [
          "Contract Performance: Creating and authenticating maker accounts, publishing submitted listings, and delivering reserved sponsorship placements.",
          "Legitimate Interests: Protecting platform voting integrity, preventing bot abuse, maintaining server security logs, and operating a public developer discovery index.",
          "Consent: Optional email notifications or communications, which you may withdraw at any time.",
          "Legal Obligations: Maintaining tax invoices and complying with statutory obligations.",
        ],
      },
      {
        id: "public-nature-of-content",
        number: 5,
        title: "Public Nature of Maker Content",
        content: `Developer tool listings, product showcases, "Built With" architectural dependencies, creator profiles, and community reviews are intentionally public.\n\nBy submitting technical listings or comments, you acknowledge that this information will be indexed by public search engines (Google, Bing), ingested by AI answer engines (ChatGPT, Claude, Perplexity), and made available in structured formats (JSON, Markdown, and MCP tools). This cross-promotional indexing is the foundational purpose of ${SITE_CONFIG.name}. Do not submit private, confidential, or proprietary data.`,
      },
      {
        id: "data-sharing-and-processors",
        number: 6,
        title: "Third-Party Service Providers & Data Sharing",
        content: `We do not sell, rent, or trade your personal data to data brokers or advertising networks. We share minimal data only with trusted service providers essential for platform operations:`,
        bulletPoints: [
          "Hosting & Edge Network: Vercel Inc. (global edge distribution and SSR compute).",
          "Database & Infrastructure: Neon Serverless PostgreSQL (encrypted cloud database).",
          "Authentication: Google OAuth via BetterAuth (secure identity verification).",
          "AI Integrations: Anthropic, OpenAI, Perplexity, and Google Gemini (public data indexing and query synthesis).",
          "Transactional Communications: Resend or equivalent email delivery providers.",
          "Legal Authorities: Where strictly mandated by court orders, applicable laws, or to defend platform integrity against malicious attack.",
        ],
      },
    ],
  },
  {
    id: "retention-transfers-and-rights",
    title: "Retention, Transfers & Your Rights",
    description:
      "Data retention timelines, international transfer safeguards, and user privacy rights.",
    headerThemeKey: "protocols",
    items: [
      {
        id: "international-transfers",
        number: 7,
        title: "International Data Transfers",
        content: `${SITE_CONFIG.name} operates globally with core infrastructure hosted in secure data centers across the US and EU (via Vercel and Neon). Where personal data is transferred internationally, we ensure appropriate safeguards are maintained, including Standard Contractual Clauses (SCCs) and encryption in transit and at rest.`,
      },
      {
        id: "data-retention",
        number: 8,
        title: "Data Retention Periods",
        content: `We store personal data only as long as necessary for the purposes outlined in this policy:`,
        bulletPoints: [
          "Account Data: Retained while your account remains active. Upon account deletion, personal profile records and session tokens are permanently removed from live production systems within 24 hours.",
          "Listing Data: Persisted while published. If you delete a listing or request removal, public pages are unpublished immediately and purged from cache.",
          "Server & Edge Logs: Automatically rotated and deleted within 30 days.",
          "Payment & Invoice Records: Retained for up to 7 years to satisfy statutory accounting and tax regulations.",
          "Abuse & Fraud Logs: Banned IP hashes or bot signatures may be retained indefinitely to protect platform security.",
        ],
      },
      {
        id: "your-rights",
        number: 9,
        title: "Your Data Protection Rights",
        content: `Under applicable global privacy regulations (including GDPR, DPDP Act, and CCPA/CPRA), you have enforceable rights regarding your personal information:`,
        bulletPoints: [
          "Right to Access: Request a copy of the personal data we hold about you.",
          "Right to Rectification: Correct inaccurate or incomplete profile information.",
          "Right to Erasure (Deletion): Request the permanent deletion of your maker account and associated data.",
          "Right to Restrict Processing: Request limits on how your personal data is utilized.",
          "Right to Data Portability: Receive your account and submission data in a structured, machine-readable JSON format.",
          "Right to Withdraw Consent: Revoke consent for non-essential notifications at any time.",
          `To exercise any of these rights, contact us at support@${SITE_CONFIG.domain}. We respond to all verified requests within 30 days without charge.`,
        ],
      },
    ],
  },
  {
    id: "cookies-ai-and-security",
    title: "Cookies, AI Crawlers & Security",
    description:
      "Session cookies, automated crawler permissions, security protocols, and policy updates.",
    headerThemeKey: "legal",
    items: [
      {
        id: "cookies-and-tracking",
        number: 10,
        title: "Cookies & Session Management",
        content: `We prioritize user privacy and use strictly necessary first-party cookies for authentication, session persistence, and CSRF protection. We do not deploy third-party advertising cookies, behavioural retargeting trackers, or cross-site tracking scripts.`,
      },
      {
        id: "ai-agents-and-crawlers",
        number: 11,
        title: "AI Agents, Crawlers & LLM Indexing",
        content: `${SITE_CONFIG.name} explicitly authorizes transparent search and answer engine crawlers (including GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, and Google-Extended) to index public directory pages in compliance with our published robots.txt and ai.txt policies.\n\nAI agents interacting via our Model Context Protocol (MCP) server or /llms.txt endpoints access only intentionally public maker content and platform metrics. Automated systems are forbidden from attempting to scrape private or non-public endpoints.`,
      },
      {
        id: "childrens-privacy",
        number: 12,
        title: "Children's Privacy",
        content: `${SITE_CONFIG.name} is designed exclusively for software developers, engineers, and technical founders. It is not directed at children under the age of 16. We do not knowingly collect personal data from minors. If you believe a minor has registered an account, contact support@${SITE_CONFIG.domain} and we will promptly delete the data.`,
      },
      {
        id: "security-measures",
        number: 13,
        title: "Technical & Organizational Security",
        content: `We implement robust technical and organizational security controls to protect your data, including HTTPS/TLS encryption in transit, encrypted database storage at rest, strict database role separation, rate limiting against brute-force attacks, and edge firewall protections.\n\nWhile no internet platform can guarantee absolute immunity from threats, we regularly audit our dependencies and security architecture to safeguard developer accounts.`,
      },
      {
        id: "changes-to-policy",
        number: 14,
        title: "Changes to This Privacy Policy",
        content: `We may update this Privacy Policy to reflect platform enhancements, legal amendments, or new service integrations. The "Last updated" date at the top of this document indicates the current effective version. For substantive changes, we will provide conspicuous notice on our website or via email.`,
      },
      {
        id: "contact-privacy",
        number: 15,
        title: "Contact & Data Protection Inquiries",
        content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please reach out to our team:`,
        bulletPoints: [
          `Email: support@${SITE_CONFIG.domain}`,
          `X / Twitter: ${SITE_CONFIG.socials.x}`,
          `Canonical URL: ${SITE_CONFIG.url}/privacy`,
        ],
      },
    ],
  },
]

export const ALL_PRIVACY_ITEMS = PRIVACY_CATEGORIES.flatMap((cat) => cat.items)
