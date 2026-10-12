import { defineConfig } from "@neon/config/v1"

export default defineConfig({
  buckets: {
    "launchnests-media": {
      access: "public_read",
    },
  },
})
