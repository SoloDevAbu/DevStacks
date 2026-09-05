"use client"

import Link from "next/link"
import { Loader2, PackageSearch, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useProducts } from "@/hooks/products/use-products"
import { ProductCard } from "@/components/shared/product-card"
import type { DbProduct } from "@/components/home/product-list"

export const BuiltWithList = ({
  showMedals = false,
}: {
  showMedals?: boolean
}) => {
  const { data, isLoading } = useProducts({ sortBy: "builds", limit: 14 })
  const products = (data ?? []) as DbProduct[]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading building blocks...
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
          <PackageSearch className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          No tools found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No developer tools have been registered yet. Add your building block
          to DevStacks!
        </p>
        <div className="mt-4">
          <Button nativeButton={false} render={<Link href={ROUTES.SUBMIT} />}>
            <PlusCircle className="mr-1.5 size-4" />
            List a Tool
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-8">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          showMedals={showMedals}
          tagPrefix="Built with"
        />
      ))}
    </div>
  )
}
