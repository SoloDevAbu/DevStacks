import type { MetadataRoute } from "next"
import { SITE_CONFIG } from "@/constants/site"

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/users", "/api/auth/", "/admin/", "/dashboard/"],
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
        disallow: ["/api/users", "/api/auth/", "/admin/", "/dashboard/"],
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
        disallow: ["/api/users", "/api/auth/", "/admin/", "/dashboard/"],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  }
}

export default robots
