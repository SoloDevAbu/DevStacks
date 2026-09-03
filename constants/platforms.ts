export const PLATFORMS = [
  { id: "web", label: "Web Application" },
  { id: "ios", label: "Mobile App (iOS)" },
  { id: "android", label: "Mobile App (Android)" },
  { id: "mac", label: "Desktop (macOS)" },
  { id: "windows", label: "Desktop (Windows)" },
  { id: "linux", label: "Desktop (Linux)" },
  { id: "cli", label: "CLI / Terminal" },
  { id: "api", label: "API / Backend" },
  { id: "extension", label: "Browser Extension" },
  { id: "plugin", label: "Plugin / Integration" },
] as const

export type Platform = (typeof PLATFORMS)[number]["id"]
