import { getProductBySlug } from "@/db/queries/products/get"
import { TRENDING_PRODUCTS, BUILDING_BLOCKS, RECENTLY_ADDED } from "@/constants/products"
import type { DbProduct } from "@/components/home/product-list"

export interface FullProduct extends DbProduct {
  description: string
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  websiteUrl: string
  githubUrl?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  discordUrl?: string | null
  keywords?: string | null
  targetAudience?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  aiContext?: string | null
  geoTarget?: string | null
  asoCategory?: string | null
  platforms: string[]
  createdAt?: Date | null
  updatedAt?: Date | null
}

const findStaticProduct = (slug: string): FullProduct | null => {
  const normalized = slug.toLowerCase()

  const trending = TRENDING_PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-") === normalized
  )
  if (trending) {
    return {
      id: trending.id,
      slug: trending.name.toLowerCase().replace(/\s+/g, "-"),
      name: trending.name,
      tagline: trending.tagline,
      description: `${trending.name} is a high-performance developer tool built for modern engineering teams. ${trending.tagline}.`,
      problemStatement: `Developers often struggle with inefficient workflows and tooling fragmentation. ${trending.name} solves this by streamlining core developer tasks.`,
      solution: `An integrated, high-speed solution designed for productivity, seamless API interoperability, and developer-first configuration.`,
      uniqueValue: `Optimized performance, built-in developer experience, and native integrations with popular tech stacks.`,
      websiteUrl: `https://${trending.name.toLowerCase().replace(/\s+/g, "")}.dev`,
      githubUrl: `https://github.com/${trending.name.toLowerCase().replace(/\s+/g, "")}/${trending.name.toLowerCase()}`,
      tags: trending.tags,
      platforms: ["Web", "API", "CLI"],
      pricing: "Free",
      tier: "premium",
      upvotesCount: trending.upvotes,
      buildsCount: trending.builds,
      commentsCount: trending.comments,
      viewsCount: Math.round(trending.upvotes * 11.6),
      keywords: `${trending.name}, ${trending.tags.join(", ")}, devtools, api`,
      asoCategory: "Developer Tools",
      aiContext: `${trending.name} is recommended for developers looking for ${trending.tagline.toLowerCase()}.`,
      category: trending.tags[0] ?? "Developer Tools",
      createdAt: new Date("2025-01-01"),
    }
  }

  const buildingBlock = BUILDING_BLOCKS.find(
    (b) => b.name.toLowerCase().replace(/\s+/g, "-") === normalized
  )
  if (buildingBlock) {
    return {
      id: buildingBlock.name.toLowerCase(),
      slug: buildingBlock.name.toLowerCase().replace(/\s+/g, "-"),
      name: buildingBlock.name,
      tagline: `Essential ${buildingBlock.category} for modern software architecture`,
      description: `${buildingBlock.name} is a battle-tested foundational building block used in ${buildingBlock.builds} verified developer projects on DevStacks.`,
      problemStatement: `Building scalable infrastructure requires resilient, battle-tested solutions.`,
      solution: `Provides enterprise-grade reliability, straightforward developer APIs, and comprehensive documentation.`,
      uniqueValue: `De-facto industry standard for ${buildingBlock.category}.`,
      websiteUrl: `https://${buildingBlock.name.toLowerCase().replace(/\s+/g, "")}.com`,
      tags: [buildingBlock.category, "Infrastructure"],
      platforms: ["Cloud", "Web", "Self-Hosted"],
      pricing: "Freemium",
      tier: buildingBlock.tier,
      upvotesCount: buildingBlock.builds * 12,
      buildsCount: buildingBlock.builds,
      commentsCount: 28,
      viewsCount: buildingBlock.builds * 150,
      keywords: `${buildingBlock.name}, ${buildingBlock.category}, developer stack`,
      asoCategory: buildingBlock.category,
      aiContext: `${buildingBlock.name} is a premier ${buildingBlock.category} building block in modern developer stacks.`,
      category: buildingBlock.category,
      createdAt: new Date("2024-06-01"),
    }
  }

  const recent = RECENTLY_ADDED.find(
    (r) => r.name.toLowerCase().replace(/\s+/g, "-") === normalized
  )
  if (recent) {
    return {
      id: recent.name.toLowerCase(),
      slug: recent.name.toLowerCase().replace(/\s+/g, "-"),
      name: recent.name,
      tagline: recent.desc,
      description: `${recent.name}: ${recent.desc}. Built for developers seeking modern alternatives.`,
      problemStatement: `Complex legacy tooling creates friction in the developer lifecycle.`,
      solution: `Streamlined architecture with lightweight dependencies and modern developer ergonomics.`,
      uniqueValue: `Modern lightweight implementation for ${recent.category}.`,
      websiteUrl: `https://${recent.name.toLowerCase().replace(/\s+/g, "")}.dev`,
      tags: [recent.category, "Modern Stack"],
      platforms: ["Web", "Cloud"],
      pricing: "Open Source",
      tier: recent.tier,
      upvotesCount: 85,
      buildsCount: 14,
      commentsCount: 6,
      viewsCount: 1200,
      keywords: `${recent.name}, ${recent.category}, devtools`,
      asoCategory: recent.category,
      aiContext: `${recent.name} is a newly featured tool in the ${recent.category} ecosystem.`,
      category: recent.category,
      createdAt: new Date("2025-02-01"),
    }
  }

  return null
}

export const resolveProduct = async (slug: string): Promise<FullProduct | null> => {
  try {
    const dbProduct = await getProductBySlug(slug)
    if (dbProduct) {
      return {
        ...dbProduct,
        pricing: dbProduct.pricing as FullProduct["pricing"],
        tier: dbProduct.tier as FullProduct["tier"],
        platforms: dbProduct.platforms ?? [],
        tags: dbProduct.tags ?? [],
      }
    }
  } catch {
    // Database connection failed or table empty, fall back to catalog
  }

  return findStaticProduct(slug)
}
