"use client"

import { useMutation } from "@tanstack/react-query"
import { syncUser, type SyncUserPayload } from "@/lib/api/users"

export const useSyncUser = () => {
  return useMutation({
    mutationFn: (payload: SyncUserPayload) => syncUser(payload),
  })
}
