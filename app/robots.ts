import type { MetadataRoute } from "next"
import { SITE_CONFIG } from "@/constants/site"

const DISALLOWED_PATHS = [
  "/api/auth/",
  "/api/checkout/",
  "/api/webhook/",
  "/api/track/",
  "/api/migrate/",
  "/api/seed/",
  "/api/users",
  "/admin/",
  "/dashboard/",
  "/*?*q=*",
  "/*?*sortBy=*",
  "/*?*pricing=*",
]

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "DuckDuckBot",
          "Slurp",
          "Baiduspider",
          "YandexBot",
        ],
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      // AI Crawlers, Answer Engines & LLM Agents
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "GoogleOther",
          "Applebot-Extended",
          "Applebot",
          "Amazonbot",
          "cohere-ai",
          "Meta-ExternalAgent",
          "FacebookBot",
          "Bytespider",
          "CCBot",
          "Diffbot",
          "YouBot",
          "DeepSeekBot",
          "Timpibot",
          "MistralAI-Crawler",
          "AI2Bot",
          "Brightbot 1.0",
          "Omgilibot",
        ],
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  }
}

export default robots
