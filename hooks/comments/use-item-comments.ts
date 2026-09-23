"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchProductComments, submitProductComment } from "@/lib/api/products"
import { fetchToolComments, submitToolComment } from "@/lib/api/tools"
import type { CommentItem } from "@/types/entities"

export const ITEM_COMMENTS_QUERY_KEY = (
  entityType: "tool" | "product",
  slug: string
) => ["comments", entityType, slug]

export const useItemComments = (
  entityType: "tool" | "product",
  slug: string
) => {
  return useQuery<CommentItem[]>({
    queryKey: ITEM_COMMENTS_QUERY_KEY(entityType, slug),
    queryFn: async () => {
      const data =
        entityType === "tool"
          ? await fetchToolComments(slug)
          : await fetchProductComments(slug)
      return (data ?? []) as CommentItem[]
    },
    enabled: Boolean(slug),
    staleTime: 30_000,
  })
}

export const useCreateItemComment = (
  entityType: "tool" | "product",
  slug: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { body: string }) => {
      if (entityType === "tool") {
        return submitToolComment(slug, payload)
      }
      return submitProductComment(slug, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ITEM_COMMENTS_QUERY_KEY(entityType, slug),
      })
      queryClient.invalidateQueries({
        queryKey: [entityType, slug],
      })
    },
  })
}
