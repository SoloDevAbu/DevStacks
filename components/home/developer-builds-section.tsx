import { SectionHeader } from "@/components/shared/section-header"
import { ProductCard } from "@/components/shared/product-card"
import type { DbProduct } from "@/types/entities"
import { ROUTES } from "@/constants/routes"

interface DeveloperBuildsSectionProps {
  products: DbProduct[]
}

export const DeveloperBuildsSection = ({
  products,
}: DeveloperBuildsSectionProps) => {
  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="See what developers are building"
        subtitle="Real products built with the tools developers love"
        viewAllText="View all products"
        viewAllHref={ROUTES.DISCOVER_RISING_PRODUCTS}
      />
      <div className="-mt-px flex flex-col">
        {products.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
            No developer products yet. Be the first to submit yours!
          </div>
        ) : (
          products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))
        )}
      </div>
    </section>
  )
}
