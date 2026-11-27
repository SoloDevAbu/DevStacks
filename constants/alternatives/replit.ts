import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const REPLIT_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "replit",
  toolName: "Replit",
  profile: {
    websiteUrl: "https://replit.com",
    bestFor:
      "A cloud IDE with Replit Agent that builds, hosts and deploys apps in many languages from the browser.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Web, iOS, Android, macOS, Windows",
  },
  intro:
    "Replit combines a browser IDE, an AI agent and hosting, with a free Starter plan and paid plans that include usage credits. Alternatives either focus on prompt-to-app building (Lovable, Bolt.new, v0), give developers a full cloud dev environment for an existing repository (GitHub Codespaces, CodeSandbox, Coder), or move AI coding back to a local editor (Cursor).",
  stickWith: [
    "You want to go from idea to a deployed app in the browser, including on a phone or tablet.",
    "You need languages and backends beyond React web apps, with databases and hosting included.",
    "You teach or learn to code and want zero local setup.",
  ],
  switchWhen: [
    "You only build web apps and want a more polished prompt-to-app builder (Lovable, Bolt.new, v0).",
    "You need cloud dev environments for an existing GitHub repository and team (GitHub Codespaces, Coder).",
    "You want full control of a local codebase with AI assistance (Cursor).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Lovable",
      websiteUrl: "https://lovable.dev",
      toolSlug: "lovable",
      bestFor:
        "An AI app builder for full-stack React apps with a built-in backend, hosting and GitHub sync.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Prompt to app", "React"],
    },
    {
      name: "Bolt.new",
      websiteUrl: "https://bolt.new",
      bestFor:
        "StackBlitz's browser-based AI builder that runs Node.js in the browser with WebContainers.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Browser IDE", "Prompt to app"],
    },
    {
      name: "v0",
      websiteUrl: "https://v0.app",
      bestFor:
        "Vercel's AI builder for Next.js apps and UI, deployed to Vercel in one click.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Next.js", "Vercel"],
    },
    {
      name: "GitHub Codespaces",
      websiteUrl: "https://github.com/features/codespaces",
      toolSlug: "github",
      bestFor:
        "Cloud dev containers for any GitHub repository, with 120 free core hours a month on personal accounts.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, VS Code, JetBrains",
      tags: ["Dev containers", "GitHub"],
    },
    {
      name: "CodeSandbox",
      websiteUrl: "https://codesandbox.io",
      bestFor:
        "Browser and microVM sandboxes for prototyping, sharing code and running AI-generated code.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, VS Code",
      tags: ["Sandboxes", "Prototyping"],
    },
    {
      name: "Coder",
      websiteUrl: "https://coder.com",
      bestFor:
        "AGPL open-source cloud development environments that you self-host on your own infrastructure with Terraform.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted, Kubernetes, VMs",
      tags: ["Self-hosted", "Enterprise"],
    },
    {
      name: "Cursor",
      websiteUrl: "https://cursor.com",
      toolSlug: "cursor",
      bestFor:
        "An AI-first desktop code editor with agent mode, for developers who prefer a local workspace.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["AI editor", "Local"],
    },
  ],
}
