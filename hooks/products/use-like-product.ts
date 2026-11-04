"use client"

import { ITEM_KIND } from "@/constants/items"
import { useVoteToggle } from "@/hooks/shared/use-vote-toggle"
import { setProductLike } from "@/lib/api/products"

const PRODUCTS_LIST_QUERY_KEY = ["products"]

export const useLikeProduct = (slug: string) =>
  useVoteToggle({
    kind: ITEM_KIND.PRODUCT,
    slug,
    votedSlugsField: "likedProductSlugs",
    countsField: "productLikeCounts",
    sendVote: setProductLike,
    listQueryKey: PRODUCTS_LIST_QUERY_KEY,
    errorTitle: "Your like wasn't saved",
  })
