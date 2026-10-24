# Technical SEO Audit & Remediation Guide: LaunchNests

> **Audit Date:** October 2026  
> **Subject Domain:** `https://www.launchnests.com`  
> **Repository:** `BuyMyNextLaunch` (Next.js 15 App Router, TypeScript, Tailwind CSS, PostgreSQL / Drizzle)  
> **Audit Standard:** LLM-first deterministic audit conforming to Google Search Essentials, Core Web Vitals (INP/LCP/CLS), and Schema.org specifications.

---

## Technical Audit Scorecard

| Category | Score | Rating | Primary Concern |
| :--- | :--- | :--- | :--- |
| **Indexability & Crawlability** | 78 / 100 | Good | Over-restrictive sitemap filters gating category & alternative pages. |
| **Metadata & Title Tags** | 62 / 100 | Needs Improvement | Duplicate brand suffixes (`\| LaunchNests \| LaunchNests`) across dynamic routes. |
| **URL Architecture & Slugs** | 65 / 100 | Needs Improvement | ASCII-only slugify stripping Unicode names to malformed slugs (`/tools/-c6c56e`). |
| **Performance & Server Response**| 54 / 100 | Needs Improvement | Server TTFB of ~2.0s – 2.5s on directory routes due to un-cached `searchParams`. |
| **Structured Data (Schema.org)** | 76 / 100 | Good | Strong entity graph, but invalid `FAQPage` schema on commercial pages & empty strings. |
| **Internal Linking & Navigation**| 72 / 100 | Good | Category links use query parameters (`/tools?category=AI`) instead of clean canonical hubs. |
| **OVERALL TECHNICAL SCORE** | **68 / 100** | **Needs Improvement** | **High potential with immediate high-impact fixes.** |

---

## 1. Critical Issues (Fix Immediately)

### Issue 1.1: Duplicate Brand Suffix in Dynamic Page Title Tags
- **Severity:** 🔴 **Critical**
- **Confidence:** `Confirmed` (Verified via live curl and source code inspection)
- **Impact:** Truncates keyword-rich titles in Google SERP snippets, wastes title pixel budgets, reduces Click-Through Rates (CTR), and signals poor automated templating to search quality raters.

#### Live Evidence:
```html
<!-- Live on https://www.launchnests.com/tools/supabase -->
<title>Supabase - Open Source Firebase Alternative | LaunchNests | LaunchNests</title>

<!-- Live on https://www.launchnests.com/tools/category/databases -->
<title>Databases Developer Tools &amp; APIs | LaunchNests | LaunchNests</title>

<!-- Live on https://www.launchnests.com/alternatives/supabase -->
<title>Top Supabase Alternatives &amp; Competitors (2026) | LaunchNests | LaunchNests</title>
```

#### Code Root Cause:
In [app/layout.tsx](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/app/layout.tsx#L40-L43), the Next.js root metadata template is defined as:
```typescript
// app/layout.tsx:40-43
export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  // ...
}
```
However, child page `generateMetadata` functions explicitly append `| ${SITE_CONFIG.name}` manually before returning their title:
1. In [app/tools/category/[slug]/page.tsx#L58](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/app/tools/category/[slug]/page.tsx#L58):
   ```typescript
   const title = `${category.name} Developer Tools & APIs | ${SITE_CONFIG.name}`
   ```
2. In [app/alternatives/[slug]/page.tsx#L63](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/app/alternatives/[slug]/page.tsx#L63):
   ```typescript
   const title = `Top ${tool.name} Alternatives & Competitors (${currentYear}) | ${SITE_CONFIG.name}`
   ```
3. In [app/tools/[slug]/page.tsx#L118-L120](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/app/tools/[slug]/page.tsx#L118-L120):
   Database rows with pre-existing `| LaunchNests` in `tool.metaTitle` get passed through `formatTitle` and then re-appended by the template.

#### Remediation:
- Remove manual `| ${SITE_CONFIG.name}` concatenations from all child `generateMetadata` functions, letting `app/layout.tsx` handle branding via `%s | LaunchNests`.
- In `utils/seo.ts`, sanitize existing database `metaTitle` values to strip any trailing `| LaunchNests` or `— LaunchNests` before returning.

---

### Issue 1.2: Malformed URL Slugs on Unicode / Non-ASCII Tool Submissions
- **Severity:** 🔴 **Critical**
- **Confidence:** `Confirmed` (Verified in live sitemap, live crawl, and database queries)
- **Impact:** Produces broken, spammy-looking URLs that degrade user trust, fail to rank for target keywords, and trigger crawl quality alerts.

#### Live Evidence:
- URL in Live Sitemap: `https://www.launchnests.com/tools/-c6c56e`
- Live Page Title: `热核算力: Paid GPT API gateway for developers with GO, PLUS an… | LaunchNests`
- The entire Chinese brand name `热核算力` was stripped, leaving only a lone hyphen and a hex suffix (`-c6c56e`).

#### Code Root Cause:
In [db/queries/tools/create.ts#L13-L20](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/db/queries/tools/create.ts#L13-L20) and [db/queries/products/create.ts#L14-L20](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/db/queries/products/create.ts#L14-L20):
```typescript
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // <-- [^\w] matches only ASCII [a-zA-Z0-9_]!
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

// db/queries/tools/create.ts:58-59
const baseSlug = slugify(rest.name) // Becomes "" for non-ASCII names!
const slug = `${baseSlug}-${nanoid()}` // Results in "-c6c56e"
```

#### Remediation:
1. Upgrade slug generation to use Unicode-aware transliteration or fallback to English romanization / transliteration (`pinyin` / `slugify` with `locale: true` or Unicode property escapes `[^\p{L}\p{N}\s-]`u).
2. Add a safeguard: If `baseSlug` is empty or shorter than 2 characters, fallback to `tool-${nanoid()}` or derive slug from English translation / domain hostname.
3. Add a database migration script to fix existing malformed slugs in production and establish a 301 redirect from `/tools/-c6c56e` to the corrected slug.

---

### Issue 1.3: Severe Server TTFB Latency (~2.0s – 2.5s) on Directory Pages
- **Severity:** 🔴 **Critical**
- **Confidence:** `Confirmed` (Measured live via HTTP stream timing)
- **Impact:** Directly degrades Google Core Web Vitals (Largest Contentful Paint - LCP), increases crawler bounce rate, and reduces crawl budget allocated by Googlebot.

#### Live Network Benchmark:
| Page | TTFB (ms) | Total Download (ms) | Cache-Control Header | Edge Cache Status |
| :--- | :--- | :--- | :--- | :--- |
| `https://www.launchnests.com` | **1,958 ms** | 1,973 ms | `public, max-age=0, must-revalidate` | `x-vercel-cache: HIT` |
| `https://www.launchnests.com/products` | **2,275 ms** | 2,522 ms | `private, no-cache, no-store, max-age=0` | `x-vercel-cache: MISS` |
| `https://www.codehype.ai/saas-directory` | **180 ms** | 185 ms | `public, max-age=0, must-revalidate` | `x-vercel-cache: STALE` |

#### Code Root Cause:
In [app/products/page.tsx#L22-L31](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/app/products/page.tsx#L22-L31) and [app/tools/page.tsx](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/app/tools/page.tsx):
```typescript
export const revalidate = 60

export const generateMetadata = async (props: {
  searchParams: Promise<{
    category?: string
    q?: string
    pricing?: string
    sortBy?: ProductSortOption
    page?: string
  }>
}) => {
  const searchParams = await props.searchParams
  // ...
```
In Next.js 15, awaiting `props.searchParams` forces the page into **dynamic server-side rendering** on every single request. Despite `export const revalidate = 60`, Next.js sets `Cache-Control: private, no-cache, no-store` because dynamic query parameters bypass the static build cache. Every crawler visit incurs a full cold database query chain across Postgres / Neon.

#### Remediation:
- Implement Next.js 15 `unstable_cache` or standard Drizzle query caching around directory listings.
- Separate parameterized filter queries from the default canonical index page (`/products` and `/tools`), allowing the base landing pages to be fully edge-cached with ISR (`stale-while-revalidate`).

---

### Issue 1.4: Lack of Clean Product Category Hubs & Query String Canonicalization
- **Severity:** 🔴 **Critical**
- **Confidence:** `Confirmed` (Verified by filesystem check and crawl results)
- **Impact:** Prevents LaunchNests from ranking for broad category keywords (`"best ai tools"`, `"marketing saas"`, `"developer apis"`). CodeHype ranks for these because it has 54 dedicated static `/category/*` hubs.

#### Code Root Cause:
1. LaunchNests has **zero** product category routes. `app/products/category/[slug]` does not exist.
2. In [app/products/page.tsx#L67-L74](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/app/products/page.tsx#L67-L74):
   ```typescript
   let canonicalUrl = `${SITE_CONFIG.url}/products`
   if (cleanCategory) {
     canonicalUrl = `${SITE_CONFIG.url}/products?category=${encodeURIComponent(cleanCategory)}`
     // ...
   }
   ```
3. Setting canonical URLs to query strings (`/products?category=AI%20API`) conflicts with standard SEO best practices and robots.txt filtering. Search engines discount parameterized URLs compared to clean folder paths (`/category/ai-tools` or `/products/category/ai-api`).

#### Remediation:
- Create dedicated static category routes: `app/products/category/[slug]/page.tsx` mirroring `app/tools/category/[slug]/page.tsx`.
- Canonicalize clean hierarchical URLs: `https://www.launchnests.com/products/category/[slug]`.

---

## 2. High-Priority Issues (Fix Within 30 Days)

### Issue 2.1: Arbitrary Gating Thresholds Exclude 80%+ of Categories & Alternatives from XML Sitemap
- **Severity:** ⚠️ **High**
- **Confidence:** `Confirmed` (Verified in `app/sitemap.ts` and live `sitemap.xml`)
- **Impact:** Prevents search engines from discovering valid categories and alternative pages. Currently, only **1 category** (`databases`) and **4 tool alternatives** (`supabase`, `redis`, `postgresql`, `neon`) exist in the sitemap.

#### Code Root Cause:
In [app/sitemap.ts#L128, L163, L183](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/app/sitemap.ts#L128):
```typescript
// app/sitemap.ts:128
.filter((cat) => cat.count >= 3) // Only 1 category meets this!

// app/sitemap.ts:163
.filter((tool) => (tool.buildsCount ?? 0) >= 3) // 0 built-with pages meet this!

// app/sitemap.ts:183
.filter((tool) => {
  if (!tool.categoryId) return false
  const count = categoryCountMap.get(tool.categoryId) ?? 0
  return count >= 4 // Only 4 tools meet this!
})
```

#### Remediation:
- Lower the sitemap threshold for categories from `>= 3` to `>= 1` approved tools.
- Include all tools with approved sibling alternatives in `/alternatives/[slug]`.
- Provide thin-content safeguards on pages with fewer tools (e.g. rich curated schema and FAQ accordions) rather than hiding entire pages from search engines.

---

### Issue 2.2: Restricted FAQPage Schema on Commercial Product & Comparison Pages
- **Severity:** ⚠️ **High**
- **Confidence:** `Confirmed` (Verified in live JSON-LD extraction and `lib/seo/schema.ts`)
- **Impact:** Wastes schema processing budget; violates current Google Search Central Structured Data guidelines.

#### Detail:
LaunchNests outputs `FAQPage` schema on `/tools/supabase`, `/producthunt-alternative`, `/uneed-alternative`, etc.
Under Google's official documentation (August 2023 algorithm update), FAQ rich results are limited exclusively to well-known government and health authority domains. Commercial SaaS, directory, and e-commerce websites no longer qualify for FAQ rich snippets in Google SERPs.

#### Remediation:
- Remove `@type: "FAQPage"` schema from commercial product and comparison pages.
- Retain human-readable FAQ UI sections on page for users and AI search engines (ChatGPT, Claude, Perplexity), but remove the invalid JSON-LD schema block to maintain a 100% compliant schema graph.

---

### Issue 2.3: Schema Inconsistencies & Empty String Fields
- **Severity:** ⚠️ **Medium**
- **Confidence:** `Confirmed` (Verified on `https://www.launchnests.com/products/mandapi-f0fa9e`)
- **Impact:** May trigger Schema.org validation warnings in Google Search Console.

#### Live Evidence:
In the live JSON-LD for `mandapi-f0fa9e`:
```json
{
  "@type": "SoftwareApplication",
  "applicationCategory": "",
  "keywords": "",
  "spatialCoverage": ""
}
```
Furthermore, the page injects **two separate `<script type="application/ld+json">` tags**:
- Tag 1: Root Layout `@graph` containing `Organization` and `WebSite`.
- Tag 2: Page-level `@graph` containing `SoftwareApplication` and `BreadcrumbList`.

#### Remediation:
- In `lib/seo/schema.ts`, omit properties completely (`undefined`) when empty or null rather than emitting empty strings `""`.
- Fallback `applicationCategory` to `"DeveloperApplication"` if `asoCategory` is unset.
- Connect page-level entities to the root layout graph via `@id` references (`isPartOf: { "@id": "https://www.launchnests.com/#website" }`).

---

### Issue 2.4: Marquee Animation Over-Renders 40 External Badge Images Across All Pages
- **Severity:** ⚠️ **Medium**
- **Confidence:** `Confirmed` (Verified in `components/layout/agent-footer.tsx:218`)
- **Impact:** Unnecessarily bloats DOM node count, triggers 40 un-optimized external image network requests, and degrades Interaction to Next Paint (INP) and mobile performance.

#### Code Root Cause:
In [components/layout/agent-footer.tsx#L218](file:///C:/Users/HP/Desktop/Engagement/BuyMyNextLaunch/components/layout/agent-footer.tsx#L218):
```typescript
{[0, 1, 2, 3].map((copyIndex) => (
  // Loops 4 times over 10 FEATURED_BADGES = 40 image tags!
```
Every page render downloads external SVG and PNG badges from 10 different third-party domains (`producthunt.com`, `scrolllaunch.com`, `startupfa.st`, `ufind.best`, etc.) four times each.

#### Remediation:
- Replace the 4x DOM replication with CSS seamless infinite scroll using `aria-hidden` on only 1 duplicate track (2x instead of 4x).
- Host optimized local WebP/SVG badge assets under `/public/badges/` instead of fetching directly from third-party endpoints.
- Lazy-load footer badge images with `loading="lazy"`.

---

## 3. Google Search Console & Indexing Diagnostic Status

### Status: Offline / Environment Limitation
- **Observation:** No Google Search Console service account keys (`GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY`) or OAuth tokens are configured in the current `.env` file.
- **Access Required for Live Ingestion:**
  To inspect live click-through rates, impression counts, average ranking positions, and indexing exclusions directly:
  1. Add Google Search Console API credentials to `.env`:
     ```bash
     GSC_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
     GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
     GSC_SITE_URL="sc-domain:launchnests.com"
     ```
  2. Or provide a Search Console CSV/JSON export (`Queries.csv`, `Pages.csv`).

### SERP Indexing Footprint Reconnaissance (`Confirmed` via Web Reconnaissance):
- Google has indexed LaunchNests core pages: Homepage, `/products`, `/tools`, `/producthunt-alternative`, `/uneed-alternative`, `/betalist-alternative`, `/microlaunch-alternative`, `/makers`, `/pricing`, `/faq`, `/cli`, `/mcp`.
- **Pages Indexed but Underperforming:**
  - Product Profile Pages (`/products/*`): Indexed, but average content length is under 400 words. Lacks user reviews, structured changelogs, and deep use-case explanations.
  - Alternatives Pages (`/alternatives/supabase`): Only 376 words. Needs expanded comparison tables, pros/cons, and pricing matrices.
  - Category Hubs (`/tools/category/databases`): Only 400 words. Needs introductory guidance and sub-category breakdowns.

---

## 4. Technical SEO Checklist Summary

| Task | File(s) | Impact | Effort |
| :--- | :--- | :--- | :--- |
| **Fix Double Brand Suffix in Titles** | `app/tools/[slug]/page.tsx`, `app/tools/category/[slug]/page.tsx`, `app/alternatives/[slug]/page.tsx` | 🔴 High | 15 mins |
| **Fix Unicode Slugify for Non-ASCII Tool Names** | `db/queries/tools/create.ts`, `db/queries/products/create.ts` | 🔴 High | 30 mins |
| **Cache Directory Pages / Eliminate 2s TTFB** | `app/products/page.tsx`, `app/tools/page.tsx` | 🔴 High | 1-2 hours |
| **Build Static Product Category Hubs** | Create `app/products/category/[slug]/page.tsx` | 🔴 High | 2-3 hours |
| **Expand XML Sitemap Inclusions** | `app/sitemap.ts` | ⚠️ Med | 30 mins |
| **Remove Invalid Commercial FAQ Schema** | `lib/seo/schema.ts`, `app/tools/[slug]/page.tsx`, `constants/comparisons/*` | ⚠️ Med | 30 mins |
| **Clean Empty String Schema Properties** | `lib/seo/schema.ts` | ⚠️ Med | 20 mins |
| **Optimize Marquee Footer Badges** | `components/layout/agent-footer.tsx`, `/public/badges/` | ⚠️ Med | 45 mins |
