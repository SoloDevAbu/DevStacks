import { ProductList } from "@/components/home/product-list"
import { PageHeader } from "@/components/shared/page-header"
import { TRENDING_PRODUCTS } from "@/constants/products"
import { AI_PROMPTS } from "@/lib/prompts"

export const MainContent = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Discover what you can build with"
        description="Discover developer tools, APIs, and infrastructure, and the products people are already building with them"
        aiPrompt={AI_PROMPTS.home}
      />

      <div className="flex w-full flex-1 flex-col">
        <ProductList products={TRENDING_PRODUCTS} />
      </div>
    </div>
  )
}
