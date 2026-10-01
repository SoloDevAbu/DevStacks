import { Package } from "lucide-react"
import { DetailSectionHeader } from "@/components/shared/detail-section-header"
import { ProductCard } from "@/components/shared/product-card"
import type { DbProduct } from "@/types/entities"

interface RelatedProductsSectionProps {
  products: DbProduct[]
  categoryName?: string | null
}

export const RelatedProductsSection = ({
  products,
  categoryName,
}: RelatedProductsSectionProps) => {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="border-b border-dashed border-border bg-white">
      <DetailSectionHeader
        title={`Related Products${categoryName ? ` in ${categoryName}` : ""}`}
        subtitle="Explore alternative and complementary products in this category"
        icon={Package}
        theme="indigo"
      />
      <div className="flex flex-col">
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            index={idx}
            showMedals={false}
            showTrendingBadge={false}
          />
        ))}
      </div>
    </section>
  )
}
