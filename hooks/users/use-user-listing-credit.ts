"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchUserListingCredit,
  type UserListingCreditDto,
} from "@/lib/api/users"

export const useUserListingCredit = (enabled = true) =>
  useQuery<UserListingCreditDto | null>({
    queryKey: ["user-listing-credit"],
    queryFn: fetchUserListingCredit,
    enabled,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  })
