````markdown
# Homepage Discovery & Ranking System — Required Changes

## Goal

The current homepage ranks tools/products primarily by total upvotes.

This creates a long-term discovery problem:

- Established tools accumulate thousands of votes.
- New tools start with very few votes.
- Established tools permanently occupy the top positions.
- New submissions have very little chance of being discovered.
- This reduces the incentive for makers to submit their products/tools.

We need to change the homepage from an **evergreen popularity leaderboard** into a **discovery-focused feed**.

The core principle should be:

> **Fresh content gets temporary visibility. Great content gets permanent visibility.**

Do NOT turn the entire platform into a weekly-reset launch board. The platform should preserve long-term data and rankings while giving new submissions a fair opportunity to be discovered.

---

# 1. Page Responsibilities

Each page should have a clearly different purpose.

| Page            | Purpose                                          |
| --------------- | ------------------------------------------------ |
| Home / Discover | Discover new, rising, popular tools and products |
| Products        | Browse the complete product directory            |
| Trending        | Rank products/tools based on recent activity     |
| Categories      | Discover products/tools by category              |
| Built With      | Explore Product × Tool relationships             |
| Showcase        | Community builds and build stories               |

The homepage should NOT function as the primary all-time leaderboard.

The Trending page should remain the main ranking/leaderboard page.

---

# 2. Homepage Changes

Keep the existing homepage design and visual style.

Do NOT redesign the entire page.

The main change is the **content hierarchy and ranking logic**.

Current concept:

```text
Discover what you can build with

1. Supabase
2. Vercel
3. Stripe
4. PostHog
...
```
````

Change it to:

```text
Discover what you can build with

✨ New & Rising

Recently added tools and products gaining attention

...

🚀 Rising Products

Products gaining momentum

...

🔗 See What Developers Are Building

Products + their tools

...

🆕 Recently Added

Latest products and tools

...

🔥 Popular Building Blocks

The tools developers are building with

```

The existing right sidebar can remain largely unchanged:

```text
FEATURED

Your Ad Here

RECENTLY PROMOTED
CloudScale
LaunchFast
```

---

# 3. New & Rising — Primary Homepage Section

This should become the most important ranking section on the homepage.

Purpose:

> Give newly submitted products and tools a fair opportunity to be discovered.

Show products/tools that were submitted recently and are receiving activity.

Example:

```text
✨ New & Rising

Recently added tools and products gaining attention

1. NewTool       ↑ 142
2. AnotherTool   ↑ 97
3. CoolTool      ↑ 81
4. NewProduct    ↑ 64

View all →
```

This section should NOT simply sort by creation date.

It should use a combination of:

- Freshness
- Recent upvotes
- Recent views/clicks
- Recent activity
- Build count
- Engagement velocity
- Basic quality/completeness

---

# 4. Give Every New Submission a Discovery Window

Every newly submitted product/tool should receive a temporary freshness period.

Recommended initial value:

```text
7 days
```

During this period, the submission gets a **freshness multiplier/boost** in the New & Rising ranking.

Example lifecycle:

```text
Submission
    ↓
New
    ↓
7-day discovery window
    ↓
New & Rising
    ↓
Permanent ecosystem
```

The 7-day window is NOT a guarantee that the product will rank #1.

It only guarantees that the product is eligible for the fresh-content discovery system.

Do NOT automatically place every new submission at the top.

---

# 5. Freshness Must Be Combined With Engagement

Do NOT implement:

```text
ORDER BY createdAt DESC
```

as the entire New & Rising ranking.

That would make the newest submission #1 regardless of quality or engagement.

Instead, calculate a temporary discovery score.

Conceptually:

```text
Freshness Score =
    recent engagement
    + vote velocity
    + view/click velocity
    + build count
    + quality/completeness
    + freshness
```

The exact weights can be tuned later.

The important concept is:

> Rank new submissions based on how well they are performing relative to their age, not their lifetime totals.

---

# 6. Use Velocity Instead of Only Lifetime Totals

Do NOT use lifetime votes as the primary ranking signal for New & Rising.

Bad:

```text
score = totalUpvotes
```

Better:

```text
score = recentUpvotes + recentViews + recentActivity + freshness
```

Best conceptual model:

```text
recent activity / age
```

This allows a new tool with:

```text
42 votes
600 views
4 builds
2 days old
```

to compete with another newly submitted tool rather than immediately losing to:

```text
Supabase
3,841 votes
45.6K views
82 builds
```

Supabase should remain valuable, but it should not permanently dominate the homepage's fresh-content section.

---

# 7. Popular Building Blocks — Evergreen Section

Keep the existing popularity data.

Do NOT remove lifetime upvotes, views, builds, etc.

Instead, move evergreen popularity into a separate homepage section.

Example:

```text
🔥 Popular Building Blocks

The tools developers are building with

Supabase       82 builds
Stripe         71 builds
Vercel         68 builds
PostHog        34 builds
Resend         29 builds
```

This section should represent long-term ecosystem value.

It can use signals such as:

- Total builds
- Total usage/relationships
- Lifetime views
- Lifetime upvotes
- Overall popularity

This is where established tools such as Supabase, Vercel, Stripe, PostHog, etc. should naturally perform well.

---

# 8. Do Not Remove Established Tools

A tool leaving New & Rising after 7 days does NOT mean:

- Delete it
- Remove its votes
- Remove its views
- Remove its builds
- Reset its ranking
- Hide it from users

Nothing should be reset.

Only the temporary freshness boost should expire.

Example:

```text
Day 1–7:
Freshness multiplier = active

Day 8+:
Freshness multiplier = removed
```

The tool remains permanently available through:

- Search
- Categories
- Built With
- Product pages
- Tool pages
- Popular Building Blocks
- Trending
- Related products

---

# 9. A Product Can Become Trending Again

When clicked view all then for each of these sections create new route /discover/new-rising etc, don't force to other page for redirect which doesn't have a relation with the section.
---

# 10. Trending Page

Keep the existing Trending page.

The existing filters are good:

```text
Today
This Week
This Month
All Time
```

Trending should answer:

> "What's gaining attention right now?"

It should use recent activity.

Example:

```text
Trending

Today | This Week | This Month | All Time

#1 Tool A       ↑ 384
#2 Tool B       ↑ 291
#3 Product C    ↑ 243
#4 Tool D       ↑ 189
```

Do NOT replace Trending with the new homepage system.

Trending and New & Rising have different purposes.

---

# 11. Difference Between New & Rising and Trending

These must remain separate concepts.

## New & Rising

Question:

> "What new things should I discover?"

Characteristics:

- Recently submitted
- Temporary 7-day eligibility
- Freshness matters
- Recent engagement matters
- New makers get an opportunity

Example:

```text
NewTool
2 days old
42 votes
600 views
4 builds

→ New & Rising
```

## Trending

Question:

> "What's gaining momentum?"

Characteristics:

- Can include old or new products
- Based on recent activity
- Time filters
- No requirement to be newly submitted

Example:

```text
OldTool
4 months old
+500 votes this week
+2,000 views this week

→ Trending
```

This distinction is critical.

---

# 12. Rising Products Section

Add a separate homepage section for products gaining momentum.

Example:

```text
🚀 Rising Products

Products getting attention right now

InvoiceAI
Built with Supabase · Stripe · OpenAI

ShipFast
Built with Next.js · Vercel · Stripe

AnalyticsX
Built with PostHog · Next.js · Supabase
```

This section can use recent activity and velocity.

It should not be restricted to newly submitted products.

---

# 13. Recently Added Section

Add a simple chronological discovery section.

Example:

```text
🆕 Recently Added

Latest products and tools

Today
• Tool A
• Tool B
• Product C

Yesterday
• Tool D
• Product E
```

This acts as a fallback discovery mechanism.

Even if a submission does not perform well enough to appear in New & Rising, it is still discoverable.

---

# 14. Built With Must Become a Major Discovery Mechanism

The platform's biggest long-term differentiator is not the leaderboard.

It is:

```text
Products × Tools
```

Every product submission should create relationships with the selected tools.

Example:

```text
InvoiceAI

Built With:
Next.js
Supabase
Stripe
OpenAI
Resend
PostHog
```

This creates:

```text
InvoiceAI
    ↓
Supabase

InvoiceAI
    ↓
Stripe

InvoiceAI
    ↓
OpenAI

InvoiceAI
    ↓
Resend

InvoiceAI
    ↓
PostHog
```

This means a new product has multiple discovery paths.

---

# 15. New Product Discovery Lifecycle

When a new product is submitted:

```text
Product submitted
        ↓
7-day New & Rising eligibility
        ↓
Homepage discovery
        ↓
Category discovery
        ↓
Built With relationships
        ↓
Tool pages
        ↓
Trending if activity increases
        ↓
Permanent ecosystem
```

The product should NOT depend entirely on homepage position.

---

# 16. Tool Discovery Lifecycle

When a new tool is submitted:

```text
Tool submitted
        ↓
7-day New & Rising eligibility
        ↓
Homepage discovery
        ↓
Category
        ↓
Tool page
        ↓
Products using this tool
        ↓
Built With
        ↓
Trending if it gains activity
        ↓
Permanent ecosystem
```

---

# 17. Example of the Ecosystem Flywheel

Suppose someone submits:

```text
InvoiceAI
```

with:

```text
Next.js
Supabase
Stripe
OpenAI
Resend
PostHog
```

The system should automatically make InvoiceAI discoverable through:

### Homepage

```text
New & Rising
```

### Category

```text
AI
SaaS
Payments
```

### Product page

```text
Built With:
Next.js
Supabase
Stripe
OpenAI
Resend
PostHog
```

### Supabase tool page

```text
Products built with Supabase

InvoiceAI
...
```

### Stripe tool page

```text
Products built with Stripe

InvoiceAI
...
```

### Built With

```text
InvoiceAI
→ Supabase
→ Stripe
→ OpenAI
→ Resend
...
```

This creates much more discoverability than relying on a single homepage leaderboard.

---

# 18. Ranking Systems

The platform should conceptually have three different ranking systems.

## A. Popular

Long-term / evergreen ranking.

Signals:

```text
total upvotes
total views
total builds
overall engagement
```

Used for:

```text
Popular Building Blocks
```

---

## B. Trending

Recent momentum.

Signals:

```text
today's activity
weekly activity
monthly activity
recent upvotes
recent views
recent clicks
recent builds
```

Used for:

```text
Trending page
```

with:

```text
Today
This Week
This Month
All Time
```

---

## C. New & Rising

Fresh content + recent momentum.

Signals:

```text
freshness
recent engagement
vote velocity
view/click velocity
build count
quality/completeness
```

Eligibility:

```text
submitted within the last 7 days
```

Used for:

```text
Homepage
```

---

# 19. Important: Avoid a Pay-to-Rank System

Paid promotion should NOT directly manipulate organic ranking.

Do not allow:

```text
Pay more → rank #1 organically
```

Instead:

```text
Organic ranking
        +
Clearly labeled promotion
```

For example:

```text
FEATURED

CloudScale
Sponsored
```

The existing:

```text
Featured
Your Ad Here
Recently Promoted
```

right sidebar can remain separate from organic ranking.

This preserves trust in the ranking system.

---

# 20. Homepage Final Structure

The homepage should ultimately follow this hierarchy:

```text
DISCOVER WHAT YOU CAN BUILD WITH

[ Search tools, APIs, infrastructure... ]


✨ NEW & RISING

Recently added tools and products gaining attention

1. Tool A
2. Tool B
3. Product C
4. Tool D

View all →


🚀 RISING PRODUCTS

Products gaining momentum

Product A
Product B
Product C


🔗 SEE WHAT DEVELOPERS ARE BUILDING

Product A
Built with → Supabase · Stripe · OpenAI

Product B
Built with → Vercel · PostHog · Resend


🆕 RECENTLY ADDED

Latest products and tools


🔥 POPULAR BUILDING BLOCKS

The tools developers are building with

Supabase
Stripe
Vercel
PostHog
Resend

...
```

Right sidebar:

```text
FEATURED

Your Ad Here

RECENTLY PROMOTED
CloudScale
LaunchFast
```

---

# 21. Keep the Existing Visual Design

Do NOT rebuild the entire UI.

The current visual direction is good.

Keep:

- Existing sidebar
- Existing header
- Existing search
- Existing right promotional rail
- Existing cards
- Existing typography
- Existing spacing
- Existing colors
- Existing product/tool card components

The primary work is:

1. Change homepage data selection.
2. Add New & Rising.
3. Add freshness eligibility.
4. Add recent/velocity ranking.
5. Separate evergreen popularity from fresh discovery.
6. Add/strengthen Recently Added.
7. Add/strengthen Rising Products.
8. Preserve existing Trending page.

---

# 22. Suggested Backend/Data Logic

Do not duplicate ranking logic directly inside React components.

Create separate server-side/service functions for each ranking type.

For example:

```text
lib/
  rankings/
    popular.ts
    trending.ts
    new-and-rising.ts
```

Or an equivalent structure following the existing project architecture.

The frontend should consume APIs/hooks such as:

```text
useNewAndRising()
usePopularBuildingBlocks()
useRisingProducts()
useRecentlyAdded()
```

Do NOT write ranking queries directly inside page components.

---

# 23. Suggested Query Concepts

## New & Rising

Eligibility:

```text
createdAt >= now - 7 days
```

Then rank using recent signals.

Conceptually:

```text
newAndRisingScore =
    recentUpvotesWeight
  + recentViewsWeight
  + recentClicksWeight
  + recentBuildsWeight
  + freshnessWeight
```

Use decay so that freshness gradually decreases during the 7-day window.

Do not use lifetime totals as the dominant signal.

---

## Popular Building Blocks

Use evergreen signals:

```text
buildCount
totalViews
totalUpvotes
overallEngagement
```

Prioritize build count heavily because it directly represents the platform's core:

> products built with this tool.

---

## Rising Products

Use recent activity:

```text
recentViews
recentClicks
recentUpvotes
recentBuilds
activityVelocity
```

No strict 7-day submission requirement.

---

## Recently Added

Use:

```text
ORDER BY createdAt DESC
```

This should be intentionally simple.

---

# 24. Don't Overengineer the Algorithm Yet

This is an MVP.

Do NOT introduce:

- Machine learning
- AI ranking
- Personalized feeds
- Complex recommendation systems
- User-specific ranking
- Complicated reputation scores
- Graph algorithms
- Advanced recommendation models

The initial system should be deterministic, understandable, and easy to tune.

Start with simple weighted signals.

---

# 25. Ranking Should Be Tunable

Do not hardcode ranking weights throughout the application.

Keep weights centralized so they can be changed easily later.

Conceptually:

```text
NEW_AND_RISING_WEIGHTS

freshness
recentUpvotes
recentViews
recentClicks
recentBuilds
quality
```

This allows future tuning without rewriting the ranking system.

---

# 26. Edge Cases

Handle these cases:

### New submission with zero activity

It should still be eligible for New & Rising.

Do not hide it simply because it has zero votes.

Its freshness should give it an opportunity.

---

### New submission with strong activity

It should rise quickly.

Example:

```text
2 days old
100 votes
2,000 views
15 builds
```

This should have a strong New & Rising score.

---

### Old product with sudden activity

It should NOT receive the New & Rising freshness boost.

But it SHOULD be able to appear in Trending.

---

### Old popular product

It should remain discoverable through:

- Popular Building Blocks
- Search
- Categories
- Tool pages
- Built With

It should not permanently dominate New & Rising.

---

### Product/tool after 7 days

Remove freshness eligibility only.

Do not remove any historical data.

---

# 27. The Core Product Principle

The system should optimize for:

```text
Discovery
    +
Fairness
    +
Quality
    +
Long-term value
```

Not simply:

```text
Maximum lifetime upvotes
```

The platform needs to serve two groups.

## Users

They want:

> "Show me useful things."

## Makers

They want:

> "Give my new product a chance to be discovered."

The ranking system must satisfy both.

---

# 28. Final Homepage Philosophy

The homepage should answer four questions:

### 1. What's new?

```text
New & Rising
```

### 2. What's popular?

```text
Popular Building Blocks
```

### 3. What's gaining momentum?

```text
Rising Products
```

### 4. What are developers building with?

```text
See What Developers Are Building
Built With
```

The Trending page answers the separate question:

> "What's trending right now?"

---

# 29. Final Rule

Implement the following principle throughout the platform:

> **Fresh content gets temporary visibility. Great content gets permanent visibility.**

A new submission should have a **7-day discovery window**, but not an automatic #1 position.

After the 7 days, its freshness boost expires, while the product/tool remains permanently discoverable through the rest of the ecosystem.

The final discovery flow should be:

```text
NEW
 ↓
NEW & RISING
 ↓
TRENDING (if momentum grows)
 ↓
CATEGORY DISCOVERY
 ↓
BUILT WITH
 ↓
TOOL / PRODUCT PAGES
 ↓
SEARCH
 ↓
PERMANENT ECOSYSTEM
```

This solves the current problem where established tools permanently occupy the top of the homepage, while preserving the long-term value of popularity, votes, views, builds, and the Product × Tool ecosystem.

Do not copy a weekly launch board exactly.

The platform should remain an ecosystem/discovery platform, not become a Product Hunt clone.

```

```
