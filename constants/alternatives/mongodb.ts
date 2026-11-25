import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const MONGODB_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "mongodb",
  toolName: "MongoDB",
  profile: {
    websiteUrl: "https://www.mongodb.com",
    bestFor:
      "The most popular document database, run yourself as Community Server or as the managed MongoDB Atlas service.",
    license: "Source Available",
    pricing: PRICING.FREEMIUM,
    platforms: "Linux, macOS, Windows, Cloud",
  },
  intro:
    "MongoDB stores JSON-like documents and is licensed under the SSPL, which is source-available rather than OSI open source, with a free Atlas cluster for development. Alternatives either keep the MongoDB wire protocol on another engine (FerretDB, Amazon DocumentDB, Azure Cosmos DB), use Postgres with JSONB instead (PostgreSQL), or offer a different document model (Couchbase, Apache CouchDB, Cloud Firestore).",
  stickWith: [
    "Your data is naturally document-shaped and your team knows the aggregation pipeline.",
    "You want Atlas features such as vector search, full-text search and global clusters in one service.",
    "You rely on MongoDB drivers, Compass and the wider tooling ecosystem.",
  ],
  switchWhen: [
    "You need an OSI open-source licence or a MongoDB-compatible API on Postgres (FerretDB).",
    "Your data has many relations and you want SQL with JSON columns (PostgreSQL).",
    "You are committed to AWS or Azure and want a managed, MongoDB-compatible service there (Amazon DocumentDB, Azure Cosmos DB).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "PostgreSQL",
      websiteUrl: "https://www.postgresql.org",
      toolSlug: "postgresql",
      bestFor:
        "The open-source relational database whose JSONB columns and GIN indexes cover most document workloads.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows, Cloud",
      tags: ["SQL", "JSONB"],
    },
    {
      name: "FerretDB",
      websiteUrl: "https://www.ferretdb.com",
      bestFor:
        "An Apache-2.0 MongoDB-compatible proxy that stores data in Postgres with Microsoft's DocumentDB extension.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows, Self-hosted",
      tags: ["MongoDB compatible", "Postgres"],
    },
    {
      name: "Amazon DocumentDB",
      websiteUrl: "https://aws.amazon.com/documentdb",
      bestFor:
        "AWS's managed document database with MongoDB API compatibility and elastic clusters.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "AWS",
      tags: ["Managed", "AWS"],
    },
    {
      name: "Azure Cosmos DB",
      websiteUrl: "https://azure.microsoft.com/products/cosmos-db",
      bestFor:
        "Microsoft's globally distributed database with a MongoDB API and a lifetime free tier of 1,000 RU/s and 25 GB.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Azure",
      tags: ["Global distribution", "Azure"],
    },
    {
      name: "Couchbase",
      websiteUrl: "https://www.couchbase.com",
      bestFor:
        "A distributed JSON database with SQL++ queries, built-in caching and mobile sync, also sold as Capella.",
      license: "Source Available",
      pricing: PRICING.FREEMIUM,
      platforms: "Linux, macOS, Windows, Cloud",
      tags: ["SQL++", "Mobile sync"],
    },
    {
      name: "Apache CouchDB",
      websiteUrl: "https://couchdb.apache.org",
      bestFor:
        "An Apache document database with an HTTP API and multi-master replication for offline-first apps.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows",
      tags: ["Replication", "Offline-first"],
    },
    {
      name: "Cloud Firestore",
      websiteUrl: "https://firebase.google.com/products/firestore",
      toolSlug: "firebase",
      bestFor:
        "Google's serverless document database with realtime listeners and offline sync for web and mobile.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android, Google Cloud",
      tags: ["Serverless", "Realtime"],
    },
  ],
}
