"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchComments, submitComment } from "@/lib/api/products"

export const COMMENTS_QUERY_KEY = (slug: string) => ["comments", slug]

export const useComments = (slug: string) => {
  return useQuery({
    queryKey: COMMENTS_QUERY_KEY(slug),
    queryFn: () => fetchComments(slug),
    enabled: Boolean(slug),
    staleTime: 30_000,
  })
}

export const useCreateComment = (slug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { userId: string; body: string }) =>
      submitComment(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_QUERY_KEY(slug) })
      queryClient.invalidateQueries({ queryKey: ["product", slug] })
    },
  })
}
