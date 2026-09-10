import "dotenv/config"
import { db } from "./index"
import { tools, products, users, categories, productTools } from "./schema"
import { eq } from "drizzle-orm"

type SeedPlatform =
  | "Web"
  | "iOS"
  | "Android"
  | "macOS"
  | "Windows"
  | "Linux"
  | "CLI"
  | "API"
  | "Extension"
  | "Plugin"
  | "Cloud"
  | "Self-Hosted"

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

// ---------------------------------------------------------------------------
// Seed Tools — infrastructure / developer tools
// ---------------------------------------------------------------------------

const SEED_TOOLS: {
  name: string
  slug: string
  tagline: string
  description: string
  problemStatement?: string
  solution?: string
  uniqueValue?: string
  websiteUrl: string
  logoUrl: null
  githubUrl: string | null
  categoryName: string
  tags: string[]
  platforms: SeedPlatform[]
  pricing: "Free" | "Freemium" | "Paid" | "Open Source"
  tier: "free" | "premium" | "premium+"
  status: "approved" | "pending" | "rejected"
  upvotesCount: number
  buildsCount: number
  commentsCount: number
  viewsCount: number
  keywords?: string
  targetAudience?: string
  asoCategory?: string
  aiContext?: string
}[] = [
  {
    name: "Supabase",
    slug: "supabase",
    tagline: "The open source Firebase alternative",
    description:
      "Supabase is an open source Firebase alternative providing all the backend features you need: Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage, and Vector embeddings.",
    problemStatement:
      "Building backend services from scratch requires integrating and maintaining disparate database, authentication, storage, and real-time infrastructure.",
    solution:
      "A complete, cohesive backend suite powered by a dedicated Postgres database with enterprise-grade scaling and security.",
    uniqueValue:
      "Built on real Postgres with full SQL capabilities, no vendor lock-in, and instant REST and GraphQL APIs.",
    websiteUrl: "https://supabase.com",
    logoUrl: null,
    githubUrl: "https://github.com/supabase/supabase",
    categoryName: "Database",
    tags: ["Database", "BaaS", "Postgres", "Auth"],
    platforms: ["Cloud", "Web", "Self-Hosted"],
    pricing: "Freemium",
    tier: "premium+",
    status: "approved",
    upvotesCount: 3840,
    buildsCount: 82,
    commentsCount: 94,
    viewsCount: 45600,
    keywords:
      "supabase, postgres, firebase alternative, baas, database, auth, realtime",
    targetAudience:
      "Full-stack developers, frontend engineers, and startup founders",
    asoCategory: "Developer Tools",
    aiContext:
      "Supabase is a complete backend platform featuring Postgres, Auth, APIs, and Vector embeddings.",
  },
  {
    name: "Stripe",
    slug: "stripe",
    tagline: "Financial infrastructure for the internet",
    description:
      "Stripe is a suite of payment APIs that powers commerce for online businesses of all sizes, from startups to Fortune 500 companies.",
    problemStatement:
      "Accepting international payments, managing subscriptions, and handling global tax compliance is immensely complex and prone to regulatory friction.",
    solution:
      "Developer-friendly payment APIs with prebuilt checkout flows, fraud prevention via Stripe Radar, and automated subscription billing.",
    uniqueValue:
      "Industry-leading 99.999% uptime, global payment method support, and gold-standard developer documentation.",
    websiteUrl: "https://stripe.com",
    logoUrl: null,
    githubUrl: "https://github.com/stripe/stripe-node",
    categoryName: "Payments",
    tags: ["Payments", "Billing", "SaaS", "API"],
    platforms: ["Web", "API", "iOS", "Android"],
    pricing: "Paid",
    tier: "premium",
    status: "approved",
    upvotesCount: 2950,
    buildsCount: 71,
    commentsCount: 68,
    viewsCount: 38200,
    keywords:
      "stripe, payments, billing, checkout, subscriptions, credit cards",
    targetAudience:
      "SaaS founders, e-commerce developers, and software platforms",
    asoCategory: "Finance",
    aiContext:
      "Stripe provides developer payment infrastructure, subscription billing, and merchant services.",
  },
  {
    name: "Vercel",
    slug: "vercel",
    tagline: "Build and deploy the modern web",
    description:
      "Vercel provides the developer experience and infrastructure to build, scale, and secure a faster, more personalized web. Creators of Next.js.",
    problemStatement:
      "Deploying performant frontend applications with server-side rendering, global edge caching, and automated CI/CD requires intricate DevOps workflows.",
    solution:
      "Zero-config Git integrations, automated preview deployments, edge middleware, and instant global CDN distribution.",
    uniqueValue:
      "First-party optimization for Next.js, fluid compute scaling, and seamless preview environment collaboration.",
    websiteUrl: "https://vercel.com",
    logoUrl: null,
    githubUrl: "https://github.com/vercel/next.js",
    categoryName: "Infra",
    tags: ["Hosting", "Edge", "Next.js", "Serverless"],
    platforms: ["Cloud", "Web", "CLI"],
    pricing: "Freemium",
    tier: "premium+",
    status: "approved",
    upvotesCount: 3120,
    buildsCount: 68,
    commentsCount: 76,
    viewsCount: 41000,
    keywords: "vercel, hosting, nextjs, serverless, edge computing, deployment",
    targetAudience: "Web developers, Next.js engineers, and frontend teams",
    asoCategory: "Developer Tools",
    aiContext:
      "Vercel is the frontend cloud platform for deploying and hosting modern web applications.",
  },
  {
    name: "PostHog",
    slug: "posthog",
    tagline: "The open source product analytics suite",
    description:
      "PostHog is an all-in-one developer platform for product analytics, session replays, feature flags, A/B testing, and user surveys. Self-hostable and privacy-compliant.",
    problemStatement:
      "Fragmented product analytics tools create data silos and require installing five separate tracking libraries.",
    solution:
      "A unified platform combining telemetry, funnel tracking, heatmaps, session recording, and feature rollouts in a single SDK.",
    uniqueValue:
      "Open source core, full SQL query access to raw events, and complete data sovereignty.",
    websiteUrl: "https://posthog.com",
    logoUrl: null,
    githubUrl: "https://github.com/posthog/posthog",
    categoryName: "Analytics",
    tags: ["Analytics", "Open Source", "Telemetry", "DevTools"],
    platforms: ["Cloud", "Self-Hosted", "Web"],
    pricing: "Freemium",
    tier: "free",
    status: "approved",
    upvotesCount: 1840,
    buildsCount: 34,
    commentsCount: 38,
    viewsCount: 22000,
    keywords:
      "posthog, analytics, session replay, feature flags, ab testing, open source",
    targetAudience:
      "Product engineers, growth teams, and privacy-conscious founders",
    asoCategory: "Developer Tools",
    aiContext:
      "PostHog is an open-source product analytics and developer telemetry platform.",
  },
  {
    name: "BetterAuth",
    slug: "better-auth",
    tagline: "Auth that just works for modern TypeScript apps",
    description:
      "Better Auth is a comprehensive authentication and authorization framework for TypeScript, supporting OAuth, credentials, two-factor authentication, and multi-tenancy with zero lock-in.",
    problemStatement:
      "Configuring authentication in Next.js and Node.js often requires either complex self-managed boilerplate or expensive closed-source SaaS vendors.",
    solution:
      "A modular, lightweight library supporting standard ORMs (Drizzle, Prisma) and modern OAuth providers with type safety.",
    uniqueValue:
      "100% TypeScript type safety, plugin-based architecture, and full ownership of your database tables.",
    websiteUrl: "https://better-auth.com",
    logoUrl: null,
    githubUrl: "https://github.com/better-auth/better-auth",
    categoryName: "Auth",
    tags: ["Auth", "Security", "TypeScript", "Next.js"],
    platforms: ["Web", "API"],
    pricing: "Open Source",
    tier: "premium",
    status: "approved",
    upvotesCount: 1420,
    buildsCount: 28,
    commentsCount: 32,
    viewsCount: 18500,
    keywords:
      "better auth, authentication, oauth, typescript, drizzle, nextjs auth",
    targetAudience:
      "TypeScript developers, full-stack Next.js builders, and SaaS architects",
    asoCategory: "Developer Tools",
    aiContext:
      "Better Auth is an open-source, type-safe authentication library for TypeScript applications.",
  },
  {
    name: "Dodo Payments",
    slug: "dodo-payments",
    tagline: "Merchant of Record for global SaaS & AI apps",
    description:
      "Dodo Payments handles global sales tax, VAT, billing, and payouts for software companies and AI builders, operating as a full Merchant of Record.",
    problemStatement:
      "Selling software internationally forces developers to register for tax in dozens of jurisdictions and deal with local billing compliance.",
    solution:
      "A turnkey Merchant of Record that takes care of remittances, tax liabilities, chargebacks, and localized payment rails.",
    uniqueValue:
      "Developer-first MoR with instant onboarding, competitive fees, and seamless AI subscription billing APIs.",
    websiteUrl: "https://dodopayments.com",
    logoUrl: null,
    githubUrl: null,
    categoryName: "Payments",
    tags: ["Payments", "API", "Billing", "Tax"],
    platforms: ["Web", "API"],
    pricing: "Freemium",
    tier: "free",
    status: "approved",
    upvotesCount: 920,
    buildsCount: 37,
    commentsCount: 19,
    viewsCount: 12400,
    keywords:
      "dodo payments, merchant of record, saas billing, sales tax, vat, ai billing",
    targetAudience:
      "Global software founders, indie hackers, and AI developers",
    asoCategory: "Finance",
    aiContext:
      "Dodo Payments is a Merchant of Record simplifying global sales tax and payments for SaaS.",
  },
  {
    name: "TinyBase",
    slug: "tinybase",
    tagline: "The reactive data store for local-first apps",
    description:
      "TinyBase is a lightweight, reactive data store for local-first JavaScript applications. It synchronizes across tabs, devices, and backends like SQLite, CRDTs, and WebSockets.",
    problemStatement:
      "Building offline-first web apps with real-time sync typically leads to complex cache invalidation and state synchronization bugs.",
    solution:
      "A zero-dependency reactive store with built-in indexing, relationship queries, metrics, and multi-transport synchronization.",
    uniqueValue:
      "Tiny footprint (<10kB gzipped), ultra-fast in-memory updates, and native CRDT conflict resolution.",
    websiteUrl: "https://tinybase.org",
    logoUrl: null,
    githubUrl: "https://github.com/tinyplex/tinybase",
    categoryName: "Database",
    tags: ["Database", "Local-First", "Reactive", "Open Source"],
    platforms: ["Web", "macOS", "Windows", "Linux", "iOS", "Android"],
    pricing: "Open Source",
    tier: "free",
    status: "approved",
    upvotesCount: 760,
    buildsCount: 22,
    commentsCount: 14,
    viewsCount: 9800,
    keywords:
      "tinybase, local-first, reactive store, crdt, sqlite sync, state management",
    targetAudience:
      "Frontend engineers building offline-first and collaborative applications",
    asoCategory: "Developer Tools",
    aiContext:
      "TinyBase is a reactive data store designed specifically for local-first and offline-capable applications.",
  },
  {
    name: "Resend",
    slug: "resend",
    tagline: "Email for developers",
    description:
      "Resend is the modern email service for developers. Build, test, and send transactional emails using React components and modern API standards.",
    problemStatement:
      "Legacy email delivery platforms rely on outdated HTML table templates, clunky dashboards, and slow delivery times.",
    solution:
      "A developer-first email platform with first-class React Email integration, instant webhook delivery, and pristine deliverability.",
    uniqueValue:
      "React Email native support, modern REST API with sub-100ms response times, and supreme deliverability ratings.",
    websiteUrl: "https://resend.com",
    logoUrl: null,
    githubUrl: "https://github.com/resend/react-email",
    categoryName: "Email",
    tags: ["Email", "API", "React", "Developer Tools"],
    platforms: ["Web", "API"],
    pricing: "Freemium",
    tier: "free",
    status: "approved",
    upvotesCount: 1650,
    buildsCount: 29,
    commentsCount: 22,
    viewsCount: 21000,
    keywords:
      "resend, transactional email, react email, email api, deliverability",
    targetAudience: "Web developers, SaaS founders, and engineering teams",
    asoCategory: "Developer Tools",
    aiContext:
      "Resend is a modern developer email platform powered by React Email.",
  },
  {
    name: "Supernova",
    slug: "supernova",
    tagline: "Design system manager for scaling UI components",
    description:
      "Supernova links design tokens, Figma libraries, and production code into a single source of truth for cross-functional engineering teams.",
    problemStatement:
      "Design systems fall out of sync between Figma specifications and code repositories, causing UI inconsistencies.",
    solution:
      "Automated token sync and component documentation generated directly from Git commits and design assets.",
    uniqueValue:
      "Automated export of design tokens into React, Tailwind, iOS, and Android styling formats.",
    websiteUrl: "https://supernova.io",
    logoUrl: null,
    githubUrl: null,
    categoryName: "Design",
    tags: ["Design Tools", "SaaS", "Design System"],
    platforms: ["Web", "Plugin", "CLI"],
    pricing: "Freemium",
    tier: "free",
    status: "approved",
    upvotesCount: 389,
    buildsCount: 112,
    commentsCount: 38,
    viewsCount: 4900,
    keywords:
      "supernova, design systems, design tokens, figma to code, ui components",
    targetAudience:
      "UI/UX designers, design system engineers, and frontend teams",
    asoCategory: "Design",
    aiContext:
      "Supernova is a design system management platform connecting Figma tokens to production code.",
  },
]

// ---------------------------------------------------------------------------
// Seed Products — developer-built apps (merged from old products + old builds)
// ---------------------------------------------------------------------------

const SEED_PRODUCTS: {
  name: string
  slug: string
  tagline: string
  description: string
  problemStatement?: string
  solution?: string
  uniqueValue?: string
  websiteUrl: string
  logoUrl: null
  githubUrl: string | null
  categoryName: string
  tags: string[]
  platforms: SeedPlatform[]
  pricing: "Free" | "Freemium" | "Paid" | "Open Source"
  tier: "free" | "premium" | "premium+"
  status: "approved" | "pending" | "rejected"
  builtWith: { name: string; toolSlug?: string }[]
  likesCount: number
  commentsCount: number
  viewsCount: number
  keywords?: string
  targetAudience?: string
  asoCategory?: string
  aiContext?: string
}[] = [
  {
    name: "MeetWave",
    slug: "meetwave",
    tagline: "Privacy-first AI meeting recorder for Windows",
    description:
      "MeetWave is an intelligent, privacy-first meeting assistant that runs locally on Windows. It records, transcribes, and summarizes meetings in real time without sending audio to third-party servers.",
    problemStatement:
      "Remote teams waste hours taking notes, and enterprise privacy policies often prohibit cloud-based meeting transcription bots from joining sensitive calls.",
    solution:
      "Local-first AI transcription and intelligent summarization using on-device inference and encrypted storage.",
    uniqueValue:
      "100% on-device AI transcription with zero audio retention in the cloud, compliant with strict enterprise compliance standards.",
    websiteUrl: "https://meetwave.dev",
    logoUrl: null,
    githubUrl: "https://github.com/meetwave/meetwave",
    categoryName: "AI",
    tags: ["AI", "Productivity", "Desktop"],
    platforms: ["Windows"],
    pricing: "Freemium",
    tier: "premium+",
    status: "approved",
    builtWith: [
      { name: "Vercel", toolSlug: "vercel" },
      { name: "Supabase", toolSlug: "supabase" },
    ],
    likesCount: 245,
    commentsCount: 24,
    viewsCount: 14442,
    keywords: "ai, transcription, meeting notes, privacy, windows, desktop",
    targetAudience:
      "Engineering leads, product managers, and privacy-conscious remote teams",
    asoCategory: "Productivity",
    aiContext:
      "MeetWave is a privacy-focused AI meeting recorder and transcription tool for Windows.",
  },
  {
    name: "Dreamstate",
    slug: "dreamstate",
    tagline: "AI Head of Growth Agents Across Every Channel",
    description:
      "Dreamstate deploys autonomous AI agents that analyze user funnels, generate high-converting copy, run multivariate tests, and automate outreach pipelines across social and email.",
    problemStatement:
      "Early-stage founders and small growth teams lack the bandwidth to run continuous marketing experiments across multiple acquisition channels.",
    solution:
      "Autonomous agents that identify drop-offs, compose personalized campaigns, and continuously optimize conversions.",
    uniqueValue:
      "Deep integration with modern analytics and CRM APIs, executing autonomous growth loops without manual intervention.",
    websiteUrl: "https://dreamstate.ai",
    logoUrl: null,
    githubUrl: null,
    categoryName: "Marketing",
    tags: ["Marketing", "AI", "Productivity"],
    platforms: ["Web", "API"],
    pricing: "Paid",
    tier: "premium",
    status: "approved",
    builtWith: [
      { name: "PostHog", toolSlug: "posthog" },
      { name: "Resend", toolSlug: "resend" },
      { name: "Vercel", toolSlug: "vercel" },
    ],
    likesCount: 182,
    commentsCount: 18,
    viewsCount: 11390,
    keywords:
      "ai marketing, growth hacking, automated outreach, conversion optimization",
    targetAudience: "Founders, growth leads, and marketing agencies",
    asoCategory: "Marketing",
    aiContext:
      "Dreamstate is an autonomous AI growth platform that runs marketing campaigns across channels.",
  },
  {
    name: "Distro",
    slug: "distro",
    tagline: "AI distribution operator for content and pipeline",
    description:
      "Distro automates multi-channel distribution for developer tools and SaaS products, turning technical blog posts and releases into engaging social content, newsletters, and community discussions.",
    problemStatement:
      "Developers build great products but struggle with consistent distribution and marketing across Hacker News, X, LinkedIn, and Reddit.",
    solution:
      "Automated cross-platform content syndication that adapts voice and formatting for each developer community.",
    uniqueValue:
      "Understands developer terminology and tech stacks to generate authentic technical content without sounding like generic marketing.",
    websiteUrl: "https://distro.dev",
    logoUrl: null,
    githubUrl: null,
    categoryName: "Marketing",
    tags: ["Marketing", "SaaS", "SEO Tools"],
    platforms: ["Web", "API"],
    pricing: "Freemium",
    tier: "free",
    status: "approved",
    builtWith: [
      { name: "Supabase", toolSlug: "supabase" },
      { name: "PostHog", toolSlug: "posthog" },
      { name: "Vercel", toolSlug: "vercel" },
    ],
    likesCount: 112,
    commentsCount: 12,
    viewsCount: 5200,
    keywords: "distro, developer marketing, content distribution, devrel, seo",
    targetAudience:
      "Developer-focused founders, DevRel teams, and technical marketers",
    asoCategory: "Marketing",
    aiContext:
      "Distro is an AI distribution platform designed for developer marketing and pipeline growth.",
  },
  {
    name: "Nexus Workspace",
    slug: "nexus-workspace",
    tagline: "AI-augmented research and documentation workspace",
    description:
      "An AI-augmented research and documentation workspace designed for fast-moving engineering teams. Combines smart note-taking, codebase search, and real-time collaboration.",
    problemStatement:
      "Engineering teams spend excessive time searching for context across scattered wikis, docs, and chat threads.",
    solution:
      "A unified workspace that indexes your codebase, docs, and chat history and surfaces the right context using AI.",
    uniqueValue:
      "Tight integration with GitHub and Slack, plus AI-powered context retrieval that works across your entire tech stack.",
    websiteUrl: "https://nexusworkspace.dev",
    logoUrl: null,
    githubUrl: null,
    categoryName: "Productivity",
    tags: ["AI", "Productivity", "Collaboration"],
    platforms: ["Web", "macOS", "Windows", "Linux"],
    pricing: "Freemium",
    tier: "premium+",
    status: "approved",
    builtWith: [
      { name: "Supabase", toolSlug: "supabase" },
      { name: "Vercel", toolSlug: "vercel" },
      { name: "Dodo Payments", toolSlug: "dodo-payments" },
    ],
    likesCount: 36,
    commentsCount: 8,
    viewsCount: 1240,
    keywords:
      "ai workspace, documentation, research tool, engineering productivity",
    targetAudience:
      "Engineering teams, technical writers, and developer-focused startups",
    asoCategory: "Productivity",
    aiContext:
      "Nexus Workspace is an AI-powered research and documentation platform for engineering teams.",
  },
  {
    name: "InvoiceAI",
    slug: "invoice-ai",
    tagline: "Automated invoicing and payment collection for developers",
    description:
      "Automated invoicing and payment collection platform built for freelance developers and contractors. Generates smart invoices, follows up on late payments, and reconciles accounts automatically.",
    problemStatement:
      "Freelance developers spend hours each month manually creating invoices, chasing late payments, and reconciling bank transactions.",
    solution:
      "AI that drafts invoices from project notes, schedules payment reminders, and automatically marks invoices as paid.",
    uniqueValue:
      "Understands developer project types and rates, with native integrations for GitHub commits and time-tracking tools.",
    websiteUrl: "https://invoiceai.dev",
    logoUrl: null,
    githubUrl: null,
    categoryName: "Finance",
    tags: ["Payments", "AI", "SaaS"],
    platforms: ["Web", "API"],
    pricing: "Freemium",
    tier: "premium",
    status: "approved",
    builtWith: [
      { name: "Stripe", toolSlug: "stripe" },
      { name: "PostHog", toolSlug: "posthog" },
      { name: "Resend", toolSlug: "resend" },
    ],
    likesCount: 28,
    commentsCount: 6,
    viewsCount: 980,
    keywords: "invoicing, payment collection, freelance developer, ai finance",
    targetAudience: "Freelance developers, contractors, and small dev agencies",
    asoCategory: "Finance",
    aiContext:
      "InvoiceAI automates invoicing and payment collection for freelance developers.",
  },
  {
    name: "ShipFast Boilerplate",
    slug: "shipfast-boilerplate",
    tagline: "Production Next.js SaaS starter kit",
    description:
      "Production-ready Next.js SaaS starter kit preconfigured with auth, payments, database, email, and SEO optimization. Launch your SaaS in days, not months.",
    problemStatement:
      "Building a SaaS from scratch requires weeks of boilerplate setup before writing a single line of business logic.",
    solution:
      "A fully configured production starter with auth, billing, DB, email, and analytics wired up and ready to go.",
    uniqueValue:
      "Opinionated stack selection (Supabase + Stripe + BetterAuth + Vercel) with real production patterns, not toy examples.",
    websiteUrl: "https://shipfa.st",
    logoUrl: null,
    githubUrl: null,
    categoryName: "Developer Tools",
    tags: ["Next.js", "SaaS", "Boilerplate"],
    platforms: ["Web", "CLI"],
    pricing: "Paid",
    tier: "premium+",
    status: "approved",
    builtWith: [
      { name: "Supabase", toolSlug: "supabase" },
      { name: "BetterAuth", toolSlug: "better-auth" },
      { name: "Stripe", toolSlug: "stripe" },
      { name: "Vercel", toolSlug: "vercel" },
    ],
    likesCount: 84,
    commentsCount: 14,
    viewsCount: 2150,
    keywords:
      "nextjs boilerplate, saas starter, shipfast, production nextjs, saas template",
    targetAudience: "Indie hackers, SaaS founders, and Next.js developers",
    asoCategory: "Developer Tools",
    aiContext:
      "ShipFast is a production-ready Next.js SaaS boilerplate with auth, payments, and database pre-configured.",
  },
  {
    name: "NoteFlow App",
    slug: "noteflow-app",
    tagline: "Local-first note-taking with end-to-end encryption",
    description:
      "Local-first note-taking and knowledge base with end-to-end encryption and fast markdown search. Your notes never leave your device unless you choose to sync.",
    problemStatement:
      "Cloud-based note apps can read your notes, suffer from outages, and require subscriptions for basic offline access.",
    solution:
      "A fully local-first app with optional encrypted sync, zero-knowledge architecture, and blazing-fast search.",
    uniqueValue:
      "Notes are stored locally in SQLite via TinyBase, with optional P2P sync that the server cannot decrypt.",
    websiteUrl: "https://noteflow.app",
    logoUrl: null,
    githubUrl: null,
    categoryName: "Productivity",
    tags: ["Productivity", "Local-First", "Open Source"],
    platforms: ["Web", "macOS", "Windows", "Linux", "iOS", "Android"],
    pricing: "Open Source",
    tier: "free",
    status: "approved",
    builtWith: [
      { name: "TinyBase", toolSlug: "tinybase" },
      { name: "Vercel", toolSlug: "vercel" },
    ],
    likesCount: 19,
    commentsCount: 5,
    viewsCount: 620,
    keywords:
      "local first notes, encrypted notes, markdown, offline notes, noteflow",
    targetAudience:
      "Privacy-conscious users, developers, and writers who prefer local-first tools",
    asoCategory: "Productivity",
    aiContext:
      "NoteFlow is a local-first, end-to-end encrypted note-taking app built on TinyBase.",
  },
]

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------

export const seedDatabase = async () => {
  console.log("🌱 Starting database seeding...")

  // 1. Find or create a system user
  const existingUsers = await db.select().from(users).limit(1)
  let authorUserId = existingUsers[0]?.id

  if (!authorUserId) {
    console.log("Creating default system user...")
    const [newUser] = await db
      .insert(users)
      .values({
        id: "system-admin-devstacks",
        name: "DevStacks Team",
        email: "team@devstacks.io",
        emailVerified: true,
      })
      .returning()
    authorUserId = newUser.id
  }

  console.log(`Using user ${authorUserId} for all seed entries.`)

  // 2. Seed Categories
  const allCategoryNames = [
    ...new Set([
      ...SEED_TOOLS.map((t) => t.categoryName),
      ...SEED_PRODUCTS.map((p) => p.categoryName),
    ]),
  ]

  const categoryMap = new Map<string, string>()

  for (const name of allCategoryNames) {
    const slug = slugify(name)
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1)

    if (existing.length > 0) {
      categoryMap.set(name, existing[0].id)
      console.log(`Category "${name}" already exists.`)
    } else {
      const [inserted] = await db
        .insert(categories)
        .values({ name, slug })
        .returning()
      categoryMap.set(name, inserted.id)
      console.log(`Inserted category "${name}" (${slug}).`)
    }
  }

  // 3. Seed Tools
  for (const toolData of SEED_TOOLS) {
    const { categoryName, ...rest } = toolData
    const categoryId = categoryMap.get(categoryName) ?? null

    const existing = await db
      .select({ id: tools.id })
      .from(tools)
      .where(eq(tools.slug, rest.slug))
      .limit(1)

    if (existing.length > 0) {
      console.log(`Tool "${rest.name}" already exists — updating...`)
      await db
        .update(tools)
        .set({
          ...rest,
          categoryId,
          submitterId: authorUserId,
          updatedAt: new Date(),
        })
        .where(eq(tools.id, existing[0].id))
    } else {
      console.log(`Inserting tool "${rest.name}"...`)
      await db
        .insert(tools)
        .values({ ...rest, categoryId, submitterId: authorUserId })
    }
  }

  // 4. Seed Products + Product-Tool links
  for (const productData of SEED_PRODUCTS) {
    const { categoryName, builtWith, ...rest } = productData
    const categoryId = categoryMap.get(categoryName) ?? null

    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, rest.slug))
      .limit(1)

    let productId: string

    if (existing.length > 0) {
      productId = existing[0].id
      console.log(`Product "${rest.name}" already exists — updating...`)
      await db
        .update(products)
        .set({
          ...rest,
          categoryId,
          submitterId: authorUserId,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId))

      await db
        .delete(productTools)
        .where(eq(productTools.productId, productId))
    } else {
      console.log(`Inserting product "${rest.name}"...`)
      const [inserted] = await db
        .insert(products)
        .values({ ...rest, categoryId, submitterId: authorUserId })
        .returning()
      productId = inserted.id
    }

    for (const bw of builtWith) {
      let toolId: string | null = null

      if (bw.toolSlug) {
        const [found] = await db
          .select({ id: tools.id })
          .from(tools)
          .where(eq(tools.slug, bw.toolSlug))
          .limit(1)
        toolId = found?.id ?? null
      }

      await db
        .insert(productTools)
        .values({ productId, toolId, name: bw.name })

      console.log(
        `  → Linked "${bw.name}" ${toolId ? "(with tool reference)" : "(name only)"}`
      )
    }
  }

  console.log("✅ Database seeding completed successfully!")
}

if (process.argv[1]?.endsWith("seed.ts")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seeding failed:", err)
      process.exit(1)
    })
}
