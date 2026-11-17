import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const POSTGRESQL_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "postgresql",
  toolName: "PostgreSQL",
  intro:
    "PostgreSQL is open source, released under the permissive PostgreSQL License, and is free to use, modify and distribute. Teams look at alternatives for simpler operations (MySQL, MariaDB), an embedded database with no server (SQLite), or horizontal scale-out while keeping Postgres compatibility (YugabyteDB, CockroachDB).",
  stickWith: [
    "You rely on its extensions such as PostGIS, pgvector or TimescaleDB.",
    "You want strict SQL standards compliance and rich data types like JSONB.",
    "Your managed host or serverless provider already runs Postgres.",
  ],
  switchWhen: [
    "Your app or hosting is built around MySQL (MySQL, MariaDB).",
    "You need an embedded, zero-configuration database inside the app (SQLite).",
    "One primary node can no longer handle your writes across regions (YugabyteDB, CockroachDB).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "MySQL",
      websiteUrl: "https://www.mysql.com",
      bestFor:
        "The widely hosted relational database, with a GPL-licensed community edition.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Linux, Windows, macOS, Cloud",
      tags: ["Relational", "Widely hosted"],
    },
    {
      name: "MariaDB",
      websiteUrl: "https://mariadb.org",
      bestFor:
        "A community-developed fork of MySQL that stays compatible with its clients.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, Windows, macOS",
      tags: ["MySQL compatible", "Community"],
    },
    {
      name: "SQLite",
      websiteUrl: "https://sqlite.org",
      bestFor:
        "An embedded, serverless database in a single file, in the public domain.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Embedded, Edge, Mobile",
      tags: ["Embedded", "Zero config"],
    },
    {
      name: "YugabyteDB",
      websiteUrl: "https://www.yugabyte.com",
      bestFor:
        "Distributed SQL that reuses the Postgres query layer and scales out across regions.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Self-hosted, Cloud",
      tags: ["Distributed SQL", "Postgres compatible"],
    },
    {
      name: "CockroachDB",
      websiteUrl: "https://www.cockroachlabs.com",
      bestFor:
        "Resilient distributed SQL with the Postgres wire protocol and multi-region writes.",
      license: "Source Available",
      pricing: PRICING.FREEMIUM,
      platforms: "Self-hosted, Cloud",
      tags: ["Distributed SQL", "Multi-region"],
    },
    {
      name: "Microsoft SQL Server",
      websiteUrl: "https://www.microsoft.com/sql-server",
      bestFor:
        "Microsoft's relational database for .NET and Windows shops, with free Express edition.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Windows, Linux, Azure",
      tags: ["Microsoft", "Enterprise"],
    },
  ],
}
