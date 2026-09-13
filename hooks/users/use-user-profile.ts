"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "@/lib/auth/client"
import { fetchCurrentUserProfile } from "@/lib/api/profile"

export const USER_PROFILE_QUERY_KEY = ["user-profile"]

export const useUserProfile = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  return useQuery({
    queryKey: [...USER_PROFILE_QUERY_KEY, userId],
    queryFn: fetchCurrentUserProfile,
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  })
}
