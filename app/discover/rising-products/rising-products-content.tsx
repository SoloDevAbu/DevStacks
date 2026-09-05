"use client"

import { ProductList, type DbProduct } from "@/components/home/product-list"
import { useRisingProducts } from "@/hooks/products/use-rising-products"
import { Loader2 } from "lucide-react"

export const RisingProductsContent = () => {
  const { data, isLoading } = useRisingProducts({ limit: 20 })
  const products = (data ?? []) as DbProduct[]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading rising products...
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col pt-2">
      <ProductList
        products={products}
        showMedals={false}
        showTrendingBadge={true}
      />
    </div>
  )
}
