import "dotenv/config"
import { db } from "./index"
import {
  tools,
  users,
  categories,
  toolFaqs,
  launches,
} from "./schema"
import { eq, or, ilike } from "drizzle-orm"

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

type SeedPricing = "Free" | "Freemium" | "Paid" | "Open Source"
type SeedTier = "free" | "premium" | "premium+"

interface SeedFaq {
  question: string
  answer: string
}

interface SeedToolDefinition {
  name: string
  slug: string
  tagline: string
  description: string
  problemStatement: string
  solution: string
  uniqueValue: string
  websiteUrl: string
  githubUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
  discordUrl?: string
  useCases: string
  keywords: string
  targetAudience: string
  metaTitle: string
  metaDescription: string
  aiContext: string
  categoryName: string
  categorySlug: string
  tags: string[]
  platforms: SeedPlatform[]
  pricing: SeedPricing
  tier: SeedTier
  faqs: SeedFaq[]
}

const LAUNCHNESTS_FAVICON = "https://launchnests.com/favicon.ico"
const LAUNCHNESTS_USER_ID = "user_launchnests"

const getCleanDomain = (websiteUrl?: string | null): string | null => {
  if (!websiteUrl) return null
  try {
    const trimmed = websiteUrl.trim()
    if (!trimmed) return null
    const raw =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`
    const parsed = new URL(raw)
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase()
    if (!hostname || !hostname.includes(".")) return null
    return hostname
  } catch {
    return null
  }
}

const getFaviconUrl = (websiteUrl?: string | null): string => {
  const domain = getCleanDomain(websiteUrl)
  if (!domain) return LAUNCHNESTS_FAVICON
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

const getISOWeekDetails = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  const year = d.getUTCFullYear()

  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const startOfWeek1 = new Date(jan4)
  startOfWeek1.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1)

  const startDate = new Date(startOfWeek1)
  startDate.setUTCDate(startOfWeek1.getUTCDate() + (week - 1) * 7)
  startDate.setUTCHours(0, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setUTCDate(startDate.getUTCDate() + 6)
  endDate.setUTCHours(23, 59, 59, 999)

  return { year, week, startDate, endDate }
}

const seedToolsData: SeedToolDefinition[] = [
  {
    name: "Next.js",
    slug: "nextjs",
    tagline: "The React Framework for the Web",
    description:
      "Next.js by Vercel enables developers to create full-stack web applications by extending the latest React features, including React Server Components, App Router, automatic image optimization, and lightning-fast Turbopack compilation.",
    problemStatement:
      "Building scalable, SEO-optimized React applications traditionally required assembling complex build pipelines, routing systems, SSR servers, and client hydration strategies from scratch.",
    solution:
      "Next.js provides an integrated full-stack framework featuring zero-config hybrid rendering (SSR, SSG, ISR), nested layouts, server actions, and edge runtime deployment out of the box.",
    uniqueValue:
      "Unified frontend and backend architecture with React Server Components, automatic caching, and seamless optimization for zero-latency serverless edge environments.",
    websiteUrl: "https://nextjs.org",
    githubUrl: "https://github.com/vercel/next.js",
    twitterUrl: "https://twitter.com/nextjs",
    linkedinUrl: "https://linkedin.com/company/vercel",
    discordUrl: "https://discord.gg/nextjs",
    useCases:
      "Production e-commerce storefronts, SaaS web apps, multi-tenant dashboards, high-traffic marketing portals, and AI agent web interfaces.",
    keywords:
      "react, framework, nextjs, ssr, server components, turbopack, vercel, fullstack, web development",
    targetAudience:
      "Full-stack engineers, React developers, frontend architects, and engineering teams.",
    metaTitle: "Next.js - The React Framework for the Web | LaunchNests",
    metaDescription:
      "Next.js is the leading React framework for building high-performance web applications with Server Components, App Router, and built-in optimization.",
    aiContext:
      "Next.js is an open-source React framework created by Vercel. It supports static site generation, server-side rendering, incremental static regeneration, and server actions, widely used for production full-stack TypeScript and JavaScript applications.",
    categoryName: "Frameworks",
    categorySlug: "frameworks",
    tags: ["react", "framework", "ssr", "typescript", "fullstack", "server-components"],
    platforms: ["Web", "Cloud", "Self-Hosted"],
    pricing: "Open Source",
    tier: "premium+",
    faqs: [
      {
        question: "Can I deploy Next.js anywhere or only on Vercel?",
        answer:
          "While Vercel offers an optimized zero-configuration deployment experience, Next.js can be self-hosted via Docker containers, Node.js servers, or on AWS, GCP, and Azure.",
      },
      {
        question: "What is the difference between Pages Router and App Router?",
        answer:
          "The App Router leverages React Server Components, nested layouts, parallel routes, and streaming responses, whereas the legacy Pages Router relied on getStaticProps and getServerSideProps.",
      },
    ],
  },
  {
    name: "Supabase",
    slug: "supabase",
    tagline: "The Open Source Firebase Alternative",
    description:
      "Supabase provides an open-source suite of backend services built around PostgreSQL, offering instant REST and GraphQL APIs, real-time database subscriptions, authentication, storage, vector embeddings with pgvector, and serverless edge functions.",
    problemStatement:
      "Developers spend countless hours writing repetitive boilerplate for database migrations, authentication systems, file storage, and real-time socket connections.",
    solution:
      "Supabase gives every developer a dedicated, production-ready PostgreSQL database paired with instant auto-generated APIs, row-level security, auth primitives, and real-time syncing.",
    uniqueValue:
      "Complete open-source Firebase alternative with zero vendor lock-in, full PostgreSQL capability, native pgvector for AI workflows, and granular Row Level Security (RLS).",
    websiteUrl: "https://supabase.com",
    githubUrl: "https://github.com/supabase/supabase",
    twitterUrl: "https://twitter.com/supabase",
    linkedinUrl: "https://linkedin.com/company/supabase",
    discordUrl: "https://discord.gg/supabase",
    useCases:
      "SaaS backend, real-time chat applications, mobile app data sync, AI vector search and embeddings storage, and rapid MVP development.",
    keywords:
      "supabase, postgresql, firebase alternative, backend as a service, pgvector, auth, realtime database",
    targetAudience:
      "Full-stack developers, mobile engineers, indie hackers, and AI application builders.",
    metaTitle: "Supabase - Open Source Firebase Alternative | LaunchNests",
    metaDescription:
      "Build production apps fast with Supabase: dedicated Postgres database, real-time subscriptions, authentication, storage, and serverless functions.",
    aiContext:
      "Supabase is an open-source Backend-as-a-Service (BaaS) company built on PostgreSQL. It provides Postgres database hosting, instant APIs via PostgREST, user authentication with GoTrue, real-time WebSockets, and pgvector extension for AI embeddings.",
    categoryName: "Databases",
    categorySlug: "databases",
    tags: ["postgres", "database", "baas", "firebase-alternative", "auth", "realtime"],
    platforms: ["Cloud", "Self-Hosted", "API"],
    pricing: "Freemium",
    tier: "premium+",
    faqs: [
      {
        question: "Is Supabase strictly compatible with standard PostgreSQL?",
        answer:
          "Yes, every Supabase project is a genuine PostgreSQL database with full superuser privileges, compatible with standard tools like psql, Drizzle, and Prisma.",
      },
      {
        question: "How does Supabase handle data security?",
        answer:
          "Supabase uses PostgreSQL Row Level Security (RLS) policies to validate user tokens and restrict row access directly at the database engine layer.",
      },
    ],
  },
  {
    name: "Docker",
    slug: "docker",
    tagline: "Accelerate How You Build, Share, and Run Applications",
    description:
      "Docker is the industry-standard containerization platform that allows developers to package applications and their dependencies into lightweight, isolated containers that run reliably across development, staging, and cloud production environments.",
    problemStatement:
      "The classic 'it works on my machine' bug where subtle differences between developer environments, operating systems, and production runtimes cause catastrophic deployment failures.",
    solution:
      "Docker encapsulates application code, system libraries, configuration files, and runtime binaries into deterministic images that execute uniformly anywhere.",
    uniqueValue:
      "Standardized container runtime with millions of pre-built images on Docker Hub, multi-architecture builds, and Docker Compose for local multi-service orchestration.",
    websiteUrl: "https://www.docker.com",
    githubUrl: "https://github.com/docker",
    twitterUrl: "https://twitter.com/docker",
    linkedinUrl: "https://linkedin.com/company/docker",
    discordUrl: "https://discord.gg/docker",
    useCases:
      "Local development environment parity, microservice architecture, CI/CD pipeline artifact testing, and cloud container deployments on Kubernetes or ECS.",
    keywords:
      "docker, containers, devops, docker compose, microservices, containerization, kubernetes",
    targetAudience:
      "DevOps engineers, backend developers, system administrators, and software architects.",
    metaTitle: "Docker - Accelerate How You Build & Run Apps | LaunchNests",
    metaDescription:
      "Docker container technology eliminates deployment discrepancies by packaging apps into portable, isolated container images.",
    aiContext:
      "Docker is a containerization technology that enables developers to automate the deployment of applications inside software containers. It provides Docker Desktop, Docker Engine, Docker Hub, and Docker Compose.",
    categoryName: "DevOps & Containers",
    categorySlug: "devops-containers",
    tags: ["containers", "devops", "docker", "microservices", "infrastructure"],
    platforms: ["macOS", "Windows", "Linux", "CLI"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "How does a container differ from a virtual machine?",
        answer:
          "Containers share the host operating system kernel and isolate processes in user space, making them orders of magnitude lighter, faster to boot, and less resource-heavy than VMs.",
      },
      {
        question: "What is Docker Compose?",
        answer:
          "Docker Compose is a tool for defining and running multi-container Docker applications using a single YAML file to coordinate database, web server, and cache dependencies.",
      },
    ],
  },
  {
    name: "Vercel",
    slug: "vercel",
    tagline: "Develop. Preview. Ship.",
    description:
      "Vercel is the frontend cloud platform designed for modern web developers, providing instant global edge deployments, automatic branch preview environments, zero-configuration Next.js hosting, serverless functions, and real-time Web Analytics.",
    problemStatement:
      "Managing cloud servers, CI/CD configurations, SSL certificates, edge CDN caches, and DNS routing distracts engineering teams from building product features.",
    solution:
      "Vercel turns every git push into an immutable, global production or preview deployment in seconds, managing edge infrastructure, CDN routing, and serverless compute invisibly.",
    uniqueValue:
      "Unrivaled Next.js optimization, atomic git-driven preview URLs with collaborative commenting, and Edge Middleware running close to users with single-digit millisecond latency.",
    websiteUrl: "https://vercel.com",
    githubUrl: "https://github.com/vercel",
    twitterUrl: "https://twitter.com/vercel",
    linkedinUrl: "https://linkedin.com/company/vercel",
    discordUrl: "https://discord.gg/vercel",
    useCases:
      "Frontend hosting, Jamstack web apps, Next.js serverless backends, edge AI inference streaming, and continuous team collaboration via preview branches.",
    keywords:
      "vercel, frontend cloud, nextjs hosting, serverless, edge computing, ci cd, web deployment",
    targetAudience:
      "Frontend engineers, full-stack builders, SaaS founders, and enterprise engineering teams.",
    metaTitle: "Vercel - Frontend Cloud for Modern Web Teams | LaunchNests",
    metaDescription:
      "Deploy web applications instantly with Vercel. Global edge network, automatic preview URLs, and first-class Next.js optimizations.",
    aiContext:
      "Vercel is a cloud platform for static sites and Serverless Functions that pairs seamlessly with modern frontend workflows. It is the creator and maintainer of Next.js.",
    categoryName: "Hosting & Deployment",
    categorySlug: "hosting-deployment",
    tags: ["hosting", "cloud", "vercel", "serverless", "edge", "nextjs"],
    platforms: ["Web", "Cloud", "CLI"],
    pricing: "Freemium",
    tier: "premium+",
    faqs: [
      {
        question: "Can I use Vercel with frameworks other than Next.js?",
        answer:
          "Yes, Vercel natively supports Astro, SvelteKit, Remix, Vite, Nuxt, Gatsby, Angular, and static HTML websites.",
      },
      {
        question: "What are Vercel Preview Deployments?",
        answer:
          "Every pull request or branch push creates a unique, shareable URL with built-in commenting tools so stakeholders can test changes before merging to production.",
      },
    ],
  },
  {
    name: "Stripe",
    slug: "stripe",
    tagline: "Financial Infrastructure for the Internet",
    description:
      "Stripe provides developer-first financial infrastructure, APIs, and SDKs for internet commerce, enabling businesses from startup to Fortune 500 to accept payments, manage recurring subscriptions, send global payouts, and prevent fraudulent transactions.",
    problemStatement:
      "Integrating payment processors traditionally required arduous merchant account paperwork, rigid protocols, compliance overhead, and fragmented global currency support.",
    solution:
      "Stripe offers elegant REST APIs, client libraries in every programming language, pre-built hosted Checkout pages, and Stripe Elements for frictionless payment collection.",
    uniqueValue:
      "Battle-tested 99.999% uptime, global compliance (PCI-DSS Level 1), automated tax calculation via Stripe Tax, smart retries with machine learning, and Radar fraud detection.",
    websiteUrl: "https://stripe.com",
    githubUrl: "https://github.com/stripe",
    twitterUrl: "https://twitter.com/stripe",
    linkedinUrl: "https://linkedin.com/company/stripe",
    discordUrl: "https://discord.gg/stripe",
    useCases:
      "SaaS recurring billing, e-commerce checkout, two-sided marketplaces with Stripe Connect, usage-based metered billing, and cross-border invoicing.",
    keywords:
      "stripe, payments, billing, credit card processing, saas subscriptions, payment gateway, checkout",
    targetAudience:
      "SaaS founders, e-commerce developers, payment architects, and finance engineers.",
    metaTitle: "Stripe - Financial Infrastructure for the Internet | LaunchNests",
    metaDescription:
      "Stripe payment APIs empower developers to accept global credit cards, digital wallets, and recurring subscriptions with minimal code.",
    aiContext:
      "Stripe is an Irish-American financial services and software-as-a-service company that offers payment processing software and application programming interfaces for e-commerce websites and mobile applications.",
    categoryName: "Payments",
    categorySlug: "payments",
    tags: ["payments", "billing", "fintech", "stripe", "subscriptions", "api"],
    platforms: ["Web", "API", "iOS", "Android"],
    pricing: "Paid",
    tier: "premium+",
    faqs: [
      {
        question: "What is the easiest way to integrate Stripe into a Next.js application?",
        answer:
          "Stripe Checkout provides a hosted, conversion-optimized checkout page that requires only a server-side session creation and client redirect.",
      },
      {
        question: "Does Stripe support recurring subscriptions out of the box?",
        answer:
          "Yes, Stripe Billing handles recurring intervals, trials, pro-ration, usage-based metering, and automatic customer portal management.",
      },
    ],
  },
  {
    name: "Dodo Payments",
    slug: "dodo-payments",
    tagline: "Merchant of Record for Global Software Sales & AI Products",
    description:
      "Dodo Payments acts as a modern Merchant of Record (MoR) built specifically for SaaS, AI agents, and digital products, handling global sales tax, VAT, compliance, chargebacks, and checkout flows so founders can sell worldwide instantly.",
    problemStatement:
      "Selling software globally forces developers to register for sales tax in multiple jurisdictions, navigate EU VAT MOSS, comply with localized financial regulations, and manage multi-currency fraud.",
    solution:
      "Dodo Payments serves as the legal Merchant of Record, automatically calculating and remitting global taxes, providing localized payment methods, and managing fraud.",
    uniqueValue:
      "Built for modern developer stacks with native Next.js and Node.js SDKs, usage-based metering for AI tokens, zero tax headache, and instant worldwide payout support.",
    websiteUrl: "https://dodopayments.com",
    githubUrl: "https://github.com/dodopayments",
    twitterUrl: "https://twitter.com/dodopayments",
    linkedinUrl: "https://linkedin.com/company/dodopayments",
    discordUrl: "https://discord.gg/dodopayments",
    useCases:
      "Global SaaS subscriptions, AI API pay-per-use token monetization, digital goods sales, and developer tool licensing without sales tax exposure.",
    keywords:
      "dodo payments, merchant of record, saas billing, mor, vat compliance, global payments, ai payments",
    targetAudience:
      "Indie hackers, SaaS founders, AI startup creators, and software vendors selling internationally.",
    metaTitle: "Dodo Payments - Merchant of Record for Global Software | LaunchNests",
    metaDescription:
      "Sell software, SaaS, and AI products globally with Dodo Payments. Built-in sales tax calculation, VAT remittance, and effortless developer integration.",
    aiContext:
      "Dodo Payments is a Merchant of Record platform designed for modern SaaS and digital product creators, taking on legal financial liability, global tax compliance, and multi-currency billing.",
    categoryName: "Payments",
    categorySlug: "payments",
    tags: ["payments", "merchant-of-record", "saas", "fintech", "tax-compliance", "billing"],
    platforms: ["Web", "API", "Cloud"],
    pricing: "Paid",
    tier: "premium+",
    faqs: [
      {
        question: "How does a Merchant of Record (MoR) differ from a standard payment gateway?",
        answer:
          "A standard gateway only routes money, leaving you legally liable for filing and paying global taxes. An MoR sells on your behalf, taking full legal liability for VAT, sales tax, and fraud.",
      },
      {
        question: "Can I use Dodo Payments with Next.js?",
        answer:
          "Yes, Dodo Payments provides the official @dodopayments/nextjs package with streamlined server-side checkout session creation and webhook handling.",
      },
    ],
  },
  {
    name: "PostgreSQL",
    slug: "postgresql",
    tagline: "The World's Most Advanced Open Source Relational Database",
    description:
      "PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development that has earned a strong reputation for reliability, feature robustness, and performance.",
    problemStatement:
      "Applications need rock-solid ACID transactions, complex relational modeling, rich data types, and massive scalability without restrictive proprietary licensing.",
    solution:
      "PostgreSQL delivers enterprise-grade SQL compliance, extensible indexing (B-Tree, GiST, GIN, BRIN), JSONB document storage, and foreign data wrappers.",
    uniqueValue:
      "Massive ecosystem of extensions like pgvector, PostGIS, and TimescaleDB, unmatched data integrity guarantees, and open-source freedom.",
    websiteUrl: "https://www.postgresql.org",
    githubUrl: "https://github.com/postgres/postgres",
    twitterUrl: "https://twitter.com/postgresql",
    useCases:
      "Core transactional backends, geospatial processing, vector search, time-series analysis, and enterprise OLTP data storage.",
    keywords:
      "postgres, sql, database, relational, open-source, acid, pgvector, jsonb",
    targetAudience:
      "Backend developers, database administrators, system architects, and software engineers.",
    metaTitle: "PostgreSQL - Advanced Open Source Relational Database | LaunchNests",
    metaDescription:
      "PostgreSQL is the gold standard open-source relational database, offering ACID compliance, JSONB, and rich extensibility.",
    aiContext:
      "PostgreSQL is a free and open-source relational database management system emphasizing extensibility and SQL compliance. Widely used for web applications, analytics, and AI vector stores via pgvector.",
    categoryName: "Databases",
    categorySlug: "databases",
    tags: ["postgres", "sql", "database", "relational", "open-source", "acid"],
    platforms: ["Linux", "macOS", "Windows", "Self-Hosted", "Cloud"],
    pricing: "Open Source",
    tier: "premium",
    faqs: [
      {
        question: "Can PostgreSQL store JSON documents efficiently?",
        answer:
          "Yes, PostgreSQL features native JSONB storage with binary parsing and GIN indexing, offering document-store speeds alongside relational queries.",
      },
      {
        question: "What is pgvector?",
        answer:
          "pgvector is an open-source extension for PostgreSQL that enables vector similarity search for AI embeddings directly within SQL.",
      },
    ],
  },
  {
    name: "Redis",
    slug: "redis",
    tagline: "The Open Source In-Memory Data Store",
    description:
      "Redis is an ultra-fast, in-memory data structure store used as a distributed database, cache, message broker, and streaming engine with sub-millisecond response times.",
    problemStatement:
      "Disk-backed databases struggle with high-throughput ephemeral operations like user sessions, rate limiting, leaderboards, and real-time pub/sub messaging.",
    solution:
      "Redis holds all operational data in memory while asynchronously persisting to disk, providing atomic operations on strings, hashes, lists, sets, and sorted sets.",
    uniqueValue:
      "Sub-millisecond latency, versatile in-memory data structures, built-in pub/sub, clustering, and lua scripting capabilities.",
    websiteUrl: "https://redis.io",
    githubUrl: "https://github.com/redis/redis",
    twitterUrl: "https://twitter.com/redisinc",
    useCases:
      "High-speed caching, user session storage, API rate limiting, real-time message queuing, and live leaderboard rankings.",
    keywords:
      "redis, cache, in-memory, database, pubsub, nosql, rate-limiting, session-store",
    targetAudience:
      "Backend developers, cloud architects, DevOps engineers, and high-scale web engineers.",
    metaTitle: "Redis - The In-Memory Data Store & Cache | LaunchNests",
    metaDescription:
      "Power lightning-fast caching, rate-limiting, and real-time streaming with Redis in-memory data structures.",
    aiContext:
      "Redis is an in-memory data structure project implementing a distributed, in-memory key-value database with optional durability. Widely used for caching, queues, and pub/sub.",
    categoryName: "Databases",
    categorySlug: "databases",
    tags: ["redis", "cache", "in-memory", "database", "pubsub", "nosql"],
    platforms: ["Cloud", "Self-Hosted", "Linux"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "Does Redis persist data to disk?",
        answer:
          "Yes, Redis supports both RDB point-in-time snapshots and AOF (Append Only File) logging for durability without sacrificing in-memory read speeds.",
      },
      {
        question: "What are the most common Redis use cases in modern apps?",
        answer:
          "Session caching, rate limiting with sliding windows, real-time pub/sub notifications, and caching expensive database query results.",
      },
    ],
  },
  {
    name: "Tailwind CSS",
    slug: "tailwind-css",
    tagline: "A Utility-First CSS Framework for Rapid UI Development",
    description:
      "Tailwind CSS provides low-level utility classes that let you build custom designs directly in your markup without leaving your HTML, compiled into ultra-compact production CSS.",
    problemStatement:
      "Writing custom CSS leads to bloated stylesheets, specificity wars, unintended cascading side effects, and naming fatigue.",
    solution:
      "Compose designs using standardized utility classes directly on HTML elements, compiled on demand using an efficient JIT compiler.",
    uniqueValue:
      "Unmatched developer velocity, zero dead CSS code in production, and arbitrary value syntax with complete theme customizability.",
    websiteUrl: "https://tailwindcss.com",
    githubUrl: "https://github.com/tailwindlabs/tailwindcss",
    twitterUrl: "https://twitter.com/tailwindcss",
    useCases:
      "Rapid component prototyping, production web design systems, mobile-responsive layouts, and dark mode theming.",
    keywords:
      "tailwind, css, utility-first, styling, frontend, responsive-design, design-system",
    targetAudience:
      "Frontend developers, UI/UX designers who code, React/Vue developers, and full-stack engineers.",
    metaTitle: "Tailwind CSS - Utility-First CSS Framework | LaunchNests",
    metaDescription:
      "Build modern user interfaces rapidly without writing custom CSS with Tailwind CSS utility classes.",
    aiContext:
      "Tailwind CSS is an open-source utility-first CSS framework. It provides classes for flexing, positioning, colors, borders, and responsive design, generating minimal CSS at build time.",
    categoryName: "CSS & Styling",
    categorySlug: "css-styling",
    tags: ["css", "styling", "tailwind", "ui", "design-system", "frontend"],
    platforms: ["Web", "CLI", "Plugin"],
    pricing: "Open Source",
    tier: "premium",
    faqs: [
      {
        question: "Does Tailwind CSS cause HTML to look messy?",
        answer:
          "While class lists can be long, utility classes eliminate CSS context-switching and prevent naming collision bugs across large components.",
      },
      {
        question: "How small is the production CSS file?",
        answer:
          "Tailwind scans your template files and only outputs the exact classes you actually use, typically resulting in production CSS under 15KB.",
      },
    ],
  },
  {
    name: "Drizzle ORM",
    slug: "drizzle-orm",
    tagline: "TypeScript ORM That Feels Like Writing SQL",
    description:
      "Drizzle ORM is a lightweight, blazing-fast TypeScript object-relational mapping tool that provides type-safety, zero dependencies, and an intuitive SQL-like API.",
    problemStatement:
      "Traditional ORMs have heavy runtime overhead, generate inefficient SQL queries, and abstract database mechanics too far from standard SQL.",
    solution:
      "Drizzle defines schemas purely in TypeScript, generates minimal SQL query output with zero overhead, and runs in serverless/edge environments seamlessly.",
    uniqueValue:
      "Zero runtime overhead, SQL-like query builder, automatic type inference, first-class migration tooling with Drizzle Kit, and edge runtime compatibility.",
    websiteUrl: "https://orm.drizzle.team",
    githubUrl: "https://github.com/drizzle-team/drizzle-orm",
    twitterUrl: "https://twitter.com/drizzleorm",
    discordUrl: "https://discord.gg/drizzle",
    useCases:
      "Type-safe database queries in Next.js Server Components, serverless APIs on Cloudflare Workers, and clean relational schema migrations.",
    keywords:
      "drizzle orm, typescript orm, sql, postgresql, serverless database, type-safe sql, drizzle-kit",
    targetAudience:
      "TypeScript engineers, Next.js developers, backend builders, and database architects.",
    metaTitle: "Drizzle ORM - Type-Safe SQL in TypeScript | LaunchNests",
    metaDescription:
      "Drizzle ORM gives you complete type safety with zero runtime overhead, feeling just like writing SQL.",
    aiContext:
      "Drizzle ORM is a TypeScript ORM for SQL databases (PostgreSQL, MySQL, SQLite) designed for serverless, edge runtimes, and traditional Node.js servers, pairing pure TypeScript schema definitions with SQL query output.",
    categoryName: "ORM & Database Tools",
    categorySlug: "orm-database-tools",
    tags: ["orm", "typescript", "sql", "postgres", "drizzle", "database"],
    platforms: ["CLI", "Cloud", "API"],
    pricing: "Open Source",
    tier: "premium+",
    faqs: [
      {
        question: "Can Drizzle ORM run on edge environments like Cloudflare Workers?",
        answer:
          "Yes, Drizzle has zero external binary dependencies and minimal bundle footprint, making it ideal for edge and serverless runtimes.",
      },
      {
        question: "How does Drizzle Kit handle migrations?",
        answer:
          "Drizzle Kit automatically compares your TypeScript schema files against your database to generate safe SQL migration scripts.",
      },
    ],
  },
  {
    name: "Prisma",
    slug: "prisma",
    tagline: "Next-Generation Node.js and TypeScript ORM",
    description:
      "Prisma is an open-source database toolkit consisting of Prisma Client (type-safe auto-generated query builder), Prisma Migrate, and Prisma Studio visual data browser.",
    problemStatement:
      "Manual database querying in Node.js leads to syntax errors, mismatched typings, and cumbersome migration coordination across teams.",
    solution:
      "A declarative modeling language (schema.prisma) that auto-generates a fully typed database client matching your exact database schema.",
    uniqueValue:
      "Declarative schema modeling, automatic type generation, effortless relationship traversals, and intuitive GUI with Prisma Studio.",
    websiteUrl: "https://www.prisma.io",
    githubUrl: "https://github.com/prisma/prisma",
    twitterUrl: "https://twitter.com/prisma",
    discordUrl: "https://discord.gg/prisma",
    useCases:
      "Enterprise REST and GraphQL APIs, rapid full-stack prototyping, relational database management, and visual data inspection.",
    keywords:
      "prisma, orm, nodejs, typescript, database migrations, prisma studio, postgresql, graphql",
    targetAudience:
      "Node.js developers, full-stack engineers, backend developers, and tech leads.",
    metaTitle: "Prisma - Next-Generation Node.js and TypeScript ORM | LaunchNests",
    metaDescription:
      "Prisma simplifies database access with an auto-generated, type-safe query builder and visual data browser.",
    aiContext:
      "Prisma is an open-source next-generation ORM for Node.js and TypeScript. It features a declarative schema, automated migrations with Prisma Migrate, and a GUI data viewer named Prisma Studio.",
    categoryName: "ORM & Database Tools",
    categorySlug: "orm-database-tools",
    tags: ["prisma", "orm", "typescript", "database", "nodejs", "sql"],
    platforms: ["CLI", "Cloud", "API"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "What is Prisma Studio?",
        answer:
          "Prisma Studio is a visual data management GUI included with Prisma that lets you view, filter, and edit rows directly in your browser.",
      },
      {
        question: "Can Prisma handle nested relational queries?",
        answer:
          "Yes, Prisma Client enables fluent nested reads and writes using intuitive include and select arguments without manual SQL JOINs.",
      },
    ],
  },
  {
    name: "TypeScript",
    slug: "typescript",
    tagline: "JavaScript With Syntax For Types",
    description:
      "TypeScript is a strongly typed programming language developed by Microsoft that builds on JavaScript, giving you better tooling, intelligent code completion, and compile-time error checking.",
    problemStatement:
      "Dynamic JavaScript errors often only surface at runtime in production environments, making large codebases brittle and hard to refactor.",
    solution:
      "Static type-checking, modern IDE autocompletion, refactoring safety, and transpilation into standard JavaScript.",
    uniqueValue:
      "Full compatibility with the entire npm ecosystem, strict type inference, and constant enhancements backed by Microsoft.",
    websiteUrl: "https://www.typescriptlang.org",
    githubUrl: "https://github.com/microsoft/TypeScript",
    twitterUrl: "https://twitter.com/typescript",
    useCases:
      "Large-scale enterprise web applications, library development, full-stack typed contracts, and complex frontend architectures.",
    keywords:
      "typescript, javascript, static typing, microsoft, compiler, type-safe, developer-tools",
    targetAudience:
      "All JavaScript developers, enterprise software engineers, and frontend/backend teams.",
    metaTitle: "TypeScript - Typed JavaScript at Any Scale | LaunchNests",
    metaDescription:
      "Catch errors early and scale your codebase confidently with TypeScript static type checking and IDE intelligence.",
    aiContext:
      "TypeScript is a strongly typed superset of JavaScript developed by Microsoft. It compiles to clean JavaScript and is the de facto standard for professional web and backend development.",
    categoryName: "Programming Languages",
    categorySlug: "programming-languages",
    tags: ["typescript", "javascript", "compiler", "programming-language", "frontend", "backend"],
    platforms: ["CLI", "Web"],
    pricing: "Open Source",
    tier: "premium+",
    faqs: [
      {
        question: "Does TypeScript add any runtime overhead?",
        answer:
          "No, TypeScript types are completely erased during compilation, emitting clean JavaScript that runs with zero runtime penalty.",
      },
      {
        question: "Can I incrementally adopt TypeScript in an existing JavaScript project?",
        answer:
          "Yes, TypeScript allows gradual migration using allowJs: true and progressive type annotation file by file.",
      },
    ],
  },
  {
    name: "GitHub",
    slug: "github",
    tagline: "The World's Leading AI-Powered Developer Platform",
    description:
      "GitHub is the home for open source and private software development, hosting git repositories, automated CI/CD pipelines via GitHub Actions, and AI pair programming with Copilot.",
    problemStatement:
      "Distributed development teams need unified source control, code review workflows, issue tracking, and automated deployment pipelines.",
    solution:
      "A centralized cloud platform for Git collaboration, branch protection rules, automated CI/CD workflows, and integrated security scanning.",
    uniqueValue:
      "Over 100 million developers, industry-standard pull requests, massive open source ecosystem, and tight GitHub Actions integration.",
    websiteUrl: "https://github.com",
    githubUrl: "https://github.com/github",
    twitterUrl: "https://twitter.com/github",
    linkedinUrl: "https://linkedin.com/company/github",
    useCases:
      "Source code version control, pull request peer reviews, continuous integration/continuous deployment, and issue triage.",
    keywords:
      "github, git, source control, ci cd, github actions, code review, pull requests, open-source",
    targetAudience:
      "Every software developer, engineering team, open-source maintainer, and tech enterprise.",
    metaTitle: "GitHub - The World's Developer Platform | LaunchNests",
    metaDescription:
      "Host, review, and deploy code alongside millions of developers with GitHub source control and Actions CI/CD.",
    aiContext:
      "GitHub is a cloud-based service that helps developers store and manage their code using Git, providing tools for collaboration, code review, CI/CD, and project management.",
    categoryName: "Developer Collaboration",
    categorySlug: "developer-collaboration",
    tags: ["git", "github", "ci-cd", "collaboration", "devops", "source-control"],
    platforms: ["Web", "CLI", "iOS", "Android"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "What is GitHub Actions?",
        answer:
          "GitHub Actions is a CI/CD platform that lets you automate your build, test, and deployment pipeline right from your repository.",
      },
      {
        question: "Are private repositories free on GitHub?",
        answer:
          "Yes, GitHub offers unlimited free private repositories with collaborative pull request and issue tracking features.",
      },
    ],
  },
  {
    name: "Cloudflare",
    slug: "cloudflare",
    tagline: "Making the Internet Faster and More Secure",
    description:
      "Cloudflare delivers global edge network infrastructure, DDoS protection, DNS, CDN, and developer compute via Cloudflare Workers and R2 object storage.",
    problemStatement:
      "Web applications face global latency delays, sophisticated cyberattacks, DDoS flooding, and high egress bandwidth charges from hyperscalers.",
    solution:
      "A global anycast network running in 300+ cities that terminates traffic close to users, inspects malicious packets, caches content, and executes serverless code.",
    uniqueValue:
      "Zero egress fee object storage (R2), sub-millisecond edge compute with Workers (V8 isolates), and unmatched DDoS mitigation.",
    websiteUrl: "https://www.cloudflare.com",
    githubUrl: "https://github.com/cloudflare",
    twitterUrl: "https://twitter.com/cloudflare",
    linkedinUrl: "https://linkedin.com/company/cloudflare",
    discordUrl: "https://discord.gg/cloudflaredev",
    useCases:
      "Global content delivery, DDoS and bot mitigation, edge serverless computing, zero-egress file storage, and DNS resolution.",
    keywords:
      "cloudflare, cdn, ddos protection, edge compute, cloudflare workers, r2 storage, dns, security",
    targetAudience:
      "DevOps engineers, security teams, full-stack web developers, and cloud architects.",
    metaTitle: "Cloudflare - Global Edge Infrastructure & Security | LaunchNests",
    metaDescription:
      "Accelerate web performance and block cyberattacks globally with Cloudflare CDN, DNS, and Workers edge compute.",
    aiContext:
      "Cloudflare is an American cloud infrastructure and security company providing CDN services, DDoS mitigation, internet security, and serverless compute via Cloudflare Workers on V8 isolates.",
    categoryName: "Infrastructure & CDN",
    categorySlug: "infrastructure-cdn",
    tags: ["cdn", "security", "dns", "cloudflare", "edge", "serverless"],
    platforms: ["Cloud", "API", "CLI"],
    pricing: "Freemium",
    tier: "premium+",
    faqs: [
      {
        question: "How do Cloudflare Workers differ from AWS Lambda?",
        answer:
          "Workers run inside V8 isolates rather than container VMs, eliminating cold starts and starting execution in single-digit milliseconds.",
      },
      {
        question: "What is special about Cloudflare R2?",
        answer:
          "R2 is an S3-compatible object storage service that charges zero egress bandwidth fees, drastically reducing storage bills.",
      },
    ],
  },
  {
    name: "Postman",
    slug: "postman",
    tagline: "The World's Leading API Platform",
    description:
      "Postman simplifies each step of the API lifecycle and streamlines collaboration so you can design, mock, test, document, and debug APIs faster.",
    problemStatement:
      "Testing endpoints manually with curl or scattered scripts is error-prone, hard to share across teams, and lacks automated test assertions.",
    solution:
      "An intuitive GUI and CLI for organizing API requests into collections, mocking endpoints, validating schemas, and running automated regression tests.",
    uniqueValue:
      "Massive public API network, pre-request scripting, collection runners, and Newman CLI integration for CI/CD test automation.",
    websiteUrl: "https://www.postman.com",
    githubUrl: "https://github.com/postmanlabs",
    twitterUrl: "https://twitter.com/getpostman",
    linkedinUrl: "https://linkedin.com/company/postman-platform",
    useCases:
      "REST & GraphQL endpoint debugging, automated API contract testing, OpenAPI documentation generation, and team API workspace sharing.",
    keywords:
      "postman, api, rest api, graphql, api testing, openapi, newman, mock server",
    targetAudience:
      "Backend developers, QA automation engineers, API product managers, and frontend integrators.",
    metaTitle: "Postman - The API Platform for Developers | LaunchNests",
    metaDescription:
      "Design, test, and document APIs collaboratively with Postman, the world's leading API platform.",
    aiContext:
      "Postman is an API platform for developers to design, build, test, and iterate their APIs. It includes collection runners, automated mock servers, and Newman CI/CD integration.",
    categoryName: "API Tools",
    categorySlug: "api-tools",
    tags: ["api", "testing", "postman", "rest", "graphql", "developer-tools"],
    platforms: ["macOS", "Windows", "Linux", "Web", "CLI"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "Can I run Postman tests inside GitHub Actions?",
        answer:
          "Yes, using the Newman CLI, you can execute entire Postman collections and assertions automatically in any CI/CD pipeline.",
      },
      {
        question: "Does Postman support GraphQL and gRPC?",
        answer:
          "Yes, modern Postman versions feature native support for GraphQL schema introspection, queries, and gRPC protobuf definitions.",
      },
    ],
  },
  {
    name: "Sentry",
    slug: "sentry",
    tagline: "Application Monitoring and Error Tracking Software",
    description:
      "Sentry provides code-level observability, stack trace capture, performance monitoring, and session replay to help developers fix bugs in real-time.",
    problemStatement:
      "Production crashes go undetected until frustrated users complain, leaving engineers with cryptic bug reports and no reproducible state.",
    solution:
      "Lightweight SDKs capture unhandled exceptions, breadcrumbs, source maps, and network requests, linking errors directly to specific git commits.",
    uniqueValue:
      "Source-map deobfuscation, Session Replay video recordings of user actions before crashes, and trace-based performance profiling.",
    websiteUrl: "https://sentry.io",
    githubUrl: "https://github.com/getsentry/sentry",
    twitterUrl: "https://twitter.com/getsentry",
    linkedinUrl: "https://linkedin.com/company/sentry",
    discordUrl: "https://discord.gg/sentry",
    useCases:
      "Production crash alerts, frontend JavaScript exception triage, backend database query latency bottleneck discovery, and user Session Replay.",
    keywords:
      "sentry, error tracking, crash reporting, session replay, observability, performance monitoring, debugging",
    targetAudience:
      "Full-stack developers, DevOps engineers, site reliability engineers, and engineering managers.",
    metaTitle: "Sentry - Error Tracking & Performance Monitoring | LaunchNests",
    metaDescription:
      "Diagnose and resolve code crashes and performance regressions in real-time with Sentry application monitoring.",
    aiContext:
      "Sentry is an open-source error tracking and performance monitoring tool that helps developers diagnose, fix, and optimize the performance of their code in real time.",
    categoryName: "Monitoring & Error Tracking",
    categorySlug: "monitoring-error-tracking",
    tags: ["monitoring", "logging", "error-tracking", "observability", "sentry", "debugging"],
    platforms: ["Cloud", "Self-Hosted", "Web", "iOS", "Android"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "What is Sentry Session Replay?",
        answer:
          "Session Replay provides a video-like reproduction of user clicks, scrolls, and network calls leading up to a production crash.",
      },
      {
        question: "Can Sentry deobfuscate minified production React code?",
        answer:
          "Yes, by uploading production source maps during your CI build, Sentry displays exact original TypeScript files, lines, and function names.",
      },
    ],
  },
  {
    name: "Clerk",
    slug: "clerk",
    tagline: "Complete User Management and Authentication for Modern Web Apps",
    description:
      "Clerk provides pre-built, customizable UI components and SDKs for user authentication, multi-factor authorization, social logins, and multi-tenant organization switching.",
    problemStatement:
      "Building secure auth flows, password resets, session management, social logins, and B2B role-based access takes weeks of engineering.",
    solution:
      "Drop-in UI components (<SignIn />, <UserProfile />, <OrganizationSwitcher />) that handle security, session tokens, and identity verification.",
    uniqueValue:
      "Gorgeous drop-in components, first-class Next.js App Router support, SSR session cookies, and built-in organization multi-tenancy.",
    websiteUrl: "https://clerk.com",
    githubUrl: "https://github.com/clerk",
    twitterUrl: "https://twitter.com/clerkdev",
    linkedinUrl: "https://linkedin.com/company/clerkinc",
    discordUrl: "https://discord.gg/clerk",
    useCases:
      "SaaS user onboarding, B2B multi-tenant organization management, passwordless email/SMS login, and OAuth social sign-in.",
    keywords:
      "clerk, auth, authentication, nextjs auth, user management, oauth, b2b multi-tenant, sso",
    targetAudience:
      "Full-stack developers, React and Next.js engineers, SaaS founders, and frontend architects.",
    metaTitle: "Clerk - Complete User Authentication & Management | LaunchNests",
    metaDescription:
      "Add drop-in authentication, social logins, and multi-tenant organization management in minutes with Clerk.",
    aiContext:
      "Clerk is an authentication and user management platform specifically optimized for modern React, Next.js, and mobile applications with pre-built UI components.",
    categoryName: "Authentication",
    categorySlug: "authentication",
    tags: ["auth", "authentication", "security", "clerk", "nextjs", "react"],
    platforms: ["Web", "Cloud", "iOS", "Android"],
    pricing: "Freemium",
    tier: "premium+",
    faqs: [
      {
        question: "How does Clerk integrate with Next.js App Router?",
        answer:
          "Clerk provides middleware and React Server Component auth() utilities that read encrypted session cookies with zero client-side layout shift.",
      },
      {
        question: "Does Clerk support B2B SaaS organizations?",
        answer:
          "Yes, Clerk includes built-in multi-tenant organization switching, invitation links, domain verification, and role-based permissions.",
      },
    ],
  },
  {
    name: "Resend",
    slug: "resend",
    tagline: "The Modern Email Platform for Developers",
    description:
      "Resend provides a clean, developer-first email API for sending transactional emails, paired with React Email for building responsive emails using JSX components.",
    problemStatement:
      "Legacy email delivery platforms have clunky dashboards, painful SDKs, and require hacking together ugly HTML tables for email templates.",
    solution:
      "Modern REST API and SDKs that let developers write emails using React and TypeScript, delivering messages with exceptional inbox deliverability.",
    uniqueValue:
      "First-party React Email integration, instant domain verification via modern DNS checks, and intuitive real-time delivery logs.",
    websiteUrl: "https://resend.com",
    githubUrl: "https://github.com/resend",
    twitterUrl: "https://twitter.com/resend",
    linkedinUrl: "https://linkedin.com/company/resend",
    discordUrl: "https://discord.gg/resend",
    useCases:
      "Transactional emails, user onboarding welcome drips, password reset verification links, and billing invoice delivery.",
    keywords:
      "resend, email api, transactional email, react email, smtp, developer email, deliverability",
    targetAudience:
      "Full-stack developers, SaaS founders, indie hackers, and growth engineers.",
    metaTitle: "Resend - Email API for Modern Developers | LaunchNests",
    metaDescription:
      "Deliver transactional emails reliably and build dynamic templates with React Email using the Resend developer API.",
    aiContext:
      "Resend is an email platform for developers created by the makers of React Email. It provides an intuitive REST API and SDKs for sending transactional emails with high deliverability.",
    categoryName: "Email & Communications",
    categorySlug: "email-communications",
    tags: ["email", "transactional-email", "resend", "react-email", "api", "communication"],
    platforms: ["Cloud", "API"],
    pricing: "Freemium",
    tier: "premium+",
    faqs: [
      {
        question: "What is React Email?",
        answer:
          "React Email is an open-source library of components that lets you write email templates in React and compiles them into bulletproof cross-client HTML.",
      },
      {
        question: "How fast is domain verification on Resend?",
        answer:
          "Resend checks SPF and DKIM records automatically via modern DNS polling, usually verifying custom sending domains in under 60 seconds.",
      },
    ],
  },
  {
    name: "Bun",
    slug: "bun",
    tagline: "Fast All-in-One JavaScript Runtime & Package Manager",
    description:
      "Bun is an all-in-one JavaScript runtime, bundler, test runner, and package manager built from scratch using Zig and JavaScriptCore, designed as a faster drop-in replacement for Node.js.",
    problemStatement:
      "JavaScript toolchains require chaining slow package managers, heavy bundlers, transpilers, and separate test suites.",
    solution:
      "A single native binary that installs npm packages up to 25x faster, runs TypeScript and JSX directly with zero compilation, and executes tests natively.",
    uniqueValue:
      "Extreme startup speed, native TypeScript/JSX execution, instant package installation, and built-in SQLite/WebSocket APIs.",
    websiteUrl: "https://bun.sh",
    githubUrl: "https://github.com/oven-sh/bun",
    twitterUrl: "https://twitter.com/bunjavascript",
    discordUrl: "https://discord.gg/bun",
    useCases:
      "Blazing-fast npm dependency installs, high-performance HTTP microservices, native SQLite scripts, and unified test running.",
    keywords:
      "bun, javascript runtime, package manager, typescript, zig, bundler, nodejs alternative, fast",
    targetAudience:
      "JavaScript engineers, backend developers, CLI tool creators, and DevOps pipeline engineers.",
    metaTitle: "Bun - Incredibly Fast All-in-One JavaScript Runtime | LaunchNests",
    metaDescription:
      "Run TypeScript, install npm packages, and execute tests up to 25x faster with Bun all-in-one runtime.",
    aiContext:
      "Bun is an all-in-one JavaScript runtime, package manager, and bundler written in Zig and powered by Apple's WebKit JavaScriptCore engine. It serves as a drop-in replacement for Node.js.",
    categoryName: "Runtimes",
    categorySlug: "runtimes",
    tags: ["bun", "javascript", "runtime", "package-manager", "typescript", "bundler"],
    platforms: ["macOS", "Linux", "Windows", "CLI"],
    pricing: "Open Source",
    tier: "premium",
    faqs: [
      {
        question: "Is Bun compatible with standard Node.js npm packages?",
        answer:
          "Yes, Bun implements most Node.js core APIs (fs, path, http, crypto) and is compatible with the vast majority of npm packages.",
      },
      {
        question: "Do I need ts-node or tsc to run TypeScript in Bun?",
        answer:
          "No, Bun parses and executes TypeScript and JSX files natively out of the box with zero extra configuration.",
      },
    ],
  },
  {
    name: "Vite",
    slug: "vite",
    tagline: "Next Generation Frontend Tooling",
    description:
      "Vite is a modern frontend build tool that provides an extremely fast development environment using native ES modules and bundles code with Rollup for production.",
    problemStatement:
      "Webpack-based dev servers become sluggish and take minutes to spin up as applications scale to thousands of modules.",
    solution:
      "Vite serves source code over native ESM, offloading module bundling to the browser during dev and using esbuild for lightning-fast pre-bundling.",
    uniqueValue:
      "Instant server start, lightning-fast Hot Module Replacement (HMR) independent of app size, and rich plugin ecosystem.",
    websiteUrl: "https://vitejs.dev",
    githubUrl: "https://github.com/vitejs/vite",
    twitterUrl: "https://twitter.com/vite_js",
    discordUrl: "https://discord.gg/vite",
    useCases:
      "SPA frontend development (React, Vue, Svelte), lightning-fast local testing, and modern frontend production bundling.",
    keywords:
      "vite, build tool, frontend, bundler, esm, hmr, vue, react, svelte, developer-tools",
    targetAudience:
      "Frontend developers, open-source library authors, web agency teams, and full-stack builders.",
    metaTitle: "Vite - Next Generation Frontend Build Tool | LaunchNests",
    metaDescription:
      "Experience instant server start and lightning-fast Hot Module Replacement with Vite frontend tooling.",
    aiContext:
      "Vite is a frontend build tool created by Evan You. It utilizes native browser ES modules during development and Rollup for production builds, providing near-instant hot reloading.",
    categoryName: "Build Tools",
    categorySlug: "build-tools",
    tags: ["vite", "build-tool", "frontend", "bundler", "esm", "devtools"],
    platforms: ["CLI", "Web"],
    pricing: "Open Source",
    tier: "premium",
    faqs: [
      {
        question: "Why is Vite's dev server so much faster than Webpack?",
        answer:
          "Vite avoids bundling your code on every edit; it leverages native browser ES modules and compiles dependencies on the fly with esbuild.",
      },
      {
        question: "Which frontend frameworks are supported by Vite?",
        answer:
          "Vite natively supports React, Vue, Svelte, Preact, Solid, Lit, and vanilla JavaScript/TypeScript.",
      },
    ],
  },
  {
    name: "Neon",
    slug: "neon",
    tagline: "Serverless Postgres Built for the Cloud",
    description:
      "Neon separates compute and storage to deliver serverless PostgreSQL with autoscaling, bottomless storage, instant database branching, and scale-to-zero efficiency.",
    problemStatement:
      "Traditional database instances run 24/7 incurring high idle costs and cannot be branched easily for preview environments.",
    solution:
      "Neon decouples storage from compute, allowing databases to scale to zero when inactive and fork instant, copy-on-write branch replicas in seconds.",
    uniqueValue:
      "Instant database branching like git branches, scale-to-zero cost savings, connection pooling via WebSocket, and 100% Postgres wire compatibility.",
    websiteUrl: "https://neon.tech",
    githubUrl: "https://github.com/neondatabase/neon",
    twitterUrl: "https://twitter.com/neondatabase",
    discordUrl: "https://discord.gg/neon",
    useCases:
      "Staging preview branch databases per pull request, serverless Next.js edge apps, AI vector search, and scalable SaaS backends.",
    keywords:
      "neon, serverless postgres, database branching, postgresql, serverless database, cloud database",
    targetAudience:
      "Full-stack developers, SaaS engineering teams, DevOps engineers, and cloud architects.",
    metaTitle: "Neon - Serverless Postgres with Instant Branching | LaunchNests",
    metaDescription:
      "Scale Postgres to zero and branch production databases in seconds with Neon serverless cloud architecture.",
    aiContext:
      "Neon is a serverless open-source alternative to AWS Aurora Postgres. It separates storage and compute to offer autoscaling, scale-to-zero, and instant database branching.",
    categoryName: "Databases",
    categorySlug: "databases",
    tags: ["postgres", "serverless", "neon", "database", "branching", "cloud"],
    platforms: ["Cloud", "API"],
    pricing: "Freemium",
    tier: "premium+",
    faqs: [
      {
        question: "What is database branching in Neon?",
        answer:
          "Database branching lets you create an instant copy-on-write snapshot of your schema and data to test migrations or preview features safely.",
      },
      {
        question: "Can Neon connect from serverless functions without exhausting connections?",
        answer:
          "Yes, Neon provides a built-in connection pooler and a serverless driver over WebSockets that eliminates connection limit errors.",
      },
    ],
  },
  {
    name: "Upstash",
    slug: "upstash",
    tagline: "Serverless Data for Redis, Kafka, and Vector",
    description:
      "Upstash provides serverless Redis, Apache Kafka, QStash message queues, and Vector databases with per-request pricing, designed specifically for serverless and edge environments.",
    problemStatement:
      "Standard Redis and Kafka require continuous TCP connections and dedicated server clusters that do not fit serverless stateless execution.",
    solution:
      "REST and HTTP-based SDKs that communicate with distributed Redis/Kafka clusters without connection exhaustion issues.",
    uniqueValue:
      "Native HTTP/REST API for Redis, pay-per-request billing, zero idle server cost, and built-in rate-limiting and QStash message scheduling.",
    websiteUrl: "https://upstash.com",
    githubUrl: "https://github.com/upstash",
    twitterUrl: "https://twitter.com/upstash",
    discordUrl: "https://discord.gg/upstash",
    useCases:
      "Edge rate limiting in Next.js middleware, serverless background queue processing with QStash, and low-latency cache lookups.",
    keywords:
      "upstash, serverless redis, qstash, kafka, vector database, edge computing, rate-limiting",
    targetAudience:
      "Serverless developers, Next.js engineers, AI application builders, and cloud architects.",
    metaTitle: "Upstash - Serverless Redis, Kafka & Vector Database | LaunchNests",
    metaDescription:
      "Build fast serverless apps with Upstash: per-request Redis, QStash background messaging, and vector search over HTTP.",
    aiContext:
      "Upstash provides serverless data services including Redis, Kafka, QStash, and Vector with REST APIs tailored for Vercel, Cloudflare, and AWS Lambda serverless runtimes.",
    categoryName: "Serverless Data",
    categorySlug: "serverless-data",
    tags: ["redis", "serverless", "upstash", "kafka", "vector", "caching"],
    platforms: ["Cloud", "API"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "Why use Upstash Redis over self-hosted Redis?",
        answer:
          "Upstash uses HTTP REST endpoints, meaning serverless functions cannot exhaust database connection pools during traffic spikes.",
      },
      {
        question: "What is QStash?",
        answer:
          "QStash is a serverless messaging queue and cron scheduler that reliably calls your HTTP endpoints with automatic retries and deduplication.",
      },
    ],
  },
  {
    name: "LangChain",
    slug: "langchain",
    tagline: "Framework for Developing Applications Powered by Large Language Models",
    description:
      "LangChain is the standard orchestration framework for building context-aware, reasoning LLM applications, retrieval-augmented generation (RAG) pipelines, and autonomous AI agents.",
    problemStatement:
      "Connecting LLMs to dynamic data sources, vector stores, custom tools, and managing chat memory across turns requires extensive pipeline glue.",
    solution:
      "Modular abstractions for prompt engineering, document loaders, text splitters, vector store retrieval, and LangGraph multi-agent execution.",
    uniqueValue:
      "Comprehensive ecosystem connecting 100+ model providers and vector stores, coupled with LangSmith for evaluation and tracing.",
    websiteUrl: "https://www.langchain.com",
    githubUrl: "https://github.com/langchain-ai/langchain",
    twitterUrl: "https://twitter.com/langchainai",
    discordUrl: "https://discord.gg/langchain",
    useCases:
      "Enterprise RAG knowledge search, multi-agent automated reasoning workflows, code analysis bots, and customer support AI copilots.",
    keywords:
      "langchain, llm, ai agents, rag, python, typescript, prompt engineering, openai, vector search",
    targetAudience:
      "AI engineers, software developers, data scientists, and generative AI product teams.",
    metaTitle: "LangChain - The Framework for LLM Applications | LaunchNests",
    metaDescription:
      "Build context-aware reasoning AI applications, RAG pipelines, and autonomous agents with LangChain.",
    aiContext:
      "LangChain is an open-source framework that enables software developers to build applications around large language models, providing integrations for prompts, models, vector stores, and memory.",
    categoryName: "AI & Machine Learning",
    categorySlug: "ai-machine-learning",
    tags: ["ai", "llm", "langchain", "rag", "agents", "machine-learning"],
    platforms: ["Web", "API", "CLI"],
    pricing: "Freemium",
    tier: "premium+",
    faqs: [
      {
        question: "Is LangChain available in both Python and JavaScript/TypeScript?",
        answer:
          "Yes, LangChain maintains both Python (langchain) and TypeScript (@langchain/core) packages with parallel feature parity.",
      },
      {
        question: "What is LangGraph?",
        answer:
          "LangGraph is an extension of LangChain designed for creating cyclical, multi-agent architectures with stateful persistence.",
      },
    ],
  },
  {
    name: "OpenAI API",
    slug: "openai-api",
    tagline: "State-of-the-Art Generative AI Models via Simple API",
    description:
      "The OpenAI API provides developer access to frontier AI models including GPT-4o, o1, o3-mini, DALL·E 3, and Whisper for natural language processing, coding, vision, and reasoning.",
    problemStatement:
      "Developing advanced artificial intelligence requires millions of dollars in compute, specialized clusters, and massive dataset training.",
    solution:
      "A single REST API endpoint with streaming completions, function/tool calling, structured JSON output, and fine-tuning capabilities.",
    uniqueValue:
      "Frontier reasoning capabilities, massive developer ecosystem, real-time audio and vision processing, and robust tool-calling integration.",
    websiteUrl: "https://platform.openai.com",
    githubUrl: "https://github.com/openai",
    twitterUrl: "https://twitter.com/openai",
    discordUrl: "https://discord.gg/openai",
    useCases:
      "Automated code generation, document summarization, conversational AI agents, structured data extraction, and visual reasoning.",
    keywords:
      "openai, gpt4, gpt4o, o1, generative ai, llm api, chatgpt, machine learning, ai developer",
    targetAudience:
      "AI developers, SaaS creators, data scientists, and modern software engineering teams.",
    metaTitle: "OpenAI API - Frontier AI Models for Developers | LaunchNests",
    metaDescription:
      "Integrate state-of-the-art GPT-4o and reasoning models directly into your applications with the OpenAI API.",
    aiContext:
      "OpenAI API provides access to OpenAI's advanced AI models including GPT-4o, o1 reasoning models, Whisper speech-to-text, and text-embedding models.",
    categoryName: "AI & Machine Learning",
    categorySlug: "ai-machine-learning",
    tags: ["ai", "openai", "gpt4", "machine-learning", "api", "llm"],
    platforms: ["API", "Cloud"],
    pricing: "Paid",
    tier: "premium+",
    faqs: [
      {
        question: "What is Structured Outputs in the OpenAI API?",
        answer:
          "Structured Outputs guarantees that the model will strictly conform to a provided JSON Schema, eliminating parsing errors.",
      },
      {
        question: "Can I stream responses from the OpenAI API?",
        answer:
          "Yes, Server-Sent Events (SSE) streaming is natively supported to deliver word-by-word token generation with zero perceived lag.",
      },
    ],
  },
  {
    name: "Algolia",
    slug: "algolia",
    tagline: "The Flexible AI Search and Discovery Platform",
    description:
      "Algolia provides lightning-fast, typo-tolerant search-as-a-service APIs, neural vector search, and pre-built UI components that deliver sub-10ms search results.",
    problemStatement:
      "Building search inside relational databases is slow, lacks typo tolerance, and struggles with faceted filtering at scale.",
    solution:
      "A hosted search engine that indexes content into memory and serves ranked, typo-tolerant query results with instant instant-search UI widgets.",
    uniqueValue:
      "Sub-10ms global latency, instant search UI libraries for React and Vue, keyword + vector hybrid search, and detailed query analytics.",
    websiteUrl: "https://www.algolia.com",
    githubUrl: "https://github.com/algolia",
    twitterUrl: "https://twitter.com/algolia",
    linkedinUrl: "https://linkedin.com/company/algolia",
    useCases:
      "E-commerce product catalogs, documentation search, SaaS global search bars (Cmd+K), and media library filtering.",
    keywords:
      "algolia, search api, fast search, typo tolerance, instantsearch, faceted search, vector search",
    targetAudience:
      "E-commerce engineers, frontend developers, SaaS architects, and product managers.",
    metaTitle: "Algolia - Fast AI Search & Discovery API | LaunchNests",
    metaDescription:
      "Deliver sub-10ms typo-tolerant search experiences and faceted navigation with Algolia search-as-a-service.",
    aiContext:
      "Algolia is a proprietary search-as-a-service platform that offers web search through a software as a service model. Known for low latency, typo tolerance, and InstantSearch UI libraries.",
    categoryName: "Search & Discovery",
    categorySlug: "search-discovery",
    tags: ["search", "algolia", "fast-search", "api", "discovery", "saas"],
    platforms: ["Cloud", "API", "Web"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "How fast is Algolia compared to traditional SQL search?",
        answer:
          "Algolia serves search responses from edge memory in under 10ms with typo tolerance, whereas SQL LIKE queries can take hundreds of milliseconds.",
      },
      {
        question: "What is Algolia InstantSearch?",
        answer:
          "InstantSearch is a suite of customizable UI components for React, Vue, and JavaScript to build instant search experiences rapidly.",
      },
    ],
  },
  {
    name: "Turborepo",
    slug: "turborepo",
    tagline: "High-Performance Build System for JavaScript and TypeScript Monorepos",
    description:
      "Turborepo is a high-speed build system for JavaScript and TypeScript monorepos, written in Rust, featuring remote caching, dependency graph task pipelining, and zero config.",
    problemStatement:
      "Monorepos suffer from slow CI builds and repeated recompilation of packages that haven't changed.",
    solution:
      "Turborepo remembers previous build outputs and caches them locally and in the cloud, never executing the exact same task twice.",
    uniqueValue:
      "Remote caching with Vercel or custom backends, intelligent topological task graph execution, and sub-millisecond Rust scheduler.",
    websiteUrl: "https://turbo.build/repo",
    githubUrl: "https://github.com/vercel/turborepo",
    twitterUrl: "https://twitter.com/turborepo",
    useCases:
      "Scaling enterprise JavaScript monorepos, accelerating CI/CD testing pipelines, and sharing internal UI component libraries.",
    keywords:
      "turborepo, monorepo, build system, remote caching, vercel, rust, typescript monorepo",
    targetAudience:
      "Frontend platform engineers, DevOps engineers, and teams managing multi-package codebases.",
    metaTitle: "Turborepo - High-Performance Monorepo Build System | LaunchNests",
    metaDescription:
      "Never compute the same thing twice. Speed up monorepo builds and CI pipelines with Turborepo remote caching.",
    aiContext:
      "Turborepo is a high-performance build system for JavaScript and TypeScript codebases created by Jared Palmer and maintained by Vercel. Written in Rust with remote caching support.",
    categoryName: "Build Tools",
    categorySlug: "build-tools",
    tags: ["monorepo", "build-tool", "turborepo", "rust", "caching", "typescript"],
    platforms: ["CLI"],
    pricing: "Open Source",
    tier: "premium",
    faqs: [
      {
        question: "What is Turborepo Remote Caching?",
        answer:
          "Remote caching shares build and test artifact caches across team members and CI machines, eliminating redundant compilation.",
      },
      {
        question: "Do I have to migrate my entire build setup to use Turborepo?",
        answer:
          "No, Turborepo works with existing package managers (pnpm, yarn, npm) and adds a turbo.json pipeline configuration file.",
      },
    ],
  },
  {
    name: "PostHog",
    slug: "posthog",
    tagline: "The All-in-One Developer-First Product Operating System",
    description:
      "PostHog combines product analytics, session recording, feature flags, A/B testing, heatmaps, user surveys, and data warehousing into a single developer-friendly platform.",
    problemStatement:
      "Product teams end up stitching together multiple expensive SaaS tools for analytics, session replays, and feature flags.",
    solution:
      "An open-source, all-in-one platform that auto-captures events, tracks funnels, records user sessions, and toggles feature flags with a single SDK.",
    uniqueValue:
      "Complete integration of product analytics with session replays and feature flags, open-source with self-hosting option, and transparent usage pricing.",
    websiteUrl: "https://posthog.com",
    githubUrl: "https://github.com/posthog/posthog",
    twitterUrl: "https://twitter.com/posthog",
    linkedinUrl: "https://linkedin.com/company/posthog",
    discordUrl: "https://discord.gg/posthog",
    useCases:
      "Product usage analytics, conversion funnel debugging with Session Replay, gradual feature rollouts via flags, and customer surveys.",
    keywords:
      "posthog, product analytics, session recording, feature flags, ab testing, open source analytics",
    targetAudience:
      "Product engineers, startup founders, data analysts, and growth hackers.",
    metaTitle: "PostHog - All-in-One Product Analytics & Session Replay | LaunchNests",
    metaDescription:
      "Track product analytics, record user sessions, and roll out feature flags with the PostHog developer platform.",
    aiContext:
      "PostHog is an open-source product analytics platform that provides event tracking, session recordings, heatmaps, feature flags, and A/B testing for web and mobile apps.",
    categoryName: "Analytics",
    categorySlug: "analytics",
    tags: ["analytics", "product-analytics", "posthog", "feature-flags", "session-replay", "open-source"],
    platforms: ["Web", "Cloud", "Self-Hosted", "iOS", "Android"],
    pricing: "Freemium",
    tier: "premium+",
    faqs: [
      {
        question: "Can PostHog be self-hosted?",
        answer:
          "Yes, PostHog provides an open-source edition that can be deployed on Kubernetes or Docker alongside their managed Cloud option.",
      },
      {
        question: "How do feature flags connect to analytics in PostHog?",
        answer:
          "Because feature flags and analytics share the same platform, you can measure the exact conversion impact of any flag rollout automatically.",
      },
    ],
  },
  {
    name: "Linear",
    slug: "linear",
    tagline: "The Issue Tracking Tool You'll Actually Enjoy Using",
    description:
      "Linear is a purpose-built issue tracking and project management tool designed for modern high-performance software teams with lightning-fast keyboard shortcuts.",
    problemStatement:
      "Traditional project management tools are sluggish, cluttered with enterprise bloat, and interrupt engineering flow.",
    solution:
      "A blazing-fast, keyboard-first issue tracker with offline synchronization, bi-directional GitHub/GitLab integration, and automated cycle planning.",
    uniqueValue:
      "Sub-50ms interaction speed, full keyboard accessibility, delightful micro-interactions, and deep git branch-to-PR automation.",
    websiteUrl: "https://linear.app",
    githubUrl: "https://github.com/linear",
    twitterUrl: "https://twitter.com/linear",
    linkedinUrl: "https://linkedin.com/company/linear-app",
    useCases:
      "Agile sprint cycle management, engineering bug tracking, team roadmaps, and automated git branch workflow coordination.",
    keywords:
      "linear, issue tracking, project management, agile, sprint cycles, software planning, developer productivity",
    targetAudience:
      "Software engineers, product managers, startup founders, and high-velocity engineering organizations.",
    metaTitle: "Linear - Fast & Delightful Issue Tracking | LaunchNests",
    metaDescription:
      "Linear streamlines software projects, sprints, and bug tracking with blazingly fast keyboard-driven workflows.",
    aiContext:
      "Linear is a project management tool built for high-performance software teams. It emphasizes speed, keyboard shortcuts, automated git branch linking, and modern software development cycles.",
    categoryName: "Developer Productivity",
    categorySlug: "developer-productivity",
    tags: ["issue-tracker", "productivity", "linear", "project-management", "developer-tools"],
    platforms: ["Web", "macOS", "Windows", "iOS", "Android"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "How does Linear integrate with GitHub pull requests?",
        answer:
          "Creating a git branch from a Linear issue automatically links PRs and transitions issue status when code is opened or merged.",
      },
      {
        question: "Does Linear work offline?",
        answer:
          "Yes, Linear features local-first synchronization, letting you create and edit issues offline with instant reconciliation when reconnected.",
      },
    ],
  },
  {
    name: "Raycast",
    slug: "raycast",
    tagline: "Supercharged Desktop Launcher for Developers",
    description:
      "Raycast is an extensible desktop launcher for macOS and Windows that lets you control your tools, run scripts, manage clipboard history, search docs, and execute AI prompts with a keystroke.",
    problemStatement:
      "Developers lose focus constantly switching between browser tabs, terminals, and desktop apps to perform routine tasks.",
    solution:
      "A single global hotkey launcher packed with built-in productivity utilities and a rich ecosystem of community TypeScript extensions.",
    uniqueValue:
      "Blazingly fast native performance, open TypeScript React extension API, built-in Raycast AI, and seamless window management.",
    websiteUrl: "https://www.raycast.com",
    githubUrl: "https://github.com/raycast",
    twitterUrl: "https://twitter.com/raycastapp",
    linkedinUrl: "https://linkedin.com/company/raycast",
    discordUrl: "https://discord.gg/raycast",
    useCases:
      "Clipboard history retrieval, rapid script execution, GitHub issue searching, window management, and instant AI code queries.",
    keywords:
      "raycast, launcher, macos, developer productivity, clipboard manager, raycast ai, extensions",
    targetAudience:
      "Mac & Windows developers, power users, software engineers, and digital creators.",
    metaTitle: "Raycast - Supercharged Desktop Launcher for Developers | LaunchNests",
    metaDescription:
      "Control your tools, manage windows, search docs, and run scripts instantly from a single keyboard hotkey with Raycast.",
    aiContext:
      "Raycast is an extensible launcher for macOS and Windows that replaces default desktop search with customizable commands, developer extensions, and integrated AI assistant capabilities.",
    categoryName: "Developer Productivity",
    categorySlug: "developer-productivity",
    tags: ["raycast", "productivity", "launcher", "macos", "devtools", "extensions"],
    platforms: ["macOS", "Windows"],
    pricing: "Freemium",
    tier: "premium",
    faqs: [
      {
        question: "Can I build custom Raycast extensions using React?",
        answer:
          "Yes, Raycast provides an official TypeScript SDK that lets developers build native extensions using React components and Node.js APIs.",
      },
      {
        question: "Is Raycast available on Windows?",
        answer:
          "Yes, Raycast offers an official Windows client alongside its original native macOS application.",
      },
    ],
  },
  {
    name: "Playwright",
    slug: "playwright",
    tagline: "Fast and Reliable End-to-End Testing for Modern Web Apps",
    description:
      "Playwright by Microsoft enables reliable end-to-end testing and browser automation across Chromium, Firefox, and WebKit with a single unified API in TypeScript and Python.",
    problemStatement:
      "End-to-end browser tests are notoriously flaky due to timing issues, dynamic DOM rendering, and browser inconsistencies.",
    solution:
      "Playwright auto-waits for elements to be actionable before performing clicks or inputs, runs tests across all major browser engines, and isolates contexts.",
    uniqueValue:
      "Auto-waiting eliminates flaky tests, full cross-browser support (Chromium, Firefox, WebKit), trace viewer for step-by-step visual debugging, and mobile emulation.",
    websiteUrl: "https://playwright.dev",
    githubUrl: "https://github.com/microsoft/playwright",
    twitterUrl: "https://twitter.com/playwrightweb",
    discordUrl: "https://discord.gg/playwright",
    useCases:
      "Automated end-to-end regression testing, cross-browser web testing in CI pipelines, web scraping, and UI visual regression snapshots.",
    keywords:
      "playwright, e2e testing, browser automation, microsoft, cross-browser, typescript testing, test runner",
    targetAudience:
      "QA engineers, full-stack web developers, test automation specialists, and frontend teams.",
    metaTitle: "Playwright - Fast & Reliable End-to-End Testing | LaunchNests",
    metaDescription:
      "Eliminate flaky browser tests with Playwright auto-waiting and cross-browser testing across Chromium, Firefox, and WebKit.",
    aiContext:
      "Playwright is an open-source automation library for browser testing developed by Microsoft. It supports Chromium, Firefox, and WebKit through a single unified API.",
    categoryName: "Testing",
    categorySlug: "testing",
    tags: ["testing", "playwright", "e2e", "browser-automation", "qa", "developer-tools"],
    platforms: ["CLI", "Linux", "macOS", "Windows"],
    pricing: "Open Source",
    tier: "premium",
    faqs: [
      {
        question: "How does Playwright eliminate test flakiness?",
        answer:
          "Playwright automatically waits for elements to be visible, stable, enabled, and receive events before performing actions, avoiding sleep calls.",
      },
      {
        question: "What is the Playwright Trace Viewer?",
        answer:
          "The Trace Viewer captures DOM snapshots, console logs, and network traffic for each test step, allowing post-run visual debugging.",
      },
    ],
  },
]

const ensureLaunchNestsUser = async (): Promise<string> => {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(
      or(
        eq(users.id, LAUNCHNESTS_USER_ID),
        eq(users.username, "launchnests"),
        eq(users.email, "official@launchnests.com")
      )
    )
    .limit(1)

  if (existing[0]?.id) {
    await db
      .update(users)
      .set({
        name: "LaunchNests",
        image: LAUNCHNESTS_FAVICON,
        avatarUrl: LAUNCHNESTS_FAVICON,
        username: "launchnests",
        bio: "Official LaunchNests Account. Curating top developer tools, modern stacks, and indie launches.",
        description:
          "LaunchNests is the premier launch platform for developer tools, SaaS products, and indie hacker projects.",
        websiteUrl: "https://launchnests.com",
        twitterUrl: "https://twitter.com/launchnests",
        githubUrl: "https://github.com/launchnests",
        linkedinUrl: "https://linkedin.com/company/launchnests",
        country: "United States",
        state: "California",
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing[0].id))

    return existing[0].id
  }

  const [created] = await db
    .insert(users)
    .values({
      id: LAUNCHNESTS_USER_ID,
      name: "LaunchNests",
      email: "official@launchnests.com",
      emailVerified: true,
      image: LAUNCHNESTS_FAVICON,
      avatarUrl: LAUNCHNESTS_FAVICON,
      username: "launchnests",
      bio: "Official LaunchNests Account. Curating top developer tools, modern stacks, and indie launches.",
      description:
        "LaunchNests is the premier launch platform for developer tools, SaaS products, and indie hacker projects.",
      websiteUrl: "https://launchnests.com",
      twitterUrl: "https://twitter.com/launchnests",
      githubUrl: "https://github.com/launchnests",
      linkedinUrl: "https://linkedin.com/company/launchnests",
      country: "United States",
      state: "California",
    })
    .returning({ id: users.id })

  return created.id
}

const ensureCategory = async (name: string, slug: string): Promise<string> => {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(or(ilike(categories.name, name), eq(categories.slug, slug)))
    .limit(1)

  if (existing[0]?.id) {
    return existing[0].id
  }

  try {
    const [created] = await db
      .insert(categories)
      .values({ name, slug })
      .onConflictDoNothing()
      .returning({ id: categories.id })

    if (created?.id) {
      return created.id
    }
  } catch {
    // Conflict handled by fallback query
  }

  const [fallback] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(or(ilike(categories.name, name), eq(categories.slug, slug)))
    .limit(1)

  return fallback.id
}

const seed = async () => {
  console.log("🌱 Starting LaunchNests developer tools database seed...")

  const userId = await ensureLaunchNestsUser()
  console.log(`✅ Verified LaunchNests account: ${userId}`)

  const now = new Date()
  const { year: currentYear, week: currentWeek, startDate: weekStart, endDate: weekEnd } =
    getISOWeekDetails(now)

  const categoryCache = new Map<string, string>()

  let seededCount = 0

  for (const item of seedToolsData) {
    let categoryId = categoryCache.get(item.categorySlug)
    if (!categoryId) {
      categoryId = await ensureCategory(item.categoryName, item.categorySlug)
      categoryCache.set(item.categorySlug, categoryId)
    }

    const toolLogoUrl = getFaviconUrl(item.websiteUrl)

    const toolPayload = {
      slug: item.slug,
      submitterId: userId,
      name: item.name,
      tagline: item.tagline,
      description: item.description,
      problemStatement: item.problemStatement,
      solution: item.solution,
      uniqueValue: item.uniqueValue,
      websiteUrl: item.websiteUrl,
      logoUrl: toolLogoUrl,
      githubUrl: item.githubUrl ?? null,
      twitterUrl: item.twitterUrl ?? null,
      linkedinUrl: item.linkedinUrl ?? null,
      discordUrl: item.discordUrl ?? null,
      appStoreUrl: null,
      playStoreUrl: null,
      chromeExtensionUrl: null,
      images: [] as string[],
      demoVideoUrl: null,
      useCases: item.useCases,
      keywords: item.keywords,
      targetAudience: item.targetAudience,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      aiContext: item.aiContext,
      geoTarget: "Global",
      asoCategory: "Developer Tools",
      categoryId,
      tags: item.tags,
      platforms: item.platforms,
      pricing: item.pricing,
      tier: item.tier,
      status: "approved" as const,
      upvotesCount: 0,
      buildsCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      launchYear: currentYear,
      launchWeek: currentWeek,
      launchDate: weekStart,
      updatedAt: now,
    }

    const [upsertedTool] = await db
      .insert(tools)
      .values(toolPayload)
      .onConflictDoUpdate({
        target: tools.slug,
        set: {
          name: toolPayload.name,
          tagline: toolPayload.tagline,
          description: toolPayload.description,
          problemStatement: toolPayload.problemStatement,
          solution: toolPayload.solution,
          uniqueValue: toolPayload.uniqueValue,
          websiteUrl: toolPayload.websiteUrl,
          logoUrl: toolPayload.logoUrl,
          githubUrl: toolPayload.githubUrl,
          twitterUrl: toolPayload.twitterUrl,
          linkedinUrl: toolPayload.linkedinUrl,
          discordUrl: toolPayload.discordUrl,
          images: [] as string[],
          demoVideoUrl: null,
          useCases: toolPayload.useCases,
          keywords: toolPayload.keywords,
          targetAudience: toolPayload.targetAudience,
          metaTitle: toolPayload.metaTitle,
          metaDescription: toolPayload.metaDescription,
          aiContext: toolPayload.aiContext,
          geoTarget: toolPayload.geoTarget,
          asoCategory: toolPayload.asoCategory,
          categoryId: toolPayload.categoryId,
          tags: toolPayload.tags,
          platforms: toolPayload.platforms,
          pricing: toolPayload.pricing,
          tier: toolPayload.tier,
          status: toolPayload.status,
          upvotesCount: 0,
          buildsCount: 0,
          commentsCount: 0,
          viewsCount: 0,
          launchYear: toolPayload.launchYear,
          launchWeek: toolPayload.launchWeek,
          launchDate: toolPayload.launchDate,
          updatedAt: now,
        },
      })
      .returning({ id: tools.id, slug: tools.slug })

    if (upsertedTool) {
      await db.delete(toolFaqs).where(eq(toolFaqs.toolId, upsertedTool.id))

      if (item.faqs && item.faqs.length > 0) {
        await db.insert(toolFaqs).values(
          item.faqs.map((faq, idx) => ({
            toolId: upsertedTool.id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: idx,
          }))
        )
      }

      const existingLaunch = await db
        .select({ id: launches.id })
        .from(launches)
        .where(eq(launches.toolId, upsertedTool.id))
        .limit(1)

      if (!existingLaunch[0]) {
        await db.insert(launches).values({
          toolId: upsertedTool.id,
          submitterId: userId,
          itemType: "tool",
          isoYear: currentYear,
          isoWeek: currentWeek,
          startDate: weekStart,
          endDate: weekEnd,
          tier: item.tier,
          status: "approved",
          launchStatus: "live",
        })
      } else {
        await db
          .update(launches)
          .set({
            isoYear: currentYear,
            isoWeek: currentWeek,
            startDate: weekStart,
            endDate: weekEnd,
            tier: item.tier,
            status: "approved",
            launchStatus: "live",
            updatedAt: now,
          })
          .where(eq(launches.id, existingLaunch[0].id))
      }

      seededCount++
      console.log(`[${seededCount}/${seedToolsData.length}] Seeded: ${item.name} (${item.slug})`)
    }
  }

  console.log(`✨ Successfully seeded ${seededCount} developer tools for LaunchNests!`)
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Failed to seed database:", err)
  process.exit(1)
})
