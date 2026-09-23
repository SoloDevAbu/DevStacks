"use client"

import { useQuery } from "@tanstack/react-query"
import { checkUsernameAvailability, type CheckUsernameResponse } from "@/lib/api/users"

export const CHECK_USERNAME_QUERY_KEY = (username: string) => [
  "users",
  "check-username",
  username.toLowerCase(),
]

export const useCheckUsername = (username: string) => {
  const clean = username.trim().toLowerCase().replace(/^@/, "")
  const isValidFormat = clean.length >= 2 && /^[a-z0-9_-]+$/i.test(clean)

  return useQuery<CheckUsernameResponse>({
    queryKey: CHECK_USERNAME_QUERY_KEY(clean),
    queryFn: () => checkUsernameAvailability(clean),
    enabled: isValidFormat,
    staleTime: 30_000,
  })
}
