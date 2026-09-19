import { defineRelations } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
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

export const adPlacementEnum = pgEnum("ad_placement", [
  "sidebar",
  "feed",
  "banner",
])

export const adStatusEnum = pgEnum("ad_status", [
  "pending_payment",
  "active",
  "paused",
  "expired",
  "rejected",
])

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
  "cancelled",
])

export const paymentTypeEnum = pgEnum("payment_type", ["listing", "ad"])

export const statusEnum = pgEnum("status", ["pending", "approved", "rejected"])

export const platformEnum = pgEnum("platform", [
  "Web",
  "iOS",
  "Android",
  "macOS",
  "Windows",
  "Linux",
  "CLI",
  "API",
  "Extension",
  "Plugin",
  "Cloud",
  "Self-Hosted",
])

// ---------------------------------------------------------------------------
// users (Better Auth user table)
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    avatarUrl: text("avatar_url"),

    // Maker profile fields
    username: text("username").unique(),
    bio: text("bio"),
    description: text("description"),
    country: text("country"),
    state: text("state"),
    websiteUrl: text("website_url"),
    twitterUrl: text("twitter_url"),
    githubUrl: text("github_url"),
    linkedinUrl: text("linkedin_url"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("users_country_idx").on(t.country)]
)

// ---------------------------------------------------------------------------
// categories
// ---------------------------------------------------------------------------

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// ---------------------------------------------------------------------------
// tools  — infrastructure / developer tools (Supabase, Stripe, Vercel, etc.)
// ---------------------------------------------------------------------------

export const tools = pgTable(
  "tools",
  {
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
    appStoreUrl: text("app_store_url"),
    playStoreUrl: text("play_store_url"),
    chromeExtensionUrl: text("chrome_extension_url"),
    images: text("images").array().notNull().default([]),
    demoVideoUrl: text("demo_video_url"),
    useCases: text("use_cases"),

    // Discoverability & SEO/AEO/GEO/ASO
    keywords: text("keywords"),
    targetAudience: text("target_audience"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    aiContext: text("ai_context"),
    geoTarget: text("geo_target"),
    asoCategory: text("aso_category"),

    // Classification
    categoryId: uuid("category_id").references(() => categories.id),
    tags: text("tags").array().notNull().default([]),
    platforms: platformEnum("platforms").array().notNull().default([]),

    // Pricing & tier
    pricing: pricingEnum("pricing").notNull().default("Free"),
    tier: tierEnum("tier").notNull().default("free"),

    // Moderation
    status: statusEnum("status").notNull().default("pending"),

    // Denormalised counters
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
  },
  (t) => [
    index("tools_status_idx").on(t.status),
    index("tools_category_id_idx").on(t.categoryId),
    index("tools_pricing_idx").on(t.pricing),
    index("tools_submitter_id_idx").on(t.submitterId),
    index("tools_status_upvotes_idx").on(t.status, t.upvotesCount),
    index("tools_status_created_at_idx").on(t.status, t.createdAt),
    index("tools_tags_idx").using("gin", t.tags),
    index("tools_platforms_idx").using("gin", t.platforms),
  ]
)

// ---------------------------------------------------------------------------
// products  — developer-built apps / projects (MeetWave, InvoiceAI, etc.)
// ---------------------------------------------------------------------------

export const products = pgTable(
  "products",
  {
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
    appStoreUrl: text("app_store_url"),
    playStoreUrl: text("play_store_url"),
    chromeExtensionUrl: text("chrome_extension_url"),
    images: text("images").array().notNull().default([]),
    demoVideoUrl: text("demo_video_url"),
    useCases: text("use_cases"),

    // Discoverability & SEO/AEO/GEO/ASO
    keywords: text("keywords"),
    targetAudience: text("target_audience"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    aiContext: text("ai_context"),
    geoTarget: text("geo_target"),
    asoCategory: text("aso_category"),

    // Classification
    categoryId: uuid("category_id").references(() => categories.id),
    tags: text("tags").array().notNull().default([]),
    platforms: platformEnum("platforms").array().notNull().default([]),

    // Pricing & tier
    pricing: pricingEnum("pricing").notNull().default("Free"),
    tier: tierEnum("tier").notNull().default("free"),

    // Moderation
    status: statusEnum("status").notNull().default("pending"),

    // Denormalised counters (NO upvotesCount, NO buildsCount)
    likesCount: integer("likes_count").notNull().default(0),
    commentsCount: integer("comments_count").notNull().default(0),
    viewsCount: integer("views_count").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("products_status_idx").on(t.status),
    index("products_category_id_idx").on(t.categoryId),
    index("products_pricing_idx").on(t.pricing),
    index("products_submitter_id_idx").on(t.submitterId),
    index("products_status_likes_idx").on(t.status, t.likesCount),
    index("products_status_created_at_idx").on(t.status, t.createdAt),
    index("products_tags_idx").using("gin", t.tags),
    index("products_platforms_idx").using("gin", t.platforms),
  ]
)

// ---------------------------------------------------------------------------
// product_tools  — links products to the tools they were built with
// ---------------------------------------------------------------------------

export const productTools = pgTable(
  "product_tools",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    toolId: uuid("tool_id").references(() => tools.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("product_tools_product_name_idx").on(t.productId, t.name),
    index("product_tools_tool_id_idx").on(t.toolId),
  ]
)

// ---------------------------------------------------------------------------
// tool_upvotes  — toggle upvote on a tool
// ---------------------------------------------------------------------------

export const toolUpvotes = pgTable(
  "tool_upvotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    toolId: uuid("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("tool_upvotes_tool_user_idx").on(t.toolId, t.userId)]
)

// ---------------------------------------------------------------------------
// product_likes  — toggle like on a product
// ---------------------------------------------------------------------------

export const productLikes = pgTable(
  "product_likes",
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
  (t) => [
    uniqueIndex("product_likes_product_user_idx").on(t.productId, t.userId),
  ]
)

// ---------------------------------------------------------------------------
// tool_bookmarks
// ---------------------------------------------------------------------------

export const toolBookmarks = pgTable(
  "tool_bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    toolId: uuid("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("tool_bookmarks_tool_user_idx").on(t.toolId, t.userId)]
)

// ---------------------------------------------------------------------------
// product_bookmarks
// ---------------------------------------------------------------------------

export const productBookmarks = pgTable(
  "product_bookmarks",
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
  (t) => [
    uniqueIndex("product_bookmarks_product_user_idx").on(t.productId, t.userId),
  ]
)

// ---------------------------------------------------------------------------
// tool_comments
// ---------------------------------------------------------------------------

export const toolComments = pgTable(
  "tool_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    toolId: uuid("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("tool_comments_tool_id_idx").on(t.toolId)]
)

// ---------------------------------------------------------------------------
// product_comments
// ---------------------------------------------------------------------------

export const productComments = pgTable(
  "product_comments",
  {
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
  },
  (t) => [index("product_comments_product_id_idx").on(t.productId)]
)

// ---------------------------------------------------------------------------
// maker_faqs
// ---------------------------------------------------------------------------

export const makerFaqs = pgTable(
  "maker_faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("maker_faqs_user_id_idx").on(t.userId),
    index("maker_faqs_user_sort_idx").on(t.userId, t.sortOrder),
  ]
)

// ---------------------------------------------------------------------------
// tool_faqs
// ---------------------------------------------------------------------------

export const toolFaqs = pgTable(
  "tool_faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    toolId: uuid("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("tool_faqs_tool_id_idx").on(t.toolId),
    index("tool_faqs_tool_sort_idx").on(t.toolId, t.sortOrder),
  ]
)

// ---------------------------------------------------------------------------
// product_faqs
// ---------------------------------------------------------------------------

export const productFaqs = pgTable(
  "product_faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("product_faqs_product_id_idx").on(t.productId),
    index("product_faqs_product_sort_idx").on(t.productId, t.sortOrder),
  ]
)

// ---------------------------------------------------------------------------
// sessions (Better Auth session table)
// ---------------------------------------------------------------------------

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("sessions_userId_idx").on(table.userId)]
)

// ---------------------------------------------------------------------------
// accounts (Better Auth account table)
// ---------------------------------------------------------------------------

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    issuer: text("issuer").notNull().default("google"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("accounts_providerId_accountId_uidx").on(
      table.providerId,
      table.accountId
    ),
    uniqueIndex("accounts_issuer_accountId_uidx").on(
      table.issuer,
      table.accountId
    ),
    index("accounts_userId_idx").on(table.userId),
  ]
)

// ---------------------------------------------------------------------------
// verifications (Better Auth verification tokens table)
// ---------------------------------------------------------------------------

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)]
)

// ---------------------------------------------------------------------------
// ads — sponsored ad campaigns (sidebar, feed, banner)
// ---------------------------------------------------------------------------

export const ads = pgTable(
  "ads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Ad Content & Placement
    placement: adPlacementEnum("placement").notNull().default("sidebar"),
    title: text("title").notNull(),
    description: text("description").notNull(),
    badgeText: text("badge_text").notNull().default("PROMOTED"),
    imageUrl: text("image_url"),
    ctaText: text("cta_text").notNull().default("Learn More"),
    ctaUrl: text("cta_url").notNull(),

    // Scheduling & Status
    status: adStatusEnum("status").notNull().default("pending_payment"),
    durationDays: integer("duration_days").notNull().default(30),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),

    // Performance Metrics
    impressionsCount: integer("impressions_count").notNull().default(0),
    clicksCount: integer("clicks_count").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("ads_placement_status_idx").on(t.placement, t.status),
    index("ads_userId_idx").on(t.userId),
    index("ads_endDate_idx").on(t.endDate),
  ]
)

// ---------------------------------------------------------------------------
// payments — Dodo Payments transaction ledger for ads and listing upgrades
// ---------------------------------------------------------------------------

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Payment Category & Associated Entities
    paymentType: paymentTypeEnum("payment_type").notNull(),
    tier: tierEnum("tier"),
    adId: uuid("ad_id").references(() => ads.id, { onDelete: "set null" }),
    toolId: uuid("tool_id").references(() => tools.id, { onDelete: "set null" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),

    // Dodo Payments Gateway References
    dodoPaymentId: text("dodo_payment_id").unique(),
    dodoCheckoutSessionId: text("dodo_checkout_session_id"),
    dodoCustomerId: text("dodo_customer_id"),

    // Financial Details
    amount: integer("amount").notNull(), // amount in cents (e.g. 1500 for $15.00)
    currency: text("currency").notNull().default("USD"),
    status: paymentStatusEnum("status").notNull().default("pending"),

    // Metadata & Timestamps
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("payments_userId_idx").on(t.userId),
    index("payments_dodoPaymentId_idx").on(t.dodoPaymentId),
    index("payments_status_idx").on(t.status),
    index("payments_paymentType_idx").on(t.paymentType),
  ]
)

// ---------------------------------------------------------------------------
// Relations (Drizzle ORM v1 API)
// ---------------------------------------------------------------------------

export const relations = defineRelations(
  {
    users,
    categories,
    tools,
    products,
    productTools,
    toolUpvotes,
    productLikes,
    toolBookmarks,
    productBookmarks,
    toolComments,
    productComments,
    makerFaqs,
    toolFaqs,
    productFaqs,
    sessions,
    accounts,
    ads,
    payments,
  },
  (r) => ({
    users: {
      tools: r.many.tools(),
      products: r.many.products(),
      makerFaqs: r.many.makerFaqs(),
      toolUpvotes: r.many.toolUpvotes(),
      productLikes: r.many.productLikes(),
      toolBookmarks: r.many.toolBookmarks(),
      productBookmarks: r.many.productBookmarks(),
      toolComments: r.many.toolComments(),
      productComments: r.many.productComments(),
      sessions: r.many.sessions(),
      accounts: r.many.accounts(),
      ads: r.many.ads(),
      payments: r.many.payments(),
    },
    categories: {
      tools: r.many.tools(),
      products: r.many.products(),
    },
    sessions: {
      user: r.one.users({ from: r.sessions.userId, to: r.users.id }),
    },
    accounts: {
      user: r.one.users({ from: r.accounts.userId, to: r.users.id }),
    },
    ads: {
      user: r.one.users({ from: r.ads.userId, to: r.users.id }),
      payments: r.many.payments(),
    },
    payments: {
      user: r.one.users({ from: r.payments.userId, to: r.users.id }),
      ad: r.one.ads({ from: r.payments.adId, to: r.ads.id }),
      tool: r.one.tools({ from: r.payments.toolId, to: r.tools.id }),
      product: r.one.products({
        from: r.payments.productId,
        to: r.products.id,
      }),
    },
    tools: {
      submitter: r.one.users({ from: r.tools.submitterId, to: r.users.id }),
      category: r.one.categories({
        from: r.tools.categoryId,
        to: r.categories.id,
      }),
      faqs: r.many.toolFaqs(),
      upvotes: r.many.toolUpvotes(),
      bookmarks: r.many.toolBookmarks(),
      comments: r.many.toolComments(),
      productTools: r.many.productTools(),
      payments: r.many.payments(),
    },
    products: {
      submitter: r.one.users({ from: r.products.submitterId, to: r.users.id }),
      category: r.one.categories({
        from: r.products.categoryId,
        to: r.categories.id,
      }),
      faqs: r.many.productFaqs(),
      likes: r.many.productLikes(),
      bookmarks: r.many.productBookmarks(),
      comments: r.many.productComments(),
      productTools: r.many.productTools(),
      payments: r.many.payments(),
    },
    makerFaqs: {
      user: r.one.users({ from: r.makerFaqs.userId, to: r.users.id }),
    },
    toolFaqs: {
      tool: r.one.tools({ from: r.toolFaqs.toolId, to: r.tools.id }),
    },
    productFaqs: {
      product: r.one.products({
        from: r.productFaqs.productId,
        to: r.products.id,
      }),
    },
    productTools: {
      product: r.one.products({
        from: r.productTools.productId,
        to: r.products.id,
      }),
      tool: r.one.tools({ from: r.productTools.toolId, to: r.tools.id }),
    },
    toolUpvotes: {
      tool: r.one.tools({ from: r.toolUpvotes.toolId, to: r.tools.id }),
      user: r.one.users({ from: r.toolUpvotes.userId, to: r.users.id }),
    },
    productLikes: {
      product: r.one.products({
        from: r.productLikes.productId,
        to: r.products.id,
      }),
      user: r.one.users({ from: r.productLikes.userId, to: r.users.id }),
    },
    toolBookmarks: {
      tool: r.one.tools({ from: r.toolBookmarks.toolId, to: r.tools.id }),
      user: r.one.users({ from: r.toolBookmarks.userId, to: r.users.id }),
    },
    productBookmarks: {
      product: r.one.products({
        from: r.productBookmarks.productId,
        to: r.products.id,
      }),
      user: r.one.users({ from: r.productBookmarks.userId, to: r.users.id }),
    },
    toolComments: {
      tool: r.one.tools({ from: r.toolComments.toolId, to: r.tools.id }),
      user: r.one.users({ from: r.toolComments.userId, to: r.users.id }),
    },
    productComments: {
      product: r.one.products({
        from: r.productComments.productId,
        to: r.products.id,
      }),
      user: r.one.users({ from: r.productComments.userId, to: r.users.id }),
    },
  })
)

// ---------------------------------------------------------------------------
// Inferred TypeScript types
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type Verification = typeof verifications.$inferSelect
export type NewVerification = typeof verifications.$inferInsert

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export type Tool = typeof tools.$inferSelect
export type NewTool = typeof tools.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type ProductTool = typeof productTools.$inferSelect
export type NewProductTool = typeof productTools.$inferInsert

export type ToolUpvote = typeof toolUpvotes.$inferSelect
export type NewToolUpvote = typeof toolUpvotes.$inferInsert

export type ProductLike = typeof productLikes.$inferSelect
export type NewProductLike = typeof productLikes.$inferInsert

export type ToolBookmark = typeof toolBookmarks.$inferSelect
export type NewToolBookmark = typeof toolBookmarks.$inferInsert

export type ProductBookmark = typeof productBookmarks.$inferSelect
export type NewProductBookmark = typeof productBookmarks.$inferInsert

export type ToolComment = typeof toolComments.$inferSelect
export type NewToolComment = typeof toolComments.$inferInsert

export type ProductComment = typeof productComments.$inferSelect
export type NewProductComment = typeof productComments.$inferInsert

export type MakerFaq = typeof makerFaqs.$inferSelect
export type NewMakerFaq = typeof makerFaqs.$inferInsert

export type ToolFaq = typeof toolFaqs.$inferSelect
export type NewToolFaq = typeof toolFaqs.$inferInsert

export type ProductFaq = typeof productFaqs.$inferSelect
export type NewProductFaq = typeof productFaqs.$inferInsert

export type Ad = typeof ads.$inferSelect
export type NewAd = typeof ads.$inferInsert

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
