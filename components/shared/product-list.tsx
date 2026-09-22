"use client"

import Link from "next/link"
import { PackageSearch, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty"
import { ROUTES } from "@/constants/routes"
import { ProductCard } from "@/components/shared/product-card"
import type { DbProduct } from "@/types/entities"

export type { DbProduct }

export const ProductList = ({
  products,
  showMedals = false,
  showTrendingBadge = false,
}: {
  products: DbProduct[]
  showMedals?: boolean
  showTrendingBadge?: boolean
}) => {
  if (products.length === 0) {
    return (
      <Empty className="py-12">
        <EmptyMedia variant="icon">
          <PackageSearch className="size-5" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No products found</EmptyTitle>
          <EmptyDescription>
            No developer products found here. Be the first to submit yours!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href={ROUTES.SUBMIT} />}>
            <PlusCircle className="mr-1.5 size-4" />
            Submit a Product
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          showMedals={showMedals}
          showTrendingBadge={showTrendingBadge}
        />
      ))}
    </div>
  )
}
