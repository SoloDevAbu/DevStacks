import { defineRelations } from "drizzle-orm"
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const pricingEnum = pgEnum("pricing", [
  "Free",
  "Freemium",
  "Paid",
  "Open Source",
])

export const tierEnum = pgEnum("tier", ["free", "premium", "premium+"])

export const productStatusEnum = pgEnum("product_status", [
  "pending",
  "approved",
  "rejected",
])

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: text("id").primaryKey(), // auth-provider user ID (e.g. Clerk)
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// ---------------------------------------------------------------------------
// products
// ---------------------------------------------------------------------------

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  submitterId: text("submitter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // General Information
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),

  // Deep Dive
  problemStatement: text("problem_statement"),
  solution: text("solution"),
  uniqueValue: text("unique_value"),

  // Links & Media
  websiteUrl: text("website_url").notNull(),
  logoUrl: text("logo_url"),
  githubUrl: text("github_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  discordUrl: text("discord_url"),

  // Discoverability & SEO/AEO/GEO/ASO
  keywords: text("keywords"), // comma-separated
  targetAudience: text("target_audience"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  aiContext: text("ai_context"),
  geoTarget: text("geo_target"),
  asoCategory: text("aso_category"),

  // Internal classification
  category: text("category"),
  tags: text("tags").array().notNull().default([]),
  platforms: text("platforms").array().notNull().default([]),

  // Pricing & tier
  pricing: pricingEnum("pricing").notNull().default("Free"),
  tier: tierEnum("tier").notNull().default("free"),

  // Moderation
  status: productStatusEnum("status").notNull().default("pending"),

  // Denormalised counters (updated via server actions)
  upvotesCount: integer("upvotes_count").notNull().default(0),
  buildsCount: integer("builds_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  viewsCount: integer("views_count").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// ---------------------------------------------------------------------------
// upvotes
// ---------------------------------------------------------------------------

export const upvotes = pgTable(
  "upvotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("upvotes_product_user_idx").on(t.productId, t.userId)]
)

// ---------------------------------------------------------------------------
// bookmarks
// ---------------------------------------------------------------------------

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("bookmarks_product_user_idx").on(t.productId, t.userId)]
)

// ---------------------------------------------------------------------------
// comments
// ---------------------------------------------------------------------------

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// ---------------------------------------------------------------------------
// builds  (developer showcases — "I built X using this product")
// ---------------------------------------------------------------------------

export const builds = pgTable("builds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),

  // Logo display (mirrors DeveloperBuild frontend type)
  logoText: text("logo_text").notNull(),
  logoBg: text("logo_bg").notNull(),

  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  tier: tierEnum("tier").notNull().default("free"),
  viewsCount: integer("views_count").notNull().default(0),
  likesCount: integer("likes_count").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// ---------------------------------------------------------------------------
// build_products  (M2M: which products/tools were used in a build)
// ---------------------------------------------------------------------------

export const buildProducts = pgTable(
  "build_products",
  {
    buildId: uuid("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.buildId, t.productId] })]
)

// ---------------------------------------------------------------------------
// Relations (Drizzle ORM v1 API)
// ---------------------------------------------------------------------------

export const relations = defineRelations(
  { users, products, upvotes, bookmarks, comments, builds, buildProducts },
  (r) => ({
    users: {
      products: r.many.products(),
      upvotes: r.many.upvotes(),
      bookmarks: r.many.bookmarks(),
      comments: r.many.comments(),
      builds: r.many.builds(),
    },
    products: {
      submitter: r.one.users({
        from: r.products.submitterId,
        to: r.users.id,
      }),
      upvotes: r.many.upvotes(),
      bookmarks: r.many.bookmarks(),
      comments: r.many.comments(),
      buildProducts: r.many.buildProducts(),
    },
    upvotes: {
      product: r.one.products({
        from: r.upvotes.productId,
        to: r.products.id,
      }),
      user: r.one.users({
        from: r.upvotes.userId,
        to: r.users.id,
      }),
    },
    bookmarks: {
      product: r.one.products({
        from: r.bookmarks.productId,
        to: r.products.id,
      }),
      user: r.one.users({
        from: r.bookmarks.userId,
        to: r.users.id,
      }),
    },
    comments: {
      product: r.one.products({
        from: r.comments.productId,
        to: r.products.id,
      }),
      user: r.one.users({
        from: r.comments.userId,
        to: r.users.id,
      }),
    },
    builds: {
      author: r.one.users({
        from: r.builds.authorId,
        to: r.users.id,
      }),
      buildProducts: r.many.buildProducts(),
    },
    buildProducts: {
      build: r.one.builds({
        from: r.buildProducts.buildId,
        to: r.builds.id,
      }),
      product: r.one.products({
        from: r.buildProducts.productId,
        to: r.products.id,
      }),
    },
  })
)

// ---------------------------------------------------------------------------
// Inferred TypeScript types
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type Upvote = typeof upvotes.$inferSelect
export type NewUpvote = typeof upvotes.$inferInsert

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export type Build = typeof builds.$inferSelect
export type NewBuild = typeof builds.$inferInsert

export type BuildProduct = typeof buildProducts.$inferSelect
export type NewBuildProduct = typeof buildProducts.$inferInsert
