import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const LOVABLE_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "lovable",
  toolName: "Lovable",
  profile: {
    websiteUrl: "https://lovable.dev",
    bestFor:
      "An AI app builder that turns prompts into full-stack React apps with a built-in backend, hosting and GitHub sync.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Web",
  },
  intro:
    "Lovable builds and hosts a working web app from a chat, priced by credits with a small daily allowance on the free plan. Alternatives differ in what they generate and where it runs: Bolt.new and Replit run a full dev environment in the browser, v0 focuses on Next.js UI for Vercel, Base44 hides the code behind a no-code builder, and Dyad runs locally with your own API keys.",
  stickWith: [
    "You want a polished React app with auth and a database from a few prompts, without touching a terminal.",
    "You like editing visually and syncing the code to GitHub when a developer takes over.",
    "Credit-based pricing fits how often you iterate.",
  ],
  switchWhen: [
    "You need more than React web apps, such as other languages, mobile apps or long-running backends (Replit).",
    "You want generated code that deploys straight to Vercel with Next.js (v0).",
    "You want to run the builder locally, use your own model keys or avoid credits (Dyad).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Bolt.new",
      websiteUrl: "https://bolt.new",
      bestFor:
        "StackBlitz's browser-based AI builder that runs a full Node.js environment with WebContainers.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Browser IDE", "Token pricing"],
    },
    {
      name: "Replit",
      websiteUrl: "https://replit.com",
      toolSlug: "replit",
      bestFor:
        "A cloud IDE with Replit Agent that builds, hosts and deploys apps in many languages.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android, macOS, Windows",
      tags: ["Cloud IDE", "Agent"],
    },
    {
      name: "v0",
      websiteUrl: "https://v0.app",
      bestFor:
        "Vercel's AI builder for Next.js and shadcn/ui apps, with one-click deploys to Vercel.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Next.js", "Vercel"],
    },
    {
      name: "Base44",
      websiteUrl: "https://base44.com",
      bestFor:
        "A no-code AI app builder owned by Wix, with built-in database, auth and hosting.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["No-code", "Wix"],
    },
    {
      name: "Dyad",
      websiteUrl: "https://www.dyad.sh",
      bestFor:
        "A free, local desktop AI app builder that uses your own API keys or local models.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows",
      tags: ["Local-first", "Bring your own key"],
    },
    {
      name: "Cursor",
      websiteUrl: "https://cursor.com",
      toolSlug: "cursor",
      bestFor:
        "An AI code editor for when you outgrow prompt-only builders and want full control of the codebase.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["AI editor", "For developers"],
    },
  ],
}
