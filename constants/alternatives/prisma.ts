import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const PRISMA_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "prisma",
  toolName: "Prisma",
  intro:
    "Prisma ORM is an open-source TypeScript ORM built around a schema file, generated client and migrations. Alternatives either stay closer to SQL with full type safety (Drizzle ORM, Kysely), follow the classic decorator or model-based ORM style (TypeORM, MikroORM, Sequelize), or drop the ORM for a query builder (Knex.js).",
  stickWith: [
    "You like a single schema file that drives types, migrations and Prisma Studio.",
    "Your team values its query API over writing SQL.",
    "You use Prisma's managed services alongside the ORM.",
  ],
  switchWhen: [
    "You want SQL-like queries with no code generation step (Drizzle ORM, Kysely).",
    "You need the Unit of Work and identity map patterns (MikroORM).",
    "You prefer a decorator-based entity model familiar from Java or .NET (TypeORM).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Drizzle ORM",
      websiteUrl: "https://orm.drizzle.team",
      toolSlug: "drizzle-orm",
      bestFor:
        "A lightweight TypeScript ORM with SQL-like syntax and no code generation.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js, Bun, Edge",
      tags: ["TypeScript", "SQL-like"],
    },
    {
      name: "Kysely",
      websiteUrl: "https://kysely.dev",
      bestFor:
        "A type-safe SQL query builder for TypeScript that infers result types from your schema.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js, Deno, Bun, Edge",
      tags: ["Query builder", "Type-safe"],
    },
    {
      name: "TypeORM",
      websiteUrl: "https://typeorm.io",
      bestFor:
        "Decorator-based entities with Active Record or Data Mapper patterns.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js",
      tags: ["Decorators", "Data Mapper"],
    },
    {
      name: "MikroORM",
      websiteUrl: "https://mikro-orm.io",
      bestFor:
        "A TypeScript ORM with Unit of Work and identity map, for complex domain models.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js",
      tags: ["Unit of Work", "TypeScript"],
    },
    {
      name: "Sequelize",
      websiteUrl: "https://sequelize.org",
      bestFor:
        "A long-established promise-based ORM for Postgres, MySQL, MariaDB, SQLite and SQL Server.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js",
      tags: ["Mature", "Multi-database"],
    },
    {
      name: "Knex.js",
      websiteUrl: "https://knexjs.org",
      bestFor:
        "A flexible SQL query builder with migrations, when you do not want an ORM at all.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js",
      tags: ["Query builder", "Migrations"],
    },
  ],
}
