"use client"

import { useCallback } from "react"
import { ProductList } from "@/components/shared/product-list"
import type { DbProduct } from "@/types/entities"
import { useInfiniteProducts } from "@/hooks/products/use-products"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"

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

  const products = data?.pages.flatMap((page) => page) ?? initialProducts

  return (
    <div className="flex w-full flex-1 flex-col pt-2 pb-8">
      <ProductList
        products={products}
        showMedals={false}
        showTrendingBadge={false}
      />
      <InfiniteScrollSentinel
        sentinelRef={sentinelRef}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={Boolean(hasNextPage)}
        hasItems={products.length > 0}
      />
    </div>
  )
}
