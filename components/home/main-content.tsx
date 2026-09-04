import { ProductList, type DbProduct } from "@/components/home/product-list"
import { PageHeader } from "@/components/shared/page-header"
import { FaqSection } from "@/components/home/faq-section"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { AI_PROMPTS } from "@/lib/prompts"

export const MainContent = async () => {
  let products: DbProduct[] = []
  try {
    const dbProducts = await getTrendingProducts(14)
    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts as DbProduct[]
    }
  } catch {
    products = []
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
