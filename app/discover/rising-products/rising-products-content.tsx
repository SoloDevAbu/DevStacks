"use client"

import { useCallback } from "react"
import { ProductList, type DbProduct } from "@/components/shared/product-list"
import { useInfiniteRisingProducts } from "@/hooks/home/use-rising-products"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"

interface RisingProductsContentProps {
  initialProducts?: DbProduct[]
}

export const RisingProductsContent = ({
  initialProducts = [],
}: RisingProductsContentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRisingProducts({
      limit: DISCOVER_PAGE_LIMIT,
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
        showTrendingBadge={true}
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

