"use client"

import { useMutation } from "@tanstack/react-query"
import { deleteFileFromStorage } from "@/lib/api/upload"

export const useDeleteImage = () => {
  const mutation = useMutation({
    mutationFn: async (urlOrKey: string) => {
      return await deleteFileFromStorage(urlOrKey)
    },
  })

  return {
    ...mutation,
    deleteImage: mutation.mutateAsync,
  }
}
