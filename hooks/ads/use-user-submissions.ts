"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchUserSubmissions, type UserSubmissionDto } from "@/lib/api/ads"

export const useUserSubmissions = () =>
  useQuery<UserSubmissionDto[]>({
    queryKey: ["user-submissions"],
    queryFn: fetchUserSubmissions,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
