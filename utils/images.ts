import { STORAGE_CONFIG } from "@/constants/storage"

export interface ImageDimensionsResult {
  valid: boolean
  width: number
  height: number
  ratio: number
  error?: string
}

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Failed to load image for validation"))
    }

    img.src = objectUrl
  })
}

export const validateLogoAspectRatio = async (
  file: File
): Promise<ImageDimensionsResult> => {
  if (file.type === "image/svg+xml") {
    return { valid: true, width: 0, height: 0, ratio: 1 }
  }

  try {
    const { width, height } = await getImageDimensions(file)
    if (!width || !height) {
      return {
        valid: false,
        width,
        height,
        ratio: 0,
        error: "Unable to read image dimensions",
      }
    }

    const ratio = width / height
    const isSquare =
      Math.abs(ratio - STORAGE_CONFIG.LOGO.ASPECT_RATIO) <=
      STORAGE_CONFIG.LOGO.ASPECT_TOLERANCE

    if (!isSquare) {
      return {
        valid: false,
        width,
        height,
        ratio,
        error: `Logo must be square (1:1 aspect ratio). Current dimensions: ${width}x${height} (${ratio.toFixed(2)}:1).`,
      }
    }

    return { valid: true, width, height, ratio }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to validate image"
    return {
      valid: false,
      width: 0,
      height: 0,
      ratio: 0,
      error: msg,
    }
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
