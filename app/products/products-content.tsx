"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ProductList } from "@/components/shared/product-list"
import type { DbProduct } from "@/types/entities"
import { useInfiniteProducts } from "@/hooks/products/use-products"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import {
  ProductsFilterBar,
  type ProductSortOption,
} from "@/components/products/products-filter-bar"
import { ROUTES } from "@/constants/routes"

interface ProductsDirectoryContentProps {
  initialCategory?: string
  initialQuery?: string
  initialPricing?: string
  initialSortBy?: ProductSortOption
  initialProducts?: DbProduct[]
}

export const ProductsDirectoryContent = ({
  initialCategory,
  initialQuery,
  initialPricing = "all",
  initialSortBy = "upvotes",
  initialProducts = [],
}: ProductsDirectoryContentProps) => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory)
  const [selectedPricing, setSelectedPricing] = useState<string>(initialPricing)
  const [sortBy, setSortBy] = useState<ProductSortOption>(initialSortBy)

  const updateUrl = useCallback(
    (newCat?: string, newPricing?: string, newSort?: ProductSortOption) => {
      const params = new URLSearchParams()
      const cat = newCat !== undefined ? newCat : selectedCategory
      const prc = newPricing !== undefined ? newPricing : selectedPricing
      const srt = newSort !== undefined ? newSort : sortBy

      if (cat && cat.toLowerCase() !== "all") params.set("category", cat)
      if (prc && prc.toLowerCase() !== "all") params.set("pricing", prc)
      if (srt && srt !== "upvotes") params.set("sortBy", srt)
      if (initialQuery) params.set("q", initialQuery)

      const qs = params.toString()
      router.push(qs ? `${ROUTES.PRODUCTS}?${qs}` : ROUTES.PRODUCTS, { scroll: false })
    },
    [router, selectedCategory, selectedPricing, sortBy, initialQuery]
  )

  const handleCategoryChange = (catName: string | null) => {
    const val = catName && catName.toLowerCase() !== "all" ? catName : undefined
    setSelectedCategory(val)
    updateUrl(val, selectedPricing, sortBy)
  }

  const handlePricingChange = (pricing: string) => {
    setSelectedPricing(pricing)
    updateUrl(selectedCategory, pricing, sortBy)
  }

  const handleSortChange = (sort: ProductSortOption) => {
    setSortBy(sort)
    updateUrl(selectedCategory, selectedPricing, sort)
  }

  const isInitialParams =
    selectedCategory === initialCategory &&
    selectedPricing === initialPricing &&
    sortBy === initialSortBy

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      category: selectedCategory,
      q: initialQuery,
      pricing: selectedPricing === "all" ? undefined : selectedPricing,
      sortBy: sortBy === "upvotes" ? "likes" : sortBy,
      limit: 20,
      initialData: isInitialParams ? initialProducts : undefined,
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

  const displayedProducts = data?.pages.flatMap((page) => page) ?? (isInitialParams ? initialProducts : [])

  return (
    <div className="flex w-full flex-1 flex-col">
      <ProductsFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        selectedPricing={selectedPricing}
        onSelectPricing={handlePricingChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
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
