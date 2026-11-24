import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { GlossaryTerm } from "@/types/glossary"

export const DEV_TOOL_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "orm",
    term: "ORM (Object-Relational Mapper)",
    article: "an",
    aliases: ["ORM", "object-relational mapping"],
    category: "dev-tools",
    shortDefinition:
      "An ORM is a library that maps database tables to objects or types in application code, so developers can query and update data without writing most SQL by hand.",
    definition: [
      "An object-relational mapper sits between application code and a relational database. It turns rows into objects, builds queries from method calls and often manages schema migrations.",
      "ORMs range from heavy abstractions that hide SQL to thin, type-safe query builders that stay close to it. Prisma, Drizzle ORM, TypeORM and Sequelize are common in the TypeScript ecosystem.",
    ],
    whyItMatters: [
      "Type-safe queries catch many mistakes at compile time.",
      "Migrations keep the schema in version control alongside the code.",
      "Heavy abstractions can hide slow queries, so it matters how close to SQL an ORM stays.",
    ],
    onLaunchNests: `Built With data on ${SITE_CONFIG.name} shows which ORMs makers ship with, and the comparisons below cover the main TypeScript options.`,
    relatedTerms: ["backend-as-a-service", "in-memory-database", "serverless"],
    relatedLinks: [
      { label: "Prisma alternatives", href: ROUTES.ALTERNATIVES("prisma") },
      {
        label: "Drizzle ORM vs Prisma",
        href: ROUTES.COMPARE("drizzle-orm-vs-prisma"),
      },
      { label: "Prisma vs TypeORM", href: ROUTES.COMPARE("prisma-vs-typeorm") },
    ],
    faqs: [
      {
        question: "Should I use an ORM or raw SQL?",
        answer:
          "An ORM speeds up common queries and adds type safety. Raw SQL gives full control for complex or performance-critical queries. Many teams use an ORM and drop to SQL where needed.",
      },
      {
        question: "What is the difference between an ORM and a query builder?",
        answer:
          "A query builder composes SQL with code but returns plain rows; an ORM also maps rows to models and relations. Some tools, such as Drizzle, sit between the two.",
      },
    ],
  },
  {
    slug: "in-memory-database",
    term: "In-Memory Database",
    article: "an",
    aliases: ["in-memory data store", "key-value cache"],
    category: "dev-tools",
    shortDefinition:
      "An in-memory database keeps its data primarily in RAM, giving very fast reads and writes for caching, sessions, queues and real-time features.",
    definition: [
      "Because data lives in memory rather than on disk, operations take microseconds instead of milliseconds. Redis, Valkey, Memcached and Dragonfly are widely used examples.",
      "Some in-memory stores persist snapshots or logs to disk for recovery; others, like Memcached, are pure caches where data can be lost on restart.",
    ],
    whyItMatters: [
      "Caching hot data cuts load on the main database and speeds up pages.",
      "Rich data structures support rate limiting, leaderboards, queues and pub/sub.",
      "Memory is more expensive than disk, so data size and eviction policy matter.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} keeps a hand-checked list of Redis alternatives with licenses and pricing, plus head-to-head comparisons.`,
    relatedTerms: ["orm", "serverless", "cdn"],
    relatedLinks: [
      { label: "Redis alternatives", href: ROUTES.ALTERNATIVES("redis") },
      { label: "Redis vs Valkey", href: ROUTES.COMPARE("redis-vs-valkey") },
      {
        label: "Memcached vs Redis",
        href: ROUTES.COMPARE("memcached-vs-redis"),
      },
    ],
    faqs: [
      {
        question: "Is Redis a database or a cache?",
        answer:
          "Both. Redis is often used as a cache, but it supports persistence and rich data types, so it can serve as a primary store for some workloads.",
      },
      {
        question: "What happens to in-memory data on restart?",
        answer:
          "It depends on the store. Redis and Valkey can reload from snapshots or append-only files; Memcached starts empty.",
      },
    ],
  },
  {
    slug: "container-runtime",
    term: "Container Runtime",
    article: "a",
    aliases: ["container engine", "OCI runtime"],
    category: "dev-tools",
    shortDefinition:
      "A container runtime is the software that pulls container images and runs them as isolated processes on a host.",
    definition: [
      "Container tooling has layers. Low-level runtimes such as runc create the isolated process; higher-level runtimes such as containerd and CRI-O manage images and lifecycles; engines such as Docker and Podman add the CLI and build tools developers use.",
      "Because images follow the OCI standard, the same image can usually run on Docker, Podman, containerd or Kubernetes.",
    ],
    whyItMatters: [
      "It determines how containers are built, run and secured on a machine or cluster.",
      "Daemonless and rootless runtimes reduce the attack surface.",
      "Licensing and desktop app pricing differ between options, which matters for larger teams.",
    ],
    onLaunchNests: `${SITE_CONFIG.name}'s Docker alternatives list compares runtimes and desktop apps on license, pricing and platforms.`,
    relatedTerms: ["serverless", "headless-browser", "end-to-end-testing"],
    relatedLinks: [
      { label: "Docker alternatives", href: ROUTES.ALTERNATIVES("docker") },
      { label: "Docker vs Podman", href: ROUTES.COMPARE("docker-vs-podman") },
      {
        label: "containerd vs Docker",
        href: ROUTES.COMPARE("containerd-vs-docker"),
      },
    ],
    faqs: [
      {
        question: "Is Docker a container runtime?",
        answer:
          "Docker Engine is a full container platform that uses containerd and runc underneath. People often call the whole stack a runtime.",
      },
      {
        question: "Does Kubernetes still use Docker?",
        answer:
          "Kubernetes removed its built-in Docker shim in version 1.24 and talks to runtimes like containerd or CRI-O directly. Docker-built images still run fine.",
      },
    ],
  },
  {
    slug: "headless-browser",
    term: "Headless Browser",
    article: "a",
    aliases: ["headless Chrome", "browser automation"],
    category: "dev-tools",
    shortDefinition:
      "A headless browser is a real web browser that runs without a visible window, controlled by code for testing, scraping, screenshots and PDF generation.",
    definition: [
      "Headless Chromium, Firefox and WebKit render pages and run JavaScript exactly as a normal browser does, but expose an API instead of a user interface.",
      "Libraries such as Playwright, Puppeteer and Selenium drive headless browsers to click, type, wait for elements and read the resulting page.",
    ],
    whyItMatters: [
      "End-to-end tests can run in CI without a display.",
      "Pages that render content with JavaScript can be captured or checked automatically.",
      "Screenshot, PDF and monitoring services are built on headless browsers.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} compares the main browser automation tools on license, supported browsers and when to choose each.`,
    relatedTerms: ["end-to-end-testing", "api-client", "container-runtime"],
    relatedLinks: [
      {
        label: "Playwright alternatives",
        href: ROUTES.ALTERNATIVES("playwright"),
      },
      {
        label: "Playwright vs Puppeteer",
        href: ROUTES.COMPARE("playwright-vs-puppeteer"),
      },
      {
        label: "Playwright vs Selenium",
        href: ROUTES.COMPARE("playwright-vs-selenium"),
      },
    ],
    faqs: [
      {
        question: "Is a headless browser faster than a normal one?",
        answer:
          "Somewhat, because it skips drawing to a screen, but it still loads and runs pages fully.",
      },
      {
        question: "Can websites detect headless browsers?",
        answer:
          "Often yes, through browser fingerprints. That is why testing your own site is straightforward but scraping others' sites can be blocked.",
      },
    ],
  },
  {
    slug: "end-to-end-testing",
    term: "End-to-End Testing",
    aliases: ["E2E testing", "e2e tests"],
    category: "dev-tools",
    shortDefinition:
      "End-to-end testing checks a whole application the way a user would, from the interface through the backend and database, usually by automating a real browser.",
    definition: [
      "An E2E test signs in, clicks through a flow and asserts on what appears, exercising every layer together. It sits at the top of the testing pyramid, above unit and integration tests.",
      "Playwright, Cypress, Selenium and WebdriverIO are common E2E frameworks for web apps.",
    ],
    whyItMatters: [
      "It catches breakages that unit tests miss, such as a broken checkout flow.",
      "It gives confidence to deploy often.",
      "E2E tests are slower and flakier than unit tests, so teams keep them focused on critical paths.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} has hand-checked comparisons of the main E2E testing frameworks.`,
    relatedTerms: ["headless-browser", "api-client"],
    relatedLinks: [
      {
        label: "Cypress vs Playwright",
        href: ROUTES.COMPARE("cypress-vs-playwright"),
      },
      {
        label: "Playwright vs WebdriverIO",
        href: ROUTES.COMPARE("playwright-vs-webdriverio"),
      },
      {
        label: "Playwright alternatives",
        href: ROUTES.ALTERNATIVES("playwright"),
      },
    ],
    faqs: [
      {
        question: "How many end-to-end tests should a project have?",
        answer:
          "Few, compared with unit tests. Cover the flows that make money or would cause real damage if broken, such as sign-up, checkout and core actions.",
      },
      {
        question: "How do you reduce flaky E2E tests?",
        answer:
          "Wait for specific elements or network states instead of fixed timeouts, isolate test data, and use a framework with automatic waiting.",
      },
    ],
  },
  {
    slug: "api-client",
    term: "API Client",
    article: "an",
    aliases: ["REST client", "HTTP client"],
    category: "dev-tools",
    shortDefinition:
      "An API client is a tool for building, sending and saving HTTP requests so developers can explore, test and document APIs.",
    definition: [
      "Desktop and web API clients let developers set methods, headers, auth and bodies, then inspect responses. Requests are saved in collections that can be shared with a team or run as tests.",
      "Postman, Insomnia, Bruno, Hoppscotch and Thunder Client differ mainly in whether collections are stored in the cloud or as files in the repository, and in licensing.",
    ],
    whyItMatters: [
      "It speeds up debugging and exploring third-party APIs.",
      "Shared collections document how an API is actually called.",
      "File-based collections can be reviewed in pull requests alongside code.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} keeps a hand-checked list of Postman alternatives and compares them head to head.`,
    relatedTerms: [
      "end-to-end-testing",
      "model-context-protocol",
      "serverless",
    ],
    relatedLinks: [
      { label: "Postman alternatives", href: ROUTES.ALTERNATIVES("postman") },
      { label: "Bruno vs Postman", href: ROUTES.COMPARE("bruno-vs-postman") },
      {
        label: "Insomnia vs Postman",
        href: ROUTES.COMPARE("insomnia-vs-postman"),
      },
    ],
    faqs: [
      {
        question: "Can I use curl instead of an API client?",
        answer:
          "Yes for quick requests. API clients add saved collections, environments, auth helpers and readable responses, which help for repeated or shared work.",
      },
      {
        question: "Why do teams move to file-based API clients?",
        answer:
          "Storing collections as files keeps them in git, avoids cloud sync of secrets and lets changes be reviewed with the code.",
      },
    ],
  },
  {
    slug: "cdn",
    term: "CDN (Content Delivery Network)",
    article: "a",
    aliases: ["CDN", "content delivery network", "edge network"],
    category: "dev-tools",
    shortDefinition:
      "A content delivery network is a distributed set of servers that caches and serves a site's content from locations close to each visitor.",
    definition: [
      "Instead of every request travelling to one origin server, a CDN answers from a nearby edge location. It caches static files and, increasingly, runs code and caches dynamic pages at the edge.",
      "Modern CDNs such as Cloudflare, Fastly, Amazon CloudFront, Akamai and Bunny.net also provide DDoS protection, TLS, firewalls and edge compute.",
    ],
    whyItMatters: [
      "Lower latency means faster pages and better Core Web Vitals.",
      "Offloading traffic from the origin reduces hosting cost and protects against spikes.",
      "Faster server responses also let search engines crawl more pages.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} itself runs on Cloudflare's edge network, and its Cloudflare alternatives list compares the main CDNs.`,
    relatedTerms: ["serverless", "crawl-budget", "in-memory-database"],
    relatedLinks: [
      {
        label: "Cloudflare alternatives",
        href: ROUTES.ALTERNATIVES("cloudflare"),
      },
      {
        label: "Cloudflare vs Fastly",
        href: ROUTES.COMPARE("cloudflare-vs-fastly"),
      },
      {
        label: "Bunny.net vs Cloudflare",
        href: ROUTES.COMPARE("bunnynet-vs-cloudflare"),
      },
    ],
    faqs: [
      {
        question: "Does a small site need a CDN?",
        answer:
          "It helps even small sites: many CDNs have free tiers, and visitors far from the origin server see much faster load times.",
      },
      {
        question: "Can a CDN cache dynamic pages?",
        answer:
          "Yes, with cache rules or edge compute. Pages that differ per user need care so private content is never cached for everyone.",
      },
    ],
  },
  {
    slug: "serverless",
    term: "Serverless",
    aliases: ["serverless functions", "functions as a service", "FaaS"],
    category: "dev-tools",
    shortDefinition:
      "Serverless is a cloud model where the provider runs your code on demand and handles servers and scaling, and you pay mainly for what you use.",
    definition: [
      "Developers deploy functions or whole apps without managing machines. The platform starts instances per request, scales them automatically and can scale to zero when idle.",
      "Vercel, Netlify, Cloudflare Workers and AWS Lambda are common serverless platforms; trade-offs include cold starts, execution time limits and connection handling for databases.",
    ],
    whyItMatters: [
      "Small teams ship without running servers.",
      "Costs track usage, which suits early products with uneven traffic.",
      "Database connections need pooling or HTTP drivers because instances are short-lived.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} runs serverless on Cloudflare Workers, and its Vercel alternatives list compares the main hosting platforms.`,
    relatedTerms: ["cdn", "backend-as-a-service", "container-runtime"],
    relatedLinks: [
      { label: "Vercel alternatives", href: ROUTES.ALTERNATIVES("vercel") },
      { label: "Netlify vs Vercel", href: ROUTES.COMPARE("netlify-vs-vercel") },
      {
        label: "Cloudflare vs Vercel",
        href: ROUTES.COMPARE("cloudflare-vs-vercel"),
      },
    ],
    faqs: [
      {
        question: "Does serverless mean there are no servers?",
        answer:
          "No. Servers still run the code, but the provider manages them, so developers never configure or patch them.",
      },
      {
        question: "What is a cold start?",
        answer:
          "The delay when a platform starts a new instance to handle a request. It ranges from milliseconds on edge runtimes to seconds for larger functions.",
      },
    ],
  },
  {
    slug: "backend-as-a-service",
    term: "Backend as a Service (BaaS)",
    aliases: ["BaaS", "backend platform"],
    category: "dev-tools",
    shortDefinition:
      "Backend as a Service is a hosted platform that provides a ready-made backend: database, authentication, file storage and APIs, so developers can focus on the front end.",
    definition: [
      "A BaaS bundles the pieces most apps need behind SDKs and generated APIs. Firebase popularised the model; Supabase, Appwrite and PocketBase offer open-source options.",
      "The trade-off is speed now against flexibility later: data models, auth and pricing follow the platform's design.",
    ],
    whyItMatters: [
      "It cuts weeks of backend work for an MVP.",
      "Auth, storage and real-time features come built in.",
      "Lock-in, pricing at scale and self-hosting options differ widely between providers.",
    ],
    onLaunchNests: `Many ${SITE_CONFIG.name} launches are built on a BaaS, and the Supabase alternatives list compares the main options.`,
    relatedTerms: ["mvp", "serverless", "orm"],
    relatedLinks: [
      { label: "Supabase alternatives", href: ROUTES.ALTERNATIVES("supabase") },
      {
        label: "Firebase vs Supabase",
        href: ROUTES.COMPARE("firebase-vs-supabase"),
      },
      {
        label: "Appwrite vs Supabase",
        href: ROUTES.COMPARE("appwrite-vs-supabase"),
      },
    ],
    faqs: [
      {
        question: "Is a BaaS good for production apps?",
        answer:
          "Yes, many production apps run on one. Check pricing at your expected scale, data export options and whether you can self-host if needed.",
      },
      {
        question:
          "What is the difference between a BaaS and serverless hosting?",
        answer:
          "Serverless hosting runs your own backend code; a BaaS gives you a pre-built backend you configure rather than write.",
      },
    ],
  },
  {
    slug: "merchant-of-record",
    term: "Merchant of Record (MoR)",
    article: "a",
    aliases: ["MoR", "merchant of record"],
    category: "dev-tools",
    shortDefinition:
      "A merchant of record is the company that legally sells a product to the customer, taking responsibility for payments, sales tax, VAT, refunds and chargebacks.",
    definition: [
      "With a payment processor such as Stripe, your company is the seller and must register for and remit sales taxes. With an MoR such as Paddle or Lemon Squeezy, the MoR resells your product and handles global tax compliance for you.",
      "MoRs usually charge a higher fee than a processor in exchange for handling tax registration, invoicing and many disputes.",
    ],
    whyItMatters: [
      "Selling software worldwide can create tax obligations in many countries.",
      "An MoR lets small teams sell globally without registering for tax everywhere.",
      "Higher fees and less control over the checkout are the trade-offs.",
    ],
    onLaunchNests: `${SITE_CONFIG.name}'s Stripe alternatives list marks which options act as a merchant of record and which are processors.`,
    relatedTerms: ["indie-hacker", "backend-as-a-service"],
    relatedLinks: [
      { label: "Stripe alternatives", href: ROUTES.ALTERNATIVES("stripe") },
      { label: "Paddle vs Stripe", href: ROUTES.COMPARE("paddle-vs-stripe") },
      {
        label: "Lemon Squeezy vs Stripe",
        href: ROUTES.COMPARE("lemon-squeezy-vs-stripe"),
      },
    ],
    faqs: [
      {
        question: "Is Stripe a merchant of record?",
        answer:
          "Stripe's standard payments product is a processor, so you remain the seller. Stripe owns Lemon Squeezy, which operates as a merchant of record.",
      },
      {
        question: "When should a startup use a merchant of record?",
        answer:
          "When selling digital products to customers in many countries without a team to handle tax registration and filing.",
      },
    ],
  },
]
