"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchUserSubmissions, type UserSubmissionDto } from "@/lib/api/ads"

export const useUserSubmissions = (includePending = false) =>
  useQuery<UserSubmissionDto[]>({
    queryKey: ["user-submissions", { includePending }],
    queryFn: () => fetchUserSubmissions(includePending),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
