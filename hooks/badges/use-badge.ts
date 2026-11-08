"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchBadgeStatus, verifyBadge } from "@/lib/api/badges"
import type { ListingKind } from "@/db/queries/badges/badge-listings"

const badgeStatusKey = (slug: string, type: ListingKind) => [
  "badge-status",
  type,
  slug,
]

export const useBadgeStatus = (
  slug: string,
  type: ListingKind,
  enabled: boolean
) =>
  useQuery({
    queryKey: badgeStatusKey(slug, type),
    queryFn: () => fetchBadgeStatus(slug, type),
    enabled,
  })

export const useVerifyBadge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: verifyBadge,
    onSuccess: (_result, { slug, type }) =>
      queryClient.invalidateQueries({ queryKey: badgeStatusKey(slug, type) }),
  })
}
