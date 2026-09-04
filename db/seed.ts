import "dotenv/config"
import { db } from "./index"
import { products, builds, buildProducts, users } from "./schema"
import { eq } from "drizzle-orm"

const SEED_PRODUCTS = [
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
    category: "AI",
    tags: ["AI", "Productivity", "Desktop"],
    platforms: ["Windows", "Desktop"],
    pricing: "Freemium" as const,
    tier: "premium+" as const,
    status: "approved" as const,
    upvotesCount: 1245,
    buildsCount: 142,
    commentsCount: 24,
    viewsCount: 14442,
    keywords: "ai, transcription, meeting notes, privacy, windows, desktop",
    targetAudience: "Engineering leads, product managers, and privacy-conscious remote teams",
    asoCategory: "Productivity",
    aiContext: "MeetWave is a privacy-focused AI meeting recorder and transcription tool for Windows.",
  },
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
    category: "Database",
    tags: ["Database", "BaaS", "Postgres", "Auth"],
    platforms: ["Cloud", "Web", "Self-Hosted"],
    pricing: "Freemium" as const,
    tier: "premium+" as const,
    status: "approved" as const,
    upvotesCount: 3840,
    buildsCount: 82,
    commentsCount: 94,
    viewsCount: 45600,
    keywords: "supabase, postgres, firebase alternative, baas, database, auth, realtime",
    targetAudience: "Full-stack developers, frontend engineers, and startup founders",
    asoCategory: "Developer Tools",
    aiContext: "Supabase is a complete backend platform featuring Postgres, Auth, APIs, and Vector embeddings.",
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
    category: "Payments",
    tags: ["Payments", "Billing", "SaaS", "API"],
    platforms: ["Web", "API", "Mobile"],
    pricing: "Paid" as const,
    tier: "premium" as const,
    status: "approved" as const,
    upvotesCount: 2950,
    buildsCount: 71,
    commentsCount: 68,
    viewsCount: 38200,
    keywords: "stripe, payments, billing, checkout, subscriptions, credit cards",
    targetAudience: "SaaS founders, e-commerce developers, and software platforms",
    asoCategory: "Finance",
    aiContext: "Stripe provides developer payment infrastructure, subscription billing, and merchant services.",
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
    category: "Infra",
    tags: ["Hosting", "Edge", "Next.js", "Serverless"],
    platforms: ["Cloud", "Web", "CLI"],
    pricing: "Freemium" as const,
    tier: "premium+" as const,
    status: "approved" as const,
    upvotesCount: 3120,
    buildsCount: 68,
    commentsCount: 76,
    viewsCount: 41000,
    keywords: "vercel, hosting, nextjs, serverless, edge computing, deployment",
    targetAudience: "Web developers, Next.js engineers, and frontend teams",
    asoCategory: "Developer Tools",
    aiContext: "Vercel is the frontend cloud platform for deploying and hosting modern web applications.",
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
    category: "Marketing",
    tags: ["Marketing", "AI", "Productivity"],
    platforms: ["Web", "API"],
    pricing: "Paid" as const,
    tier: "premium" as const,
    status: "approved" as const,
    upvotesCount: 982,
    buildsCount: 98,
    commentsCount: 18,
    viewsCount: 11390,
    keywords: "ai marketing, growth hacking, automated outreach, conversion optimization",
    targetAudience: "Founders, growth leads, and marketing agencies",
    asoCategory: "Marketing",
    aiContext: "Dreamstate is an autonomous AI growth platform that runs marketing campaigns across channels.",
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
    category: "Analytics",
    tags: ["Analytics", "Open Source", "Telemetry", "DevTools"],
    platforms: ["Cloud", "Self-Hosted", "Web"],
    pricing: "Freemium" as const,
    tier: "free" as const,
    status: "approved" as const,
    upvotesCount: 1840,
    buildsCount: 34,
    commentsCount: 38,
    viewsCount: 22000,
    keywords: "posthog, analytics, session replay, feature flags, ab testing, open source",
    targetAudience: "Product engineers, growth teams, and privacy-conscious founders",
    asoCategory: "Developer Tools",
    aiContext: "PostHog is an open-source product analytics and developer telemetry platform.",
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
    category: "Auth",
    tags: ["Auth", "Security", "TypeScript", "Next.js"],
    platforms: ["Web", "API"],
    pricing: "Open Source" as const,
    tier: "premium" as const,
    status: "approved" as const,
    upvotesCount: 1420,
    buildsCount: 28,
    commentsCount: 32,
    viewsCount: 18500,
    keywords: "better auth, authentication, oauth, typescript, drizzle, nextjs auth",
    targetAudience: "TypeScript developers, full-stack Next.js builders, and SaaS architects",
    asoCategory: "Developer Tools",
    aiContext: "Better Auth is an open-source, type-safe authentication library for TypeScript applications.",
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
    category: "Payments",
    tags: ["Payments", "API", "Billing", "Tax"],
    platforms: ["Web", "API"],
    pricing: "Freemium" as const,
    tier: "free" as const,
    status: "approved" as const,
    upvotesCount: 920,
    buildsCount: 37,
    commentsCount: 19,
    viewsCount: 12400,
    keywords: "dodo payments, merchant of record, saas billing, sales tax, vat, ai billing",
    targetAudience: "Global software founders, indie hackers, and AI developers",
    asoCategory: "Finance",
    aiContext: "Dodo Payments is a Merchant of Record simplifying global sales tax and payments for SaaS.",
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
    category: "Database",
    tags: ["Database", "Local-First", "Reactive", "Open Source"],
    platforms: ["Web", "Desktop", "Mobile"],
    pricing: "Open Source" as const,
    tier: "free" as const,
    status: "approved" as const,
    upvotesCount: 760,
    buildsCount: 22,
    commentsCount: 14,
    viewsCount: 9800,
    keywords: "tinybase, local-first, reactive store, crdt, sqlite sync, state management",
    targetAudience: "Frontend engineers building offline-first and collaborative applications",
    asoCategory: "Developer Tools",
    aiContext: "TinyBase is a reactive data store designed specifically for local-first and offline-capable applications.",
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
    category: "Email",
    tags: ["Email", "API", "React", "Developer Tools"],
    platforms: ["Web", "API"],
    pricing: "Freemium" as const,
    tier: "free" as const,
    status: "approved" as const,
    upvotesCount: 1650,
    buildsCount: 29,
    commentsCount: 22,
    viewsCount: 21000,
    keywords: "resend, transactional email, react email, email api, deliverability",
    targetAudience: "Web developers, SaaS founders, and engineering teams",
    asoCategory: "Developer Tools",
    aiContext: "Resend is a modern developer email platform powered by React Email.",
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
    category: "Marketing",
    tags: ["Marketing", "SaaS", "SEO Tools"],
    platforms: ["Web", "API"],
    pricing: "Freemium" as const,
    tier: "free" as const,
    status: "approved" as const,
    upvotesCount: 412,
    buildsCount: 54,
    commentsCount: 12,
    viewsCount: 5200,
    keywords: "distro, developer marketing, content distribution, devrel, seo",
    targetAudience: "Developer-focused founders, DevRel teams, and technical marketers",
    asoCategory: "Marketing",
    aiContext: "Distro is an AI distribution platform designed for developer marketing and pipeline growth.",
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
    category: "Design",
    tags: ["Design Tools", "SaaS", "Design System"],
    platforms: ["Web", "Figma", "CLI"],
    pricing: "Freemium" as const,
    tier: "free" as const,
    status: "approved" as const,
    upvotesCount: 389,
    buildsCount: 112,
    commentsCount: 38,
    viewsCount: 4900,
    keywords: "supernova, design systems, design tokens, figma to code, ui components",
    targetAudience: "UI/UX designers, design system engineers, and frontend teams",
    asoCategory: "Design",
    aiContext: "Supernova is a design system management platform connecting Figma tokens to production code.",
  },
]

const SEED_BUILDS = [
  {
    name: "Nexus Workspace",
    description: "An AI-augmented research and documentation workspace designed for fast-moving engineering teams.",
    logoText: "NX",
    logoBg: "bg-slate-900 text-cyan-400",
    tier: "premium+" as const,
    viewsCount: 1240,
    likesCount: 36,
    productSlugs: ["supabase", "vercel", "dodo-payments"],
  },
  {
    name: "InvoiceAI",
    description: "Automated invoicing and payment collection platform built for freelance developers and contractors.",
    logoText: "IA",
    logoBg: "bg-indigo-100 text-indigo-500",
    tier: "premium" as const,
    viewsCount: 980,
    likesCount: 28,
    productSlugs: ["stripe", "posthog", "resend"],
  },
  {
    name: "ShipFast Boilerplate",
    description: "Production Next.js SaaS starter kit preconfigured with auth, payments, database, and SEO optimization.",
    logoText: "SF",
    logoBg: "bg-teal-500 text-white",
    tier: "premium+" as const,
    viewsCount: 2150,
    likesCount: 84,
    productSlugs: ["supabase", "better-auth", "stripe", "vercel"],
  },
  {
    name: "NoteFlow App",
    description: "Local-first note-taking and knowledge base with end-to-end encryption and fast markdown search.",
    logoText: "NF",
    logoBg: "bg-rose-100 text-rose-500",
    tier: "free" as const,
    viewsCount: 620,
    likesCount: 19,
    productSlugs: ["tinybase", "vercel"],
  },
]

export const seedDatabase = async () => {
  console.log("🌱 Starting database seeding...")

  // 1. Find or pick an existing user for submitter/author
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

  console.log(`Using user ${authorUserId} for submitted products and builds.`)

  // 2. Insert Products
  const createdProductsMap: Record<string, string> = {}

  for (const productData of SEED_PRODUCTS) {
    const existing = await db
      .select({ id: products.id, slug: products.slug })
      .from(products)
      .where(eq(products.slug, productData.slug))
      .limit(1)

    if (existing.length > 0) {
      console.log(`Product "${productData.name}" already exists (${existing[0].id}). Updating...`)
      await db
        .update(products)
        .set({
          ...productData,
          submitterId: authorUserId,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existing[0].id))
      createdProductsMap[productData.slug] = existing[0].id
    } else {
      console.log(`Inserting product "${productData.name}"...`)
      const [newProduct] = await db
        .insert(products)
        .values({
          ...productData,
          submitterId: authorUserId,
        })
        .returning()
      createdProductsMap[productData.slug] = newProduct.id
    }
  }

  // 3. Insert Builds and link to products
  for (const buildData of SEED_BUILDS) {
    const { productSlugs, ...buildFields } = buildData

    // Check if build with this name already exists
    const existingBuild = await db
      .select({ id: builds.id })
      .from(builds)
      .where(eq(builds.name, buildFields.name))
      .limit(1)

    let buildId: string

    if (existingBuild.length > 0) {
      buildId = existingBuild[0].id
      console.log(`Build "${buildFields.name}" already exists (${buildId}). Updating...`)
      await db
        .update(builds)
        .set({
          ...buildFields,
          authorId: authorUserId,
          updatedAt: new Date(),
        })
        .where(eq(builds.id, buildId))
    } else {
      console.log(`Inserting build "${buildFields.name}"...`)
      const [newBuild] = await db
        .insert(builds)
        .values({
          ...buildFields,
          authorId: authorUserId,
        })
        .returning()
      buildId = newBuild.id
    }

    // Link products
    for (const slug of productSlugs) {
      const prodId = createdProductsMap[slug]
      if (prodId) {
        await db
          .insert(buildProducts)
          .values({
            buildId,
            productId: prodId,
          })
          .onConflictDoNothing()
          .catch(() => {})
      }
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
