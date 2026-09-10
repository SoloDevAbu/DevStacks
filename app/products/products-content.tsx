"use client"

import { useState, useMemo, useCallback } from "react"
import { ProductList } from "@/components/shared/product-list"
import type { DbProduct } from "@/types/entities"
import { useInfiniteProducts } from "@/hooks/products/use-products"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import {
  ProductsFilterBar,
  type ProductSortOption,
} from "@/components/products/products-filter-bar"

interface ProductsDirectoryContentProps {
  initialCategory?: string
  initialQuery?: string
  initialProducts?: DbProduct[]
}

export const ProductsDirectoryContent = ({
  initialCategory,
  initialQuery,
  initialProducts = [],
}: ProductsDirectoryContentProps) => {
  const [selectedPricing, setSelectedPricing] = useState("all")
  const [sortBy, setSortBy] = useState<ProductSortOption>("upvotes")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      category: initialCategory,
      q: initialQuery,
      limit: 20,
      initialData: initialProducts,
    })

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sentinelRef = useIntersectionObserver({
    onIntersect: handleIntersect,
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const rawProducts = data?.pages.flatMap((page) => page) ?? initialProducts

  const displayedProducts = useMemo(() => {
    let result = rawProducts

    if (selectedPricing !== "all") {
      result = result.filter(
        (product) =>
          product.pricing.toLowerCase() === selectedPricing.toLowerCase()
      )
    }

    if (sortBy === "views") {
      result = [...result].sort(
        (a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0)
      )
    } else if (sortBy === "upvotes") {
      result = [...result].sort(
        (a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0)
      )
    }

    return result
  }, [rawProducts, selectedPricing, sortBy])

  return (
    <div className="flex w-full flex-1 flex-col">
      <ProductsFilterBar
        selectedCategory={initialCategory}
        selectedPricing={selectedPricing}
        onSelectPricing={setSelectedPricing}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="flex w-full flex-1 flex-col pb-8">
        <ProductList
          products={displayedProducts}
          showMedals
          showTrendingBadge
        />
        <InfiniteScrollSentinel
          sentinelRef={sentinelRef}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={Boolean(hasNextPage)}
          hasItems={displayedProducts.length > 0}
        />
      </div>
    </div>
  )
}
