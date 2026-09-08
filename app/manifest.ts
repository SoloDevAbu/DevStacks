import type { MetadataRoute } from "next"
import { SITE_CONFIG } from "@/constants/site"

const manifest = (): MetadataRoute.Manifest => {
  return {
    name: `${SITE_CONFIG.name} — Discover Developer Tools & Products`,
    short_name: SITE_CONFIG.shortName,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: SITE_CONFIG.themeColor,
    categories: ["developer tools", "productivity", "utilities", "business"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    shortcuts: [
      {
        name: "Trending Tools",
        url: "/trending",
        description: "Explore the top trending developer tools and products",
      },
      {
        name: "Tools Directory",
        url: "/tools",
        description: "Browse APIs, databases, and developer infrastructure",
      },
      {
        name: "Submit Product",
        url: "/submit",
        description: "List a developer tool or software product",
      },
    ],
  }
}

export default manifest
