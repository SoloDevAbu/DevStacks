import { ProductList } from "@/components/home/product-list"
import { PageHeader } from "@/components/shared/page-header"
import { FaqSection } from "@/components/home/faq-section"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { AI_PROMPTS } from "@/lib/prompts"
import { TRENDING_PRODUCTS } from "@/constants/products"

export const MainContent = async () => {
  let products
  try {
    products = await getTrendingProducts(14)
  } catch {
    // Fall back to static data if DB is unavailable (e.g. during build)
    products = TRENDING_PRODUCTS.map((p, i) => ({
      id: p.id,
      slug: p.name.toLowerCase().replace(/\s+/g, "-"),
      name: p.name,
      tagline: p.tagline,
      tags: p.tags,
      upvotesCount: p.upvotes,
      buildsCount: p.builds,
      commentsCount: p.comments,
      viewsCount: Math.round(p.upvotes * 11.6),
      pricing: "Free" as const,
      tier: (i % 3 === 0 ? "free" : i % 3 === 1 ? "premium" : "premium+") as "free" | "premium" | "premium+",
      status: "approved" as const,
      logoUrl: null,
      websiteUrl: "",
      category: p.tags[0] ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      submitterId: "",
      submitter: null,
    }))
  }

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Discover what you can build with"
        description="Discover developer tools, APIs, and infrastructure, and the products people are already building with them"
        aiPrompt={AI_PROMPTS.home}
      />

      <div className="flex w-full flex-1 flex-col">
        <ProductList products={products} />
      </div>

      <FaqSection />
    </div>
  )
}
