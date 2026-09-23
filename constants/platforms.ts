export const PLATFORMS = [
  {
    id: "Web",
    label: "Web Application",
    logo: "/social-logo/world-wide-web.png",
  },
  { id: "iOS", label: "Mobile App (iOS)", logo: "/social-logo/app-store.png" },
  {
    id: "Android",
    label: "Mobile App (Android)",
    logo: "/social-logo/playstore.png",
  },
  { id: "macOS", label: "Desktop (macOS)", logo: "/social-logo/happy-mac.png" },
  {
    id: "Windows",
    label: "Desktop (Windows)",
    logo: "/social-logo/windows.png",
  },
  { id: "Linux", label: "Desktop (Linux)", logo: "/social-logo/linux.png" },
  { id: "CLI", label: "CLI / Terminal", logo: "/social-logo/terminal.png" },
  { id: "API", label: "API / Backend", logo: "/social-logo/browser.png" },
  {
    id: "Extension",
    label: "Browser Extension",
    logo: "/social-logo/chrome.png",
  },
  {
    id: "Plugin",
    label: "Plugin / Integration",
    logo: "/social-logo/extensions.png",
  },
  { id: "Cloud", label: "Cloud", logo: "/social-logo/cloud.png" },
  { id: "Self-Hosted", label: "Self-Hosted", logo: "/social-logo/server.png" },
] as const

export type Platform = (typeof PLATFORMS)[number]["id"]
