export const STORAGE_CONFIG = {
  BUCKET_NAME: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "launchnests-media",
  LOGO: {
    MAX_SIZE_BYTES: 500 * 1024, // 500KB (0.5MB)
    ALLOWED_TYPES: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    ASPECT_RATIO: 1.0,
    ASPECT_TOLERANCE: 0.05,
  },
  SCREENSHOTS: {
    MAX_COUNT: 3,
    MAX_SIZE_BYTES: 1 * 1024 * 1024, // 1MB
    ALLOWED_TYPES: ["image/png", "image/jpeg", "image/webp"],
  },
} as const
