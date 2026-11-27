import type { ToolPairNotes } from "@/types/alternatives"

export const POSTGRESQL_PAIRS: ToolPairNotes = {
  mysql: {
    verdict:
      "MySQL is the most widely deployed open-source relational database, simple to run and fast for read-heavy web workloads. PostgreSQL offers richer SQL, stricter standards, JSONB and an extension ecosystem (PostGIS, pgvector).",
    chooseTool: [
      "You need advanced SQL, JSONB queries, full-text search or extensions such as pgvector.",
      "You want strict data integrity and powerful indexing options.",
    ],
    chooseAlternative: [
      "Your stack or host is built around MySQL, for example WordPress or Laravel defaults.",
      "You want simple replication and a large pool of MySQL-experienced operators.",
    ],
  },
  sqlite: {
    verdict:
      "SQLite is an embedded, serverless database stored in a single file, ideal for local apps, mobile and edge. PostgreSQL is a client-server database built for many concurrent writers.",
    chooseTool: [
      "Many users write concurrently, or you need roles, replication and a network server.",
      "You expect large datasets and complex analytical queries.",
    ],
    chooseAlternative: [
      "You build a desktop, mobile or single-server app and want zero administration.",
      "You use edge SQLite services such as Turso or Cloudflare D1.",
    ],
  },
  mariadb: {
    verdict:
      "MariaDB is a community fork of MySQL with extra storage engines and features. PostgreSQL is a different engine with richer SQL and extensions.",
    chooseTool: [
      "You want extensions, advanced data types and complex queries.",
      "You are starting a new project without a MySQL legacy.",
    ],
    chooseAlternative: [
      "You run a MySQL-compatible stack and want a GPL, community-governed option.",
      "You want MariaDB-specific engines such as ColumnStore.",
    ],
  },
  cockroachdb: {
    verdict:
      "CockroachDB is a distributed SQL database that speaks the PostgreSQL wire protocol and survives node and region failures automatically. PostgreSQL is a single-primary database with a far larger ecosystem.",
    chooseTool: [
      "One primary with replicas meets your availability needs.",
      "You need the full Postgres extension ecosystem.",
    ],
    chooseAlternative: [
      "You need multi-region writes and automatic failover without manual sharding.",
      "You can accept CockroachDB's licensing and partial Postgres compatibility.",
    ],
  },
}

export const SUPABASE_PAIRS: ToolPairNotes = {
  firebase: {
    verdict:
      "Firebase is Google's backend platform built on Firestore (a NoSQL document database), with auth, hosting, cloud functions and analytics. Supabase is open source and built on Postgres, so your data is relational and portable.",
    chooseTool: [
      "You want SQL, relations and row-level security on Postgres.",
      "You want to self-host or avoid vendor lock-in.",
    ],
    chooseAlternative: [
      "You build mobile apps that need offline sync, push notifications and Google Analytics.",
      "Your data fits a document model and you are already on Google Cloud.",
    ],
  },
  neon: {
    verdict:
      "Neon is serverless Postgres with instant branching and scale-to-zero, focused on the database alone. Supabase bundles Postgres with auth, storage, realtime and edge functions.",
    chooseTool: [
      "You want auth, storage and realtime in one backend.",
      "You prefer one dashboard for your whole backend.",
    ],
    chooseAlternative: [
      "You only need Postgres and bring your own auth and storage.",
      "You want database branches per pull request and scale-to-zero billing.",
    ],
  },
  appwrite: {
    verdict:
      "Appwrite is an open-source backend with auth, databases, storage, functions and messaging, using its own document-style database API. Supabase exposes real Postgres with SQL access.",
    chooseTool: [
      "You want SQL and the Postgres ecosystem.",
      "You need complex queries, joins and reporting.",
    ],
    chooseAlternative: [
      "You want a document-style API with many SDKs, including Flutter and Apple platforms.",
      "You want built-in messaging (email, SMS, push).",
    ],
  },
  pocketbase: {
    verdict:
      "PocketBase is a single Go binary with SQLite, auth, file storage, realtime and an admin UI. Supabase is a larger, Postgres-based platform for apps that need to scale.",
    chooseTool: [
      "You expect growth, many concurrent users or a team-managed backend.",
      "You want hosted infrastructure with backups and support.",
    ],
    chooseAlternative: [
      "You want a tiny self-hosted backend for prototypes, internal tools or side projects.",
      "You want to deploy the backend as one file on a small VPS.",
    ],
  },
}

export const ALGOLIA_PAIRS: ToolPairNotes = {
  meilisearch: {
    verdict:
      "Meilisearch is an open-source, typo-tolerant search engine you can self-host or use on Meilisearch Cloud, with a developer experience similar to Algolia's. Algolia is fully hosted, with enterprise features such as AI ranking and merchandising.",
    chooseTool: [
      "You want a hosted service with merchandising, analytics and enterprise SLAs.",
      "Search volume and features matter more than cost.",
    ],
    chooseAlternative: [
      "You want to self-host or keep search costs predictable.",
      "You want an open-source engine with an Algolia-like developer experience.",
    ],
  },
  typesense: {
    verdict:
      "Typesense is an open-source, in-memory search engine with typo tolerance, faceting and vector search, available self-hosted or on Typesense Cloud. Algolia is a proprietary hosted service priced by usage.",
    chooseTool: [
      "You want no infrastructure and advanced e-commerce features.",
      "You need Algolia's InstantSearch ecosystem and analytics as-is.",
    ],
    chooseAlternative: [
      "You want fast, typo-tolerant search with predictable, resource-based pricing.",
      "You want to self-host under the GPL.",
    ],
  },
  elasticsearch: {
    verdict:
      "Elasticsearch is a distributed search and analytics engine used for logs, observability and large-scale search. Algolia is a managed search API focused on fast front-end search.",
    chooseTool: [
      "You want instant site or app search without running clusters.",
      "Relevance tuning through a dashboard matters to non-engineers.",
    ],
    chooseAlternative: [
      "You need log analytics, aggregations or very large datasets.",
      "You have the team to run and tune clusters, or use Elastic Cloud.",
    ],
  },
  opensearch: {
    verdict:
      "OpenSearch is the Apache-2.0 fork of Elasticsearch, governed by the Linux Foundation and offered as a managed service on AWS. Algolia is a hosted search API for product and site search.",
    chooseTool: [
      "You want hosted, low-latency product search with minimal operations.",
      "You want built-in merchandising and analytics.",
    ],
    chooseAlternative: [
      "You want an open-source engine for search and log analytics.",
      "You already run on AWS and want Amazon OpenSearch Service.",
    ],
  },
}

export const OPENAI_API_PAIRS: ToolPairNotes = {
  "anthropic-claude-api": {
    verdict:
      "Anthropic's Claude API offers the Claude model family, known for long context, coding and careful instruction following. The OpenAI API offers GPT models plus image, audio, realtime and embeddings endpoints under one account.",
    chooseTool: [
      "You need images, audio, realtime voice or embeddings from the same provider.",
      "Your stack already uses OpenAI SDKs and Assistants or Responses APIs.",
    ],
    chooseAlternative: [
      "You build coding agents or long-document workflows where Claude performs well.",
      "You want prompt caching and tool use with Claude's safety approach.",
    ],
  },
  "google-gemini-api": {
    verdict:
      "Google's Gemini API offers multimodal Gemini models with very long context windows and a free tier through Google AI Studio, plus Vertex AI for enterprises. The OpenAI API offers GPT models and a broad set of endpoints.",
    chooseTool: [
      "You want OpenAI's model lineup and ecosystem of tools and tutorials.",
      "Your app already depends on OpenAI-specific endpoints.",
    ],
    chooseAlternative: [
      "You process very long documents, video or audio in one request.",
      "You want a free tier for prototyping or Google Cloud billing.",
    ],
  },
  "mistral-ai": {
    verdict:
      "Mistral AI is a European provider with open-weight and commercial models available through its API or self-hosted. OpenAI offers proprietary models only through its API and Azure.",
    chooseTool: [
      "You want the widest range of capabilities from one provider.",
      "You do not need to self-host model weights.",
    ],
    chooseAlternative: [
      "You want open-weight models you can run on your own infrastructure.",
      "EU data residency or a European vendor matters to you.",
    ],
  },
  openrouter: {
    verdict:
      "OpenRouter is a router that gives one OpenAI-compatible API and one bill across hundreds of models from many providers. The OpenAI API gives direct access to OpenAI models only.",
    chooseTool: [
      "You only use OpenAI models and want direct pricing and features first.",
      "You need OpenAI-specific endpoints such as realtime or batch.",
    ],
    chooseAlternative: [
      "You want to switch between Claude, Gemini, Llama and others without new integrations.",
      "You want provider fallback and model comparison through one key.",
    ],
  },
}

export const STRIPE_PAIRS: ToolPairNotes = {
  paddle: {
    verdict:
      "Paddle is a merchant of record: it sells your software on your behalf and handles global sales tax and VAT, invoicing and compliance. Stripe is a payment processor, so you remain the merchant (Stripe Tax helps with calculation).",
    chooseTool: [
      "You want full control of checkout, payouts and the lowest processing fees.",
      "You need marketplaces, Connect, physical goods or complex billing.",
    ],
    chooseAlternative: [
      "You sell software globally and do not want to register for sales tax and VAT yourself.",
      "You want one vendor to handle tax remittance, refunds and chargebacks.",
    ],
  },
  "lemon-squeezy": {
    verdict:
      "Lemon Squeezy is a merchant of record for digital products and SaaS, now owned by Stripe, with built-in storefronts, licence keys and affiliates. Stripe is the underlying processor where you are the merchant.",
    chooseTool: [
      "You want the full Stripe API, Connect and custom checkout flows.",
      "You already handle sales-tax registration yourself.",
    ],
    chooseAlternative: [
      "You are a solo maker selling digital products and want tax handled for you.",
      "You want licence keys, a storefront and affiliates without building them.",
    ],
  },
  braintree: {
    verdict:
      "Braintree is PayPal's payment gateway, offering PayPal and Venmo natively alongside cards. Stripe has broader developer tooling, billing and global payment methods.",
    chooseTool: [
      "You want Stripe Billing, Checkout and a large ecosystem of integrations.",
      "You need many local payment methods worldwide.",
    ],
    chooseAlternative: [
      "PayPal and Venmo are your customers' preferred ways to pay.",
      "You already have a PayPal merchant relationship.",
    ],
  },
  adyen: {
    verdict:
      "Adyen is an enterprise payments platform with in-person terminals, direct acquiring in many markets and unified commerce. Stripe offers self-serve onboarding and developer-first APIs for companies of every size.",
    chooseTool: [
      "You want to start accepting payments today with self-serve onboarding.",
      "You are a startup or SaaS company that values developer tooling.",
    ],
    chooseAlternative: [
      "You process high volumes across countries and in physical stores.",
      "You want direct acquiring and enterprise pricing negotiations.",
    ],
  },
}

export const CLERK_PAIRS: ToolPairNotes = {
  auth0: {
    verdict:
      "Auth0, now part of Okta, is a mature identity platform with universal login, enterprise connections and extensibility, free up to 25,000 monthly active users. Clerk focuses on modern React and Next.js apps with drop-in components, and is free up to 50,000 monthly retained users per app.",
    chooseTool: [
      "You build with React or Next.js and want sign-in and profile UI that works out of the box.",
      "You want organisations, roles and subscription billing alongside auth.",
    ],
    chooseAlternative: [
      "You need deep enterprise identity features, custom flows and Okta integration.",
      "You support many frameworks and legacy apps beyond the JavaScript stack.",
    ],
  },
  "better-auth": {
    verdict:
      "Clerk is a hosted service: users live in Clerk and you pay per retained user above the free tier. Better Auth is an MIT-licensed TypeScript library that stores users in your own database, with plugins for organisations, two-factor auth and passkeys, and it now maintains Auth.js.",
    chooseTool: [
      "You want hosted auth with prebuilt UI and no auth tables to manage.",
      "You want bot protection, session management and a user dashboard handled for you.",
    ],
    chooseAlternative: [
      "You want user data in your own Postgres, MySQL or SQLite database.",
      "You want no per-user fees and full control of the auth code.",
    ],
  },
}

export const MONGODB_PAIRS: ToolPairNotes = {
  postgresql: {
    verdict:
      "MongoDB is a document database with flexible schemas, an aggregation pipeline and the managed Atlas service, licensed under the source-available SSPL. PostgreSQL is an open-source relational database whose JSONB columns handle many document workloads while keeping joins, constraints and SQL.",
    chooseTool: [
      "Your data is naturally nested documents with varying shapes.",
      "You want Atlas features such as vector search, full-text search and global clusters in one service.",
    ],
    chooseAlternative: [
      "Your data is relational and you need joins, foreign keys and transactions across tables.",
      "You want a fully open-source database with many managed hosts to choose from.",
    ],
  },
  ferretdb: {
    verdict:
      "FerretDB speaks the MongoDB wire protocol but stores data in PostgreSQL through Microsoft's DocumentDB extension, under the Apache-2.0 licence. MongoDB is the original engine with the full feature set, drivers and tooling.",
    chooseTool: [
      "You need every MongoDB feature, including change streams and Atlas services.",
      "You want the official engine with vendor support.",
    ],
    chooseAlternative: [
      "You want a MongoDB-compatible API under an OSI open-source licence.",
      "You already run Postgres and want document workloads on the same infrastructure.",
    ],
  },
}

export const FIREBASE_PAIRS: ToolPairNotes = {
  appwrite: {
    verdict:
      "Firebase is Google's managed app platform with Firestore, auth, hosting, push messaging and analytics. Appwrite offers similar building blocks under the BSD-3-Clause licence, so you can use Appwrite Cloud or self-host the same stack.",
    chooseTool: [
      "You build mobile apps that need push notifications, Crashlytics and analytics.",
      "You want a managed service with no servers to run, on Google Cloud.",
    ],
    chooseAlternative: [
      "You want to self-host your backend or avoid lock-in to Google Cloud.",
      "You prefer an open-source project you can inspect and extend.",
    ],
  },
  convex: {
    verdict:
      "Firebase pairs a NoSQL document store with a broad set of mobile services. Convex is a reactive backend where queries, mutations and actions are TypeScript functions, clients update in realtime and data is fully typed end to end.",
    chooseTool: [
      "You need mobile services such as push messaging, Crashlytics and Remote Config.",
      "You support Android, iOS, Flutter and Unity apps.",
    ],
    chooseAlternative: [
      "You build a TypeScript web app and want typed, reactive queries without writing sync logic.",
      "You prefer transactional server functions over client-side security rules.",
    ],
  },
}
