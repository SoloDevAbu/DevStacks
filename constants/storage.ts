export const STORAGE_CONFIG = {
  BUCKET_NAME: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "launchnests-media",
  LOGO: {
    MAX_SIZE_BYTES: 2 * 1024 * 1024,
    ALLOWED_TYPES: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    ASPECT_RATIO: 1.0,
    ASPECT_TOLERANCE: 0.05,
  },
  SCREENSHOTS: {
    MAX_COUNT: 3,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ["image/png", "image/jpeg", "image/webp"],
  },
} as const
