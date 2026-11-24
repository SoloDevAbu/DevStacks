import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { GlossaryTerm } from "@/types/glossary"

export const SEO_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "backlink",
    term: "Backlink",
    article: "a",
    aliases: ["inbound link", "incoming link"],
    category: "seo",
    shortDefinition:
      "A backlink is a link from another website to yours. Search engines treat relevant backlinks from trusted sites as a sign that a page is worth ranking.",
    definition: [
      "When site A links to a page on site B, that link is a backlink for site B. Search engines use links to discover pages and, for followed links, as one signal of authority and relevance.",
      "Quality matters more than count. One link from a trusted, relevant page usually does more than many links from unrelated or low-quality sites.",
    ],
    whyItMatters: [
      "New domains with no backlinks are crawled less and rarely rank for competitive queries.",
      "Followed backlinks pass link equity, which helps the linked page rank.",
      "Backlinks also send referral visitors who already have context about the product.",
    ],
    onLaunchNests: `A ${SITE_CONFIG.name} listing links to the product's website. That link is nofollow on free listings until the badge is shown, and dofollow on Premium and Premium+ listings.`,
    relatedTerms: [
      "dofollow-link",
      "nofollow-link",
      "anchor-text",
      "domain-rating",
    ],
    relatedLinks: [
      {
        label: "Free bulk Domain Rating checker",
        href: ROUTES.FREE_TOOL("bulk-domain-rating-checker"),
      },
      {
        label: "Free SaaS directories for backlinks",
        href: ROUTES.GUIDE_SAAS_DIRECTORIES,
      },
      { label: "Launch directory database", href: ROUTES.DIRECTORIES },
    ],
    faqs: [
      {
        question: "How many backlinks does a new site need?",
        answer:
          "There is no fixed number. A handful of relevant, trusted links is often enough to get a new site crawled and ranking for long-tail queries.",
      },
      {
        question: "Are paid backlinks allowed?",
        answer:
          'Google\'s spam policies say paid links must be marked rel="sponsored" or nofollow. Buying followed links to manipulate rankings can lead to penalties.',
      },
    ],
  },
  {
    slug: "dofollow-link",
    term: "Dofollow Link",
    article: "a",
    aliases: ["followed link", "do-follow"],
    category: "seo",
    shortDefinition:
      "A dofollow link is an ordinary link without a nofollow, ugc or sponsored attribute, so search engines may follow it and count it as an endorsement.",
    definition: [
      '"Dofollow" is not an HTML attribute. It is the informal name for a link that has no rel value telling search engines not to follow or credit it.',
      "Followed links can pass link equity to the page they point to, which is why makers look for directories and sites that give dofollow links.",
    ],
    whyItMatters: [
      "Followed links from trusted pages are one of the strongest ranking signals for a new domain.",
      "Knowing a directory's link type helps decide where launch effort pays off.",
      "Directories sometimes change their link policy, so it is worth checking a live listing rather than trusting a claim.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} checks a real listing on each tracked launch directory every week and reports whether its link is dofollow or nofollow.`,
    relatedTerms: ["nofollow-link", "backlink", "launch-badge"],
    relatedLinks: [
      {
        label: "Directory link check report",
        href: ROUTES.DIRECTORIES_LINK_CHECK_REPORT,
      },
      { label: "Launch directory database", href: ROUTES.DIRECTORIES },
    ],
    faqs: [
      {
        question: "How do I check if a link is dofollow?",
        answer:
          "Inspect the link in your browser's developer tools. If its rel attribute contains nofollow, ugc or sponsored, it is not dofollow; otherwise it is.",
      },
      {
        question: "Is a dofollow link always better than nofollow?",
        answer:
          "For passing authority, yes. But a nofollow link from a busy, relevant page can still send valuable traffic and help a page get discovered.",
      },
    ],
  },
  {
    slug: "nofollow-link",
    term: "Nofollow Link",
    article: "a",
    aliases: ["rel=nofollow", "nofollow attribute"],
    category: "seo",
    shortDefinition:
      'A nofollow link carries rel="nofollow", telling search engines the site does not vouch for the linked page. Google treats it as a hint rather than a strict rule.',
    definition: [
      'Introduced in 2005 to fight comment spam, rel="nofollow" asks search engines not to credit a link. In 2019 Google added rel="sponsored" for paid links and rel="ugc" for user-generated content, and began treating all three as hints.',
      "Many large platforms, including social networks and code hosts, add nofollow to user-posted links by default.",
    ],
    whyItMatters: [
      "Nofollow links usually pass little or no ranking credit.",
      "They still send visitors and can help search engines discover a page.",
      "Paid links should carry sponsored or nofollow to stay within search engine guidelines.",
    ],
    onLaunchNests: `Free ${SITE_CONFIG.name} listings start with a nofollow link, which becomes dofollow while the maker shows the ${SITE_CONFIG.name} badge on their site.`,
    relatedTerms: ["dofollow-link", "backlink", "launch-badge"],
    relatedLinks: [
      {
        label: "Directory link check report",
        href: ROUTES.DIRECTORIES_LINK_CHECK_REPORT,
      },
    ],
    faqs: [
      {
        question: "What is the difference between nofollow, ugc and sponsored?",
        answer:
          "All three mark a link as not fully endorsed. Sponsored is for paid or affiliate links, ugc is for links in user-generated content, and nofollow is the general case.",
      },
      {
        question: "Does Google ever follow nofollow links?",
        answer:
          "Since 2019 Google treats nofollow as a hint, so it may use these links for discovery or ranking, but there is no guarantee either way.",
      },
    ],
  },
  {
    slug: "domain-rating",
    term: "Domain Rating (DR)",
    aliases: ["DR", "Ahrefs Domain Rating"],
    category: "seo",
    shortDefinition:
      "Domain Rating is an Ahrefs metric from 0 to 100 that estimates the strength of a website's backlink profile compared with other sites.",
    definition: [
      "Ahrefs calculates Domain Rating from the number of unique domains with followed links to a site and the Domain Rating of those linking domains. The scale is logarithmic, so moving from 70 to 80 takes far more than moving from 10 to 20.",
      "DR is a third-party estimate. Google does not use it, but it is a quick way to compare how authoritative two sites' link profiles are.",
    ],
    whyItMatters: [
      "It helps estimate how competitive a query is by looking at the DR of pages already ranking.",
      "Makers use it to prioritise which directories and sites to pursue links from.",
      "Tracking your own DR over time shows whether link-building is working.",
    ],
    onLaunchNests: `The ${SITE_CONFIG.name} directory database lists launch directories with their stated link policy and weekly link checks, which helps pick directories worth a submission.`,
    relatedTerms: ["domain-authority", "backlink", "dofollow-link"],
    relatedLinks: [
      {
        label: "Free Domain Rating checker",
        href: ROUTES.FREE_TOOL("domain-rating-checker"),
      },
      { label: "Launch directory database", href: ROUTES.DIRECTORIES },
    ],
    faqs: [
      {
        question: "What is a good Domain Rating?",
        answer:
          "It depends on the niche. A new site starts near 0, many established small businesses sit between 20 and 50, and large publishers are often above 80.",
      },
      {
        question: "Is Domain Rating a Google ranking factor?",
        answer:
          "No. It is an Ahrefs metric. It correlates with the link signals Google uses, but Google does not read DR itself.",
      },
    ],
  },
  {
    slug: "domain-authority",
    term: "Domain Authority (DA)",
    aliases: ["DA", "Moz Domain Authority"],
    category: "seo",
    shortDefinition:
      "Domain Authority is a Moz score from 1 to 100 that predicts how likely a website is to rank, based mainly on its link profile.",
    definition: [
      "Moz built Domain Authority to estimate a site's ranking potential compared with other sites. Like Ahrefs' Domain Rating, it is logarithmic and based largely on backlinks.",
      "DA and DR measure similar things with different link indexes and formulas, so the same site often has different scores in each tool.",
    ],
    whyItMatters: [
      "It gives a rough comparison of sites when evaluating link opportunities.",
      "It is widely quoted by directories and publishers when they describe their reach.",
      "It is a relative metric, so it is most useful for comparing sites in the same niche.",
    ],
    onLaunchNests: `When comparing launch directories, ${SITE_CONFIG.name} focuses on facts it can verify, such as whether a real listing's link is followed, rather than any single authority score.`,
    relatedTerms: ["domain-rating", "backlink"],
    relatedLinks: [
      {
        label: "Free Domain Rating checker",
        href: ROUTES.FREE_TOOL("domain-rating-checker"),
      },
      { label: "Launch directory database", href: ROUTES.DIRECTORIES },
    ],
    faqs: [
      {
        question: "What is the difference between DA and DR?",
        answer:
          "DA is from Moz and DR is from Ahrefs. Both estimate link-based authority, but they use different link data and formulas, so their numbers are not interchangeable.",
      },
      {
        question: "Does Google use Domain Authority?",
        answer:
          "No. Domain Authority is a Moz metric and is not part of Google's ranking systems.",
      },
    ],
  },
  {
    slug: "anchor-text",
    term: "Anchor Text",
    aliases: ["link text"],
    category: "seo",
    shortDefinition:
      "Anchor text is the visible, clickable text of a link. Search engines use it as a clue to what the linked page is about.",
    definition: [
      'In <a href="https://example.com">project management tool</a>, the anchor text is "project management tool". For image links, the image\'s alt text plays a similar role.',
      "Natural anchor text varies: brand names, plain URLs and descriptive phrases. A profile where most links use the same exact keyword can look manipulative.",
    ],
    whyItMatters: [
      "Descriptive anchors help search engines and readers understand the target page.",
      "Internal link anchors are fully under your control and help pages rank for their topic.",
      "Over-optimised exact-match anchors can be a spam signal.",
    ],
    onLaunchNests: `Internal links across ${SITE_CONFIG.name}, such as from tool pages to their alternatives and comparisons, use descriptive anchors that name the page's topic.`,
    relatedTerms: ["backlink", "dofollow-link", "canonical-url"],
    relatedLinks: [
      { label: "Developer tool comparisons", href: ROUTES.COMPARE_HUB },
    ],
    faqs: [
      {
        question: "What anchor text should I use for my product?",
        answer:
          "Mostly your brand name and natural descriptions. Let the surrounding sentence carry the keyword instead of forcing an exact-match phrase.",
      },
      {
        question: "Does anchor text matter for internal links?",
        answer:
          "Yes. Clear, descriptive internal anchors help search engines understand how pages relate and which page covers which topic.",
      },
    ],
  },
  {
    slug: "canonical-url",
    term: "Canonical URL",
    article: "a",
    aliases: ["rel=canonical", "canonical tag"],
    category: "seo",
    shortDefinition:
      'A canonical URL is the preferred version of a page when the same content is reachable at several addresses, declared with a rel="canonical" link.',
    definition: [
      "Duplicate URLs are common: with and without trailing slashes, with tracking parameters, over http and https, or sorted differently. A canonical link tells search engines which address to index and credit.",
      "Google treats the canonical tag as a strong hint, combined with redirects, internal links and sitemaps, when choosing the canonical itself.",
    ],
    whyItMatters: [
      "It consolidates ranking signals onto one URL instead of splitting them across duplicates.",
      "It keeps the indexed URL clean and shareable.",
      "Mismatched canonicals, redirects and sitemap URLs can cause Google to pick a different canonical than intended.",
    ],
    onLaunchNests: `Every ${SITE_CONFIG.name} page declares a self-referencing canonical, and comparison pages redirect the reversed order (B vs A) to one canonical URL.`,
    relatedTerms: ["xml-sitemap", "crawl-budget", "structured-data"],
    relatedLinks: [
      { label: "Developer tool comparisons", href: ROUTES.COMPARE_HUB },
    ],
    faqs: [
      {
        question: "Should every page have a canonical tag?",
        answer:
          "It is good practice. A self-referencing canonical on each page removes ambiguity when parameters or alternate paths create duplicates.",
      },
      {
        question: "Canonical tag or 301 redirect?",
        answer:
          "Use a 301 redirect when the duplicate URL should not be visited at all. Use a canonical when both URLs need to work for users but only one should be indexed.",
      },
    ],
  },
  {
    slug: "xml-sitemap",
    term: "XML Sitemap",
    article: "an",
    aliases: ["sitemap.xml", "sitemap"],
    category: "seo",
    shortDefinition:
      "An XML sitemap is a file that lists a site's important URLs, with optional last-modified dates, to help search engines discover and recrawl them.",
    definition: [
      "Defined by the sitemaps.org protocol, a sitemap lists URLs in XML. One file can hold up to 50,000 URLs or 50 MB uncompressed; larger sites use a sitemap index that points to several sitemaps.",
      "A sitemap does not guarantee indexing, but it helps search engines find new pages, especially on young sites with few external links.",
    ],
    whyItMatters: [
      "New pages are discovered faster, particularly ones with few internal links.",
      "Accurate lastmod dates help search engines prioritise recrawls.",
      "Submitting sitemaps in Google Search Console shows how many listed URLs are indexed.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} lists every indexable listing, comparison and guide in its sitemap and adds new launches as they go live.`,
    relatedTerms: ["indexnow", "crawl-budget", "canonical-url", "robots-txt"],
    relatedLinks: [
      { label: `${SITE_CONFIG.name} sitemap`, href: ROUTES.SITEMAP },
    ],
    faqs: [
      {
        question: "Does a sitemap improve rankings?",
        answer:
          "Not directly. It helps pages get discovered and recrawled, which they need before they can rank.",
      },
      {
        question: "Should noindex pages be in the sitemap?",
        answer:
          "No. A sitemap should list canonical, indexable URLs only; mixing in noindex or redirecting URLs sends conflicting signals.",
      },
    ],
  },
  {
    slug: "indexnow",
    term: "IndexNow",
    aliases: ["IndexNow protocol"],
    category: "seo",
    shortDefinition:
      "IndexNow is an open protocol that lets a website notify participating search engines the moment a URL is added, updated or deleted.",
    definition: [
      "Instead of waiting to be crawled, a site sends the changed URLs plus a key file to an IndexNow endpoint. Participating engines, including Bing, Yandex, Naver, Seznam and Yep, share submissions with each other.",
      "Google does not use IndexNow; it relies on crawling, sitemaps and Search Console.",
    ],
    whyItMatters: [
      "New and updated pages can be picked up by participating engines within minutes or hours.",
      "Bing's index also feeds several AI assistants and search products.",
      "It reduces unnecessary crawling for sites that change often.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} pings IndexNow when a live listing is edited or removed, so Bing and other participating engines pick up the change quickly.`,
    relatedTerms: ["xml-sitemap", "crawl-budget", "ai-crawler"],
    relatedLinks: [
      { label: `${SITE_CONFIG.name} sitemap`, href: ROUTES.SITEMAP },
    ],
    faqs: [
      {
        question: "Does Google support IndexNow?",
        answer:
          "No. Google has tested it but does not use it. Use sitemaps and Search Console for Google.",
      },
      {
        question: "Do I need to submit to each search engine separately?",
        answer:
          "No. Submitting to one participating endpoint is enough; the engines share IndexNow submissions.",
      },
    ],
  },
  {
    slug: "structured-data",
    term: "Structured Data",
    aliases: ["schema markup", "JSON-LD", "schema.org"],
    category: "seo",
    shortDefinition:
      "Structured data is machine-readable markup, usually JSON-LD using the schema.org vocabulary, that describes what a page is about.",
    definition: [
      "Structured data labels the facts on a page: that it is a software application, an FAQ, a breadcrumb trail or an organization. Google recommends the JSON-LD format, placed in a script tag.",
      "Search engines use it to understand pages and, for supported types, to show rich results. AI systems also read it as a clean summary of the page.",
    ],
    whyItMatters: [
      "It can make pages eligible for rich results such as breadcrumbs and product details.",
      "It gives search engines and AI tools unambiguous facts about an entity.",
      "Organization markup with sameAs links helps connect a brand to its profiles.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} pages publish JSON-LD for the organization, breadcrumbs, listings, item lists and FAQs.`,
    relatedTerms: [
      "canonical-url",
      "generative-engine-optimization",
      "llms-txt",
    ],
    relatedLinks: [{ label: `About ${SITE_CONFIG.name}`, href: ROUTES.ABOUT }],
    faqs: [
      {
        question: "Does structured data improve rankings?",
        answer:
          "Not directly, but it helps search engines understand the page and can make it eligible for rich results that improve click-through rate.",
      },
      {
        question: "JSON-LD or microdata?",
        answer:
          "Google supports both but recommends JSON-LD, because it is easier to add and maintain separately from the HTML.",
      },
    ],
  },
  {
    slug: "click-through-rate",
    term: "Click-Through Rate (CTR)",
    aliases: ["CTR", "organic CTR"],
    category: "seo",
    shortDefinition:
      "Click-through rate is the share of people who click a result after seeing it: clicks divided by impressions.",
    definition: [
      "In Google Search Console, CTR is the number of clicks a page or query received divided by its impressions. A page shown 1,000 times and clicked 20 times has a 2% CTR.",
      "CTR depends heavily on position, the title and description shown, and SERP features such as AI Overviews that answer the query on the results page.",
    ],
    whyItMatters: [
      "Better titles and descriptions can raise traffic without any change in ranking.",
      "Low CTR at a good position often means the snippet does not match the searcher's intent.",
      "AI answers reduce clicks for simple questions, which makes distinctive snippets more important.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} titles its comparison and alternatives pages with the wording people search, such as \"X vs Y\" and \"X alternatives\", plus the current year.`,
    relatedTerms: ["ai-overviews", "structured-data", "canonical-url"],
    relatedLinks: [
      { label: "Developer tool alternatives", href: ROUTES.ALTERNATIVES_HUB },
    ],
    faqs: [
      {
        question: "What is a good organic CTR?",
        answer:
          "It varies by position and query type. Top results often get double-digit CTR, while results lower on page one may get 1 to 3%.",
      },
      {
        question: "Where can I see my CTR?",
        answer:
          "In Google Search Console's Performance report, broken down by query, page, country and device.",
      },
    ],
  },
  {
    slug: "crawl-budget",
    term: "Crawl Budget",
    aliases: ["crawl rate", "crawl capacity"],
    category: "seo",
    shortDefinition:
      "Crawl budget is the number of URLs a search engine is willing and able to crawl on a site in a given period.",
    definition: [
      "Google describes crawl budget as a mix of crawl capacity (how fast it can crawl without overloading the server) and crawl demand (how much it wants to crawl, based on popularity and freshness).",
      "Google says crawl budget mainly matters for very large or fast-changing sites. Smaller sites are affected more by slow responses and low-value URLs that waste crawls.",
    ],
    whyItMatters: [
      "Slow server responses reduce how much a crawler fetches.",
      "Duplicate, parameter and thin URLs use crawls that new pages need.",
      "Clean sitemaps and internal links point crawlers at the pages that matter.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} keeps thin pages out of the index and its sitemap so crawlers spend their time on listings, guides and comparisons.`,
    relatedTerms: ["xml-sitemap", "robots-txt", "canonical-url", "indexnow"],
    relatedLinks: [
      { label: `${SITE_CONFIG.name} sitemap`, href: ROUTES.SITEMAP },
    ],
    faqs: [
      {
        question: "Do small sites need to worry about crawl budget?",
        answer:
          "Usually not in the strict sense, but server speed and avoiding large numbers of low-value URLs still affect how quickly new pages are crawled.",
      },
      {
        question: "How can I see how Google crawls my site?",
        answer:
          "Search Console's Crawl Stats report shows requests per day, response times and response codes.",
      },
    ],
  },
]
