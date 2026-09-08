import type { MetadataRoute } from "next"
import { SITE_CONFIG } from "@/constants/site"

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/users", "/api/auth/", "/admin/"],
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
        disallow: ["/api/users", "/api/auth/", "/admin/"],
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
        ],
        allow: "/",
        disallow: ["/api/users", "/api/auth/", "/admin/"],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  }
}

export default robots
