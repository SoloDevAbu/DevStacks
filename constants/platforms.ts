export const PLATFORMS = [
  { id: "Web", label: "Web Application" },
  { id: "iOS", label: "Mobile App (iOS)" },
  { id: "Android", label: "Mobile App (Android)" },
  { id: "macOS", label: "Desktop (macOS)" },
  { id: "Windows", label: "Desktop (Windows)" },
  { id: "Linux", label: "Desktop (Linux)" },
  { id: "CLI", label: "CLI / Terminal" },
  { id: "API", label: "API / Backend" },
  { id: "Extension", label: "Browser Extension" },
  { id: "Plugin", label: "Plugin / Integration" },
  { id: "Cloud", label: "Cloud" },
  { id: "Self-Hosted", label: "Self-Hosted" },
] as const

export type Platform = (typeof PLATFORMS)[number]["id"]
