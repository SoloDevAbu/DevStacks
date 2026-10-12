"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { uploadFileToStorage, type UploadKind } from "@/lib/api/upload"

export interface UploadImageVariables {
  kind: UploadKind
  file: File
}

export const useUploadImage = () => {
  const [progress, setProgress] = useState<number>(0)

  const mutation = useMutation({
    mutationFn: async ({ kind, file }: UploadImageVariables) => {
      setProgress(0)
      const url = await uploadFileToStorage(kind, file, {
        onProgress: (p) => setProgress(p),
      })
      setProgress(100)
      return url
    },
  })

  return {
    ...mutation,
    progress,
    uploadImage: mutation.mutateAsync,
  }
}
