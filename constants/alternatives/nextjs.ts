import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const NEXTJS_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "nextjs",
  toolName: "Next.js",
  intro:
    "Next.js is the open-source React framework from Vercel with Server Components, file-based routing and built-in rendering modes. Alternatives fall into two groups: other React frameworks with a different data model (React Router, TanStack Start) and meta-frameworks for other UI libraries or content-heavy sites (Astro, Nuxt, SvelteKit).",
  stickWith: [
    "You want React Server Components and streaming as first-class features.",
    "You deploy to Vercel or another host with a mature Next.js adapter.",
    "Your team already knows the App Router and its caching model.",
  ],
  switchWhen: [
    "Your site is mostly content and should ship little or no JavaScript (Astro).",
    "You prefer Vue or Svelte over React (Nuxt, SvelteKit).",
    "You want web-standard loaders and actions or a client-first React app (React Router, TanStack Start, Vite).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "React Router (formerly Remix)",
      websiteUrl: "https://reactrouter.com",
      bestFor:
        "Full-stack React apps built on web standards, with loaders, actions and nested routes.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js, Edge, Serverless",
      tags: ["React", "Full-stack"],
    },
    {
      name: "Astro",
      websiteUrl: "https://astro.build",
      bestFor:
        "Content-heavy sites that ship zero JavaScript by default and hydrate islands on demand.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Static, Node.js, Edge",
      tags: ["Content sites", "Islands"],
    },
    {
      name: "Nuxt",
      websiteUrl: "https://nuxt.com",
      bestFor:
        "Teams that prefer Vue and want server rendering, file routing and auto-imports.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js, Edge, Static",
      tags: ["Vue", "SSR"],
    },
    {
      name: "SvelteKit",
      websiteUrl: "https://svelte.dev/docs/kit",
      bestFor:
        "Fast, compiled Svelte apps with server rendering and adapters for every host.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js, Edge, Static",
      tags: ["Svelte", "SSR"],
    },
    {
      name: "TanStack Start",
      websiteUrl: "https://tanstack.com/start",
      bestFor:
        "Type-safe full-stack React built on TanStack Router, with server functions and SSR.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js, Edge, Serverless",
      tags: ["React", "Type-safe routing"],
    },
    {
      name: "Vite",
      websiteUrl: "https://vite.dev",
      toolSlug: "vite",
      bestFor:
        "Single-page React apps that do not need a server framework, with a very fast dev server.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Static, Any host",
      tags: ["Build tool", "SPA"],
    },
    {
      name: "Angular",
      websiteUrl: "https://angular.dev",
      bestFor:
        "Large teams that want a batteries-included framework with built-in SSR and hydration.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Node.js, Static",
      tags: ["Enterprise", "TypeScript"],
    },
  ],
}
