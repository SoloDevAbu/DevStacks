import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const ZAPIER_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "zapier",
  toolName: "Zapier",
  profile: {
    websiteUrl: "https://zapier.com",
    bestFor:
      "The largest hosted no-code automation platform, with thousands of app integrations, Tables, Forms and AI agents.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Web",
  },
  intro:
    "Zapier is the easiest way to connect SaaS apps without code, with a free plan of 100 tasks a month and per-task pricing above that. Alternatives either cut the cost of high-volume workflows (Make, n8n, Activepieces), give developers code steps and self-hosting (n8n, Pipedream), or fit a specific ecosystem (Power Automate for Microsoft 365, IFTTT for consumer apps and devices).",
  stickWith: [
    "Non-technical teammates build their own automations and need the widest app catalogue.",
    "Your workflows are simple triggers and actions where per-task pricing stays low.",
    "You want Tables, Forms, chatbots and agents from one vendor.",
  ],
  switchWhen: [
    "Task costs grow faster than the value of your workflows (Make, n8n, Activepieces).",
    "You need to self-host for data residency or security reviews (n8n, Activepieces).",
    "Your company runs on Microsoft 365 and needs desktop automation (Power Automate).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Make",
      websiteUrl: "https://www.make.com",
      bestFor:
        "A visual scenario builder with routers, iterators and error handling, priced by credits rather than tasks.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Visual builder", "Lower cost at volume"],
    },
    {
      name: "n8n",
      websiteUrl: "https://n8n.io",
      toolSlug: "n8n",
      bestFor:
        "Fair-code workflow automation with code nodes and AI agents, free to self-host for your own team.",
      license: "Source Available",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["Self-hosted", "AI agents"],
    },
    {
      name: "Microsoft Power Automate",
      websiteUrl: "https://www.microsoft.com/en-us/power-platform/products/power-automate",
      bestFor:
        "Cloud flows and desktop robotic process automation, with standard connectors included in Microsoft 365.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web, Windows",
      tags: ["Microsoft 365", "RPA"],
    },
    {
      name: "Activepieces",
      websiteUrl: "https://www.activepieces.com",
      bestFor:
        "An MIT-licensed, self-hostable automation builder with a Zapier-like editor and AI pieces.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["MIT", "Self-hosted"],
    },
    {
      name: "Pipedream",
      websiteUrl: "https://pipedream.com",
      bestFor:
        "Developer-first integrations where any step can run Node.js or Python, with managed auth for thousands of APIs.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Code steps", "Developers"],
    },
    {
      name: "IFTTT",
      websiteUrl: "https://ifttt.com",
      bestFor:
        "Simple applets that connect consumer apps, smart-home devices and social accounts.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android",
      tags: ["Consumer", "Smart home"],
    },
    {
      name: "Workato",
      websiteUrl: "https://www.workato.com",
      bestFor:
        "Enterprise integration and automation with governance, recipes and an embedded iPaaS.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web",
      tags: ["Enterprise", "iPaaS"],
    },
  ],
}
