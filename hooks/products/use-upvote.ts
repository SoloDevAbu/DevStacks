"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleUpvote } from "@/lib/api/products"
import { PRODUCTS_QUERY_KEY } from "@/hooks/products/use-products"

export const useUpvote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      toggleUpvote(slug, userId),
    onMutate: async ({ slug }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] })

      const snapshot = queryClient.getQueriesData({ queryKey: ["products"] })

      queryClient.setQueriesData({ queryKey: ["products"] }, (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.map((p: { slug: string; upvotesCount: number }) =>
          p.slug === slug
            ? { ...p, upvotesCount: p.upvotesCount + 1 }
            : p
        )
      })

      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) {
        for (const [key, data] of ctx.snapshot) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
