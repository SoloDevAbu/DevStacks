import axios from "axios"
import { apiClient } from "@/lib/api/axios-instance"

export type UploadKind = "logo" | "screenshot"

export interface PresignResponse {
  uploadUrl: string
  publicUrl: string
  key: string
}

export interface UploadOptions {
  onProgress?: (progress: number) => void
}

export const requestPresignedUrl = async (
  kind: UploadKind,
  file: File
): Promise<PresignResponse> => {
  const { data } = await apiClient.post<PresignResponse>("/upload/presign", {
    kind,
    contentType: file.type,
    fileSize: file.size,
    fileName: file.name,
  })
  return data
}

export const uploadFileToStorage = async (
  kind: UploadKind,
  file: File,
  options?: UploadOptions
): Promise<string> => {
  const { uploadUrl, publicUrl } = await requestPresignedUrl(kind, file)

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
    onUploadProgress: (progressEvent) => {
      if (options?.onProgress && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        options.onProgress(percent)
      }
    },
  })

  return publicUrl
}

export const deleteFileFromStorage = async (
  urlOrKey: string
): Promise<{ success: boolean; key: string }> => {
  const { data } = await apiClient.post<{ success: boolean; key: string }>(
    "/upload/delete",
    { url: urlOrKey }
  )
  return data
}
