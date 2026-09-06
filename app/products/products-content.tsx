"use client"

import { ProductList, type DbProduct } from "@/components/shared/product-list"
import { useProducts } from "@/hooks/products/use-products"
import { Loader2 } from "lucide-react"

export const ProductsDirectoryContent = ({
  initialCategory,
  initialQuery,
}: {
  initialCategory?: string
  initialQuery?: string
}) => {
  const { data, isLoading } = useProducts({
    category: initialCategory,
    q: initialQuery,
    limit: 30,
  })

  const products = (data ?? []) as DbProduct[]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading directory products...
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col pt-2">
      <ProductList
        products={products}
        showMedals={false}
        showTrendingBadge={false}
      />
    </div>
  )
}
