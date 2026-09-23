"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchLaunchAvailability,
  type LaunchAvailabilityResponse,
} from "@/lib/api/launches"

export const useLaunchAvailability = () =>
  useQuery<LaunchAvailabilityResponse>({
    queryKey: ["launch-availability"],
    queryFn: () => fetchLaunchAvailability(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  })
