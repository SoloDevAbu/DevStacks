import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const ALGOLIA_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "algolia",
  toolName: "Algolia",
  profile: {
    websiteUrl: "https://www.algolia.com",
    bestFor:
      "A hosted search and discovery API with typo tolerance, faceting and AI ranking, used for site and e-commerce search.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Cloud",
  },
  intro:
    "Algolia is a hosted search and discovery API known for fast, typo-tolerant search and merchandising tools. Most alternatives are open-source engines you can self-host or use as a managed cloud (Meilisearch, Typesense, OpenSearch, Elasticsearch, Vespa), or an in-browser engine for small datasets (Orama).",
  stickWith: [
    "You rely on its merchandising, analytics and A/B testing for e-commerce.",
    "You want fully managed search with InstantSearch UI libraries.",
    "Your query volume fits your plan's pricing.",
  ],
  switchWhen: [
    "Search request costs grow with traffic and you want a flat or self-hosted cost (Meilisearch, Typesense).",
    "You need log analytics or complex aggregations on the same cluster (Elasticsearch, OpenSearch).",
    "You need large-scale ranking with machine-learned models (Vespa) or search that runs in the browser (Orama).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Meilisearch",
      websiteUrl: "https://www.meilisearch.com",
      bestFor:
        "Typo-tolerant instant search that is quick to self-host, with a managed cloud.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted, Cloud",
      tags: ["Instant search", "Rust"],
    },
    {
      name: "Typesense",
      websiteUrl: "https://typesense.org",
      bestFor:
        "Fast, typo-tolerant search with vector and hybrid search, self-hosted or in its cloud.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted, Cloud",
      tags: ["Vector search", "C++"],
    },
    {
      name: "Elasticsearch",
      websiteUrl: "https://www.elastic.co/elasticsearch",
      bestFor:
        "Full-text search and analytics at scale, with aggregations and vector search.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Self-hosted, Cloud",
      tags: ["Analytics", "Aggregations"],
    },
    {
      name: "OpenSearch",
      websiteUrl: "https://opensearch.org",
      bestFor:
        "An Apache-2.0 search and analytics suite governed by the Linux Foundation.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted, AWS",
      tags: ["Apache 2.0", "Analytics"],
    },
    {
      name: "Vespa",
      websiteUrl: "https://vespa.ai",
      bestFor:
        "Large-scale search and recommendation with machine-learned ranking.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted, Cloud",
      tags: ["Ranking", "Recommendations"],
    },
    {
      name: "Orama",
      websiteUrl: "https://orama.com",
      bestFor:
        "A small full-text and vector search engine that runs in the browser, edge or server.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Browser, Edge, Node.js",
      tags: ["In-browser", "TypeScript"],
    },
  ],
}
