import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { users } from "../schema"

export interface ExtractedAiData {
  name: string
  tagline: string
  description: string
  problemStatement?: string
  solution?: string
  uniqueValue?: string
  useCases?: string
  platforms: string[]
  tags: string[]
  builtWithTools: Array<{
    name: string
    toolSlug?: string
    toolId?: string
  }>
  githubUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
  discordUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  chromeExtensionUrl?: string
  logoUrl?: string
}

export const urlAiCache = pgTable(
  "url_ai_cache",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    normalizedUrl: text("normalized_url").notNull().unique(),
    extractedData: jsonb("extracted_data").$type<ExtractedAiData>().notNull(),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("url_ai_cache_normalized_url_idx").on(table.normalizedUrl),
    index("url_ai_cache_created_at_idx").on(table.createdAt),
  ]
)

