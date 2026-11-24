import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const VERCEL_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "vercel",
  toolName: "Vercel",
  profile: {
    websiteUrl: "https://vercel.com",
    bestFor:
      "A frontend cloud for deploying Next.js and other frameworks with preview deployments, edge and serverless functions.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Cloud",
  },
  intro:
    "Vercel is a frontend cloud built by the Next.js team, with git-based deploys, preview URLs and serverless and edge functions. Alternatives are usually chosen for cost at scale (Cloudflare, Render, Fly.io), long-running servers and databases next to the app (Railway, Render), or self-hosting (Coolify, OpenNext).",
  stickWith: [
    "You want the most complete Next.js feature support with zero configuration.",
    "Preview deployments per pull request are central to your workflow.",
    "Your usage fits comfortably within your plan's included limits.",
  ],
  switchWhen: [
    "Bandwidth or function costs grow faster than revenue (Cloudflare, Render).",
    "You need long-running processes, background workers or databases beside the app (Railway, Render, Fly.io).",
    "You want to run Next.js on your own infrastructure (OpenNext, Coolify).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Netlify",
      websiteUrl: "https://www.netlify.com",
      bestFor:
        "Git-based frontend hosting with deploy previews, forms and serverless functions.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Edge, Serverless",
      tags: ["Jamstack", "Deploy previews"],
    },
    {
      name: "Cloudflare Workers & Pages",
      websiteUrl: "https://workers.cloudflare.com",
      toolSlug: "cloudflare",
      bestFor:
        "Edge hosting with a large free tier and unmetered bandwidth on static assets.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Edge",
      tags: ["Edge", "Low cost"],
    },
    {
      name: "Render",
      websiteUrl: "https://render.com",
      bestFor:
        "Web services, workers, cron jobs and managed Postgres on one platform.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Containers, Managed services",
      tags: ["PaaS", "Background workers"],
    },
    {
      name: "Railway",
      websiteUrl: "https://railway.com",
      bestFor:
        "Deploying apps and databases together with usage-based pricing and a visual canvas.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Containers",
      tags: ["PaaS", "Usage-based"],
    },
    {
      name: "Fly.io",
      websiteUrl: "https://fly.io",
      bestFor:
        "Running full-stack apps in containers close to users across many regions.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Containers, Multi-region",
      tags: ["Multi-region", "Containers"],
    },
    {
      name: "AWS Amplify Hosting",
      websiteUrl: "https://aws.amazon.com/amplify",
      bestFor:
        "Git-based hosting for web apps on AWS, with SSR support for Next.js.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "AWS",
      tags: ["AWS", "SSR"],
    },
    {
      name: "Coolify",
      websiteUrl: "https://coolify.io",
      bestFor:
        "A self-hostable, open-source PaaS for deploying apps and databases to your own servers.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted",
      tags: ["Self-hosted", "PaaS"],
    },
    {
      name: "OpenNext",
      websiteUrl: "https://opennext.js.org",
      bestFor:
        "Open-source adapters that run Next.js on AWS, Cloudflare and other platforms.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "AWS, Cloudflare, Netlify",
      tags: ["Next.js", "Adapter"],
    },
  ],
}
