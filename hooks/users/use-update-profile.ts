"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUserProfileApi } from "@/lib/api/profile"
import { USER_PROFILE_QUERY_KEY } from "./use-user-profile"
import type { UpdateProfileInput } from "@/lib/validation/profile"

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateUserProfileApi(input),
    onSuccess: (data) => {
      queryClient.setQueryData([...USER_PROFILE_QUERY_KEY, data.id], data)
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
    },
  })
}
