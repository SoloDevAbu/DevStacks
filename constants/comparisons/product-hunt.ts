import type { PlatformComparison } from "@/types/comparison"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const PRODUCT_HUNT_COMPARISON: PlatformComparison = {
  slug: "producthunt",
  routePath: "/producthunt-alternative",
  targetKeyword: "Product Hunt alternative",
  name: "Product Hunt Alternative",
  comparedPlatformName: "Product Hunt",
  metaTitle: `Product Hunt Alternative: LaunchNests vs Product Hunt (${new Date().getFullYear()})`,
  metaDescription:
    "An objective, research-backed comparison between Product Hunt and LaunchNests. Compare launch mechanics, discovery lifespans, tech-stack graphs, AI agent readiness, and submission policies.",
  keywords: [
    "Product Hunt alternative",
    "alternatives to Product Hunt",
    "Product Hunt vs LaunchNests",
    "sites like Product Hunt",
    "product launch platforms",
    "developer product directories",
    "launching developer tools",
    "developer product discovery",
    "tech stack database",
    "where to launch software products",
  ],
  canonicalUrl: `${SITE_CONFIG.url}/producthunt-alternative`,
  lastVerifiedDate: "October 2026",
  heroBadge: "Editorial Comparison & Platform Guide",
  heroTitle: "Product Hunt Alternative for Developer Tools & Software Products",
  heroDescription:
    "Product Hunt is the tech industry's premier 24-hour launch competition for viral visibility and community buzz. LaunchNests takes a different approach: a permanent developer directory and relational tech-stack graph designed for continuous discovery, architectural blueprints, and autonomous AI search engines.",
  productHuntProfile: {
    name: "Product Hunt",
    tagline: "The best new products in tech",
    websiteUrl: "https://www.producthunt.com",
    primaryAudience:
      "Broad tech ecosystem: early adopters, startup founders, venture capitalists, journalists, and general tech consumers.",
    discoveryLifespan:
      "24-hour daily launch competition (12:01 AM to 11:59 PM PT). Products rank on daily leaderboards and shift to historical archives after day one.",
    pricingModel:
      "Free core submissions; paid self-serve ads ($5,000–$10,000 CPM), managed campaigns ($10,000+), and newsletter sponsorships.",
    keyStrengths: [
      "Massive existing community with millions of monthly tech enthusiasts",
      "High-visibility 24-hour viral launch day potential with press and VC attention",
      "Prestigious social proof badges ('#1 Product of the Day/Week/Month')",
      "Active comment discussions and community Q&A on launch day",
    ],
    keyLimitations: [
      "Discovery is front-loaded; traffic often drops sharply after the 24-hour voting cycle",
      "Strict 6-month cooldown between launches of the same product (major feature update required)",
      "Excludes directories, templates, boilerplates, and waitlists without immediate access",
      "Outbound product links use tracking redirects (/r/) with rel='nofollow' attributes",
      "No relational mapping between products and their underlying developer tech stacks",
    ],
  },
  launchNestsProfile: {
    name: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    websiteUrl: SITE_CONFIG.url,
    primaryAudience:
      "Software engineers, technical founders, devtool creators, and autonomous AI search agents.",
    discoveryLifespan:
      "Perpetual catalog indexing. Products and tools remain continuously discoverable across category hubs, trending momentum feeds, and 'Built With' tech-stack pages.",
    pricingModel:
      "100% free core submissions for products and dev tools; optional weekly/monthly sidebar sponsorships and featured placements.",
    keyStrengths: [
      "Perpetual categorized discovery that does not expire after 24 hours",
      "Two-way 'Built With' graph linking software products to their underlying tools and APIs",
      "Native AI search engine readiness via /llms.txt, /llms-full.txt, and a production Model Context Protocol (MCP) server",
      "Direct outbound links with verified Do-Follow link equity for developer tools",
      "Open to devtools, boilerplates, APIs, open-source libraries, and indie software",
    ],
    keyLimitations: [
      "Smaller overall consumer audience compared to Product Hunt's decade of mainstream brand equity",
      "Focuses specifically on software products and developer tools rather than general consumer tech or physical hardware",
      "Curated manual moderation (12–24h review) rather than instant self-publishing",
    ],
  },
  quickComparisonDimensions: [
    {
      key: "purpose",
      label: "Primary Purpose",
      productHuntValue: "24-hour launch competition & daily leaderboard",
      launchNestsValue: "Perpetual developer directory & tech-stack database",
      highlight: "neutral",
      description: "How each platform frames its primary user and maker experience.",
    },
    {
      key: "audience",
      label: "Primary Audience",
      productHuntValue: "Broad tech ecosystem (consumers, founders, VCs)",
      launchNestsValue: "Software engineers, devtool builders, AI agents",
      highlight: "neutral",
      description: "Product Hunt serves general tech; LaunchNests focuses on developers.",
    },
    {
      key: "lifespan",
      label: "Discovery Lifespan",
      productHuntValue: "24-hour launch window (12:01 AM – 11:59 PM PT)",
      launchNestsValue: "Permanent categorized indexing & weekly momentum",
      highlight: "launchNests",
      description: "Product Hunt discovery peaks in 1 day; LaunchNests remains cataloged.",
    },
    {
      key: "techstack",
      label: "Tech-Stack Relationship",
      productHuntValue: "None (isolated product listings)",
      launchNestsValue: "Two-way 'Built With' relational tech-stack graph",
      highlight: "launchNests",
      description: "LaunchNests connects products to the tools, databases, and APIs powering them.",
    },
    {
      key: "linkStructure",
      label: "Outbound Link Attributes",
      productHuntValue: "Tracking redirect (/r/) with rel='nofollow'",
      launchNestsValue: "Direct website links (Do-Follow on verified listings)",
      highlight: "launchNests",
      description: "How search engines process outbound links to your domain.",
    },
    {
      key: "aiAccessibility",
      label: "AI & Machine Accessibility",
      productHuntValue: "Standard HTML pages; no /llms.txt or MCP server",
      launchNestsValue: "/llms.txt, /llms-full.txt, raw .md, & live MCP server",
      highlight: "launchNests",
      description: "Readiness for LLM retrieval (ChatGPT, Claude, Perplexity, Cursor).",
    },
    {
      key: "submissionRules",
      label: "Relaunch & Submission Policy",
      productHuntValue: "Strict 6-month cooldown; no directories/boilerplates",
      launchNestsValue: "Continuous listing; devtools, boilerplates & APIs welcome",
      highlight: "launchNests",
      description: "Eligibility rules for software, devtools, and iterative product updates.",
    },
    {
      key: "socialProof",
      label: "Social Proof Badges",
      productHuntValue: "Prestigious '#1 Product of the Day' embed badges",
      launchNestsValue: "Community upvotes, trending score, & verified builds count",
      highlight: "productHunt",
      description: "Product Hunt badges carry unmatched recognition among tech media and investors.",
    },
    {
      key: "pricing",
      label: "Core Listing Fee",
      productHuntValue: "Free submission (advertising starting at $5,000)",
      launchNestsValue: "Free submission (optional self-serve sponsorships)",
      highlight: "neutral",
      description: "Both platforms offer free submission for makers.",
    },
    {
      key: "idealFit",
      label: "Best Suited For",
      productHuntValue: "Mainstream apps seeking viral launch-day buzz",
      launchNestsValue: "Developer products, APIs, and tech-stack visibility",
      highlight: "neutral",
      description: "Different strategic priorities depending on your product type.",
    },
  ],
  deepDives: [
    {
      id: "discovery-lifespan",
      title: "Launch-Day Spike vs Perpetual Directory Discovery",
      subtitle: "The difference between an ephemeral voting event and lasting catalog visibility",
      productHuntAngle:
        "Product Hunt revolves around a high-stakes 24-hour cycle. Products go live at 12:01 AM PT, and makers spend the entire day rallying supporters, answering comments, and competing for a top 5 badge. For successful launches, the traffic spike can be intense. However, once the 24 hours conclude, products move off the homepage into archive lists, and daily referral traffic typically declines significantly.",
      launchNestsAngle:
        "LaunchNests is architected as an ongoing developer reference directory. While it features 'This Week's Launches' on the homepage to highlight new submissions, products and tools do not disappear after a single day. Instead, they remain permanently indexed in structured categories, filterable by pricing and adoption, and continuously linked from the 'Built With' profiles of other tools.",
      practicalTakeaway:
        "Use Product Hunt when you want a concentrated spike of immediate attention for a major milestone. Use LaunchNests to establish steady, searchable discovery among developers researching production solutions.",
    },
    {
      id: "audience-focus",
      title: "Broad Tech Enthusiasts vs Software Engineers",
      subtitle: "Aligning your product category with the visitors who browse each platform",
      productHuntAngle:
        "Product Hunt's audience spans consumer tech, lifestyle apps, productivity tools, AI novelties, marketing SaaS, and hardware. While developer tools do launch on Product Hunt, they compete on the same leaderboard against mainstream consumer applications, gamified apps, and B2B marketing tools that naturally appeal to a wider non-technical voting base.",
      launchNestsAngle:
        "LaunchNests is purposefully built for software engineering. The platform strictly distinguishes between 'Tools' (libraries, databases, auth providers, cloud infrastructure, dev utilities) and 'Products' (end-user software and SaaS). Visitors come specifically to discover APIs, inspect architectures, and evaluate tools they can integrate into their codebases.",
      practicalTakeaway:
        "If you are launching a consumer mobile app or general productivity tool, Product Hunt is a natural fit. If you are launching an API, SDK, database, backend service, or developer tool, LaunchNests provides an audience that genuinely understands your technical stack.",
    },
    {
      id: "tech-stack-graph",
      title: "Isolated Product Profiles vs The 'Built With' Graph",
      subtitle: "How architectural connections create bidirectional organic discovery",
      productHuntAngle:
        "On Product Hunt, each product listing is an independent entity. There is no native data model showing which developer tools, databases, or cloud infrastructure power the product, nor can users discover other products built with the same tech stack.",
      launchNestsAngle:
        "LaunchNests implements a relational 'Built With' graph. When makers submit a product, they tag the underlying tools (e.g. Supabase, Next.js, Stripe, Tailwind CSS, OpenAI API). This creates automatic two-way discovery: your product showcases its architecture, while the profile for each tool displays your product as a verified real-world build.",
      practicalTakeaway:
        "This relational model enables perpetual organic discovery: as other developers browse popular tools in your stack, they discover your product as a live production example.",
    },
    {
      id: "ai-readiness",
      title: "Standard Web Browsing vs AI & Machine Accessibility (AEO/GEO)",
      subtitle: "Preparing your product for autonomous agents and LLM answer engines",
      productHuntAngle:
        "Product Hunt serves human web visitors through traditional HTML and client-rendered web views. It does not provide public machine-readable indexes, structured /llms.txt manifests, or API protocols for generative AI search engines.",
      launchNestsAngle:
        "LaunchNests is engineered specifically for Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO). It provides root-level /llms.txt and /llms-full.txt files, clean raw Markdown (.md) endpoints for every tool and product profile, and a live Model Context Protocol (MCP) server at /api/mcp. This allows AI assistants like ChatGPT, Claude, and Perplexity to ingest accurate, structured product information directly.",
      practicalTakeaway:
        "As software discovery increasingly shifts to AI assistants and code editors (Cursor, Windsurf), machine-readable protocols ensure your product is visible to both human developers and autonomous agents.",
    },
    {
      id: "submission-and-links",
      title: "Submission Rules, Cooldowns & Link Equity",
      subtitle: "Understanding platform guidelines, restrictions, and SEO link attributes",
      productHuntAngle:
        "Product Hunt enforces strict guidelines: personal accounts only, a 6-month mandatory cooldown between posts of the same product (requiring substantial new features), and an explicit policy of not featuring directories, templates, boilerplates, or waitlists without immediate access. Furthermore, outbound product links pass through tracking redirects (/r/) with rel='nofollow' attributes, which search engines do not treat as direct authority endorsements.",
      launchNestsAngle:
        "LaunchNests allows open submission for developer tools, SaaS applications, open-source repositories, APIs, and boilerplates with straightforward 12–24 hour moderation. There is no arbitrary 6-month cooldown for active iterations. Verified listings receive direct, permanent links to their domains.",
      practicalTakeaway:
        "If you build boilerplates, developer templates, or iterate frequently, Product Hunt's featuring policies may restrict you, whereas LaunchNests welcomes developer-first utilities.",
    },
  ],
  scenarios: [
    {
      id: "choose-product-hunt",
      title: "Choose Product Hunt If:",
      badge: "One-Day Viral Launch",
      badgeVariant: "hot",
      recommendedFor: "Consumer Apps, B2B SaaS, Major Milestones & PR",
      explanation:
        "Product Hunt remains the industry standard when you need a single, high-intensity day of concentrated community attention and mainstream press visibility.",
      bulletPoints: [
        "You are launching a consumer mobile app, design tool, or general-purpose productivity SaaS.",
        "You have organized a launch team, active supporters, and community followers ready to upvote on launch day.",
        "Earning a '#1 Product of the Day' badge is a primary goal for social proof, landing page badges, or pitch decks.",
        "You are seeking early feedback from investors, journalists, and mainstream tech early adopters.",
      ],
    },
    {
      id: "choose-launchnests",
      title: "Choose LaunchNests If:",
      badge: "Perpetual Dev Directory",
      badgeVariant: "new",
      recommendedFor: "Developer Tools, APIs, Software Products & Tech Stacks",
      explanation:
        "LaunchNests is designed for developers who want continuous discoverability, architectural context, and machine-readable presence without the pressure of a 24-hour voting sprint.",
      bulletPoints: [
        "You built a developer tool, API, database, open-source library, starter kit, or developer-focused SaaS.",
        "You want your product cataloged permanently in searchable categories rather than disappearing after 24 hours.",
        "You want to showcase your tech stack and be discovered through two-way 'Built With' relationships.",
        "You care about AI search engine visibility across ChatGPT, Claude, and Perplexity via /llms.txt and MCP protocols.",
        "You want clean, direct backlink equity without tracking redirects or nofollow restrictions.",
      ],
    },
    {
      id: "choose-both",
      title: "Choose Both If:",
      badge: "Omnichannel Launch",
      badgeVariant: "neutral",
      recommendedFor: "Comprehensive Product Distribution Strategy",
      explanation:
        "The most effective launch strategy is not choosing one over the other, but using each platform for its complementary strengths.",
      bulletPoints: [
        "Launch on Product Hunt to capture day-one excitement, initial community comments, and social proof.",
        "List on LaunchNests on the same day to secure permanent directory indexing, tech-stack mapping, and AI indexing.",
        "Use Product Hunt's badge on your landing page while letting LaunchNests provide steady developer discovery month after month.",
      ],
    },
  ],
  canYouUseBoth: {
    heading: "Can You Use Both Platforms Together?",
    subheading: "A practical omnichannel distribution strategy for modern software builders",
    description:
      "Product Hunt and LaunchNests are not mutually exclusive. In fact, combining them offers a balanced distribution strategy that covers both immediate launch-day momentum and long-term organic discoverability.",
    strategySteps: [
      {
        stepNumber: 1,
        title: "Pre-Launch & Foundation",
        timing: "1–2 Weeks Before Launch",
        action:
          "Submit your product to LaunchNests. Tag your tech stack (databases, auth, frontend, hosting). Allow 12–24h for moderation so your permanent profile and /llms.txt entries are indexed.",
        outcome:
          "Your technical profile is live, your tech-stack relationships are mapped, and AI crawlers begin ingesting your product metadata.",
      },
      {
        stepNumber: 2,
        title: "Launch Day Sprint",
        timing: "Launch Day (12:01 AM PT)",
        action:
          "Launch on Product Hunt. Rally your community, respond to founder questions in comments, and compete for daily leaderboard placement.",
        outcome:
          "Capture maximum same-day visitor spikes, early user feedback, and potential 'Product of the Day' recognition.",
      },
      {
        stepNumber: 3,
        title: "Post-Launch Compound Discovery",
        timing: "Weeks & Months Following Launch",
        action:
          "Embed your Product Hunt badge on your website for social proof. Meanwhile, your LaunchNests profile continues generating discovery as developers search tools in your stack and AI assistants query /llms.txt.",
        outcome:
          "You avoid the post-launch traffic cliff by maintaining a permanent, categorized presence in the developer ecosystem.",
      },
    ],
    summary:
      "By using both platforms, you don't have to choose between a viral launch day and sustainable long-term discovery.",
  },
  faqs: [
    {
      question: "Is LaunchNests a direct competitor or alternative to Product Hunt?",
      answer:
        "LaunchNests serves as an alternative approach to product discovery, especially for developer tools, APIs, and software applications. While Product Hunt focuses on a 24-hour daily launch competition for broad tech products, LaunchNests provides a permanent directory, a relational 'Built With' tech-stack database, and machine-readable endpoints for AI search engines. Many makers use both platforms together.",
    },
    {
      question: "Can I launch the same product on both Product Hunt and LaunchNests?",
      answer:
        "Yes. There are no exclusivity restrictions on either platform. Launching on Product Hunt gives you a 24-hour burst of early-adopter visibility, while listing on LaunchNests ensures your product remains permanently searchable by category, tech stack, and AI agents long after the launch day ends.",
    },
    {
      question: "Why would a developer choose LaunchNests over Product Hunt?",
      answer:
        "Developers often choose LaunchNests when they are building technical products (libraries, APIs, databases, boilerplates) that may not appeal to Product Hunt's general consumer audience. LaunchNests listings also do not expire after 24 hours, do not require a 6-month cooldown between updates, and include two-way tech-stack discovery linking tools to real-world builds.",
    },
    {
      question: "How does product discovery work on LaunchNests after launch week?",
      answer:
        "On LaunchNests, products do not disappear into archives. They remain permanently accessible through category hubs, filterable by pricing and adoption, searchable via global search, and discoverable through the 'Built With' profiles of all the underlying tools used to build them. Additionally, autonomous AI assistants retrieve structured data from /llms.txt and our MCP server.",
    },
    {
      question: "Is listing a product or developer tool on LaunchNests free?",
      answer:
        "Yes, listing on LaunchNests is 100% free for software products, developer tools, open-source repositories, and indie projects. Every approved submission receives permanent directory indexing, structured JSON-LD schema, and inclusion in AI crawler feeds. Optional paid sponsorships are available for makers seeking additional sidebar or banner visibility.",
    },
    {
      question: "How does LaunchNests handle outbound links compared to Product Hunt?",
      answer:
        "Product Hunt routes outbound website clicks through tracking redirect links (/r/) with rel='nofollow' attributes. LaunchNests provides direct outbound links on product profiles, and verified listings include Do-Follow links to pass domain authority directly to your product.",
    },
  ],
}
