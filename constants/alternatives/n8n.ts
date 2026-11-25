import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const N8N_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "n8n",
  toolName: "n8n",
  profile: {
    websiteUrl: "https://n8n.io",
    bestFor:
      "A visual workflow automation tool with code nodes and AI agents, free to self-host and sold as n8n Cloud.",
    license: "Source Available",
    pricing: PRICING.FREEMIUM,
    platforms: "Cloud, Self-hosted",
  },
  intro:
    "n8n is fair-code: the self-hosted Community Edition is free under the Sustainable Use License, which is not OSI open source and bars reselling n8n as a hosted service. Alternatives are either hosted no-code platforms with more ready-made integrations (Zapier, Make), MIT or Apache-licensed automation you can embed and resell (Activepieces, Node-RED, Kestra), or developer-first platforms built around scripts (Windmill, Pipedream).",
  stickWith: [
    "You want to self-host unlimited workflows and executions for your own team at no licence cost.",
    "You mix visual nodes with JavaScript or Python and build AI agents in the same canvas.",
    "Your workflows only run for your own organisation, which the Sustainable Use License allows.",
  ],
  switchWhen: [
    "You want the largest catalogue of no-code integrations without running servers (Zapier, Make).",
    "You need an OSI open-source licence to embed or resell automation (Activepieces, Node-RED, Kestra).",
    "Your automations are mostly scripts that need a developer workflow (Windmill, Pipedream).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Zapier",
      websiteUrl: "https://zapier.com",
      toolSlug: "zapier",
      bestFor:
        "The largest hosted no-code automation platform, with thousands of app integrations and AI agents.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["No-code", "Hosted"],
    },
    {
      name: "Make",
      websiteUrl: "https://www.make.com",
      bestFor:
        "A visual scenario builder with branching, iterators and credit-based pricing that is cheaper than Zapier at volume.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["No-code", "Visual builder"],
    },
    {
      name: "Activepieces",
      websiteUrl: "https://www.activepieces.com",
      bestFor:
        "An MIT-licensed, self-hostable Zapier alternative with a TypeScript framework for building integrations.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["MIT", "Self-hosted"],
    },
    {
      name: "Pipedream",
      websiteUrl: "https://pipedream.com",
      bestFor:
        "A developer-first integration platform where each step can be Node.js or Python code, now owned by Workday.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Code steps", "Serverless"],
    },
    {
      name: "Windmill",
      websiteUrl: "https://www.windmill.dev",
      bestFor:
        "An open-source platform that turns Python, TypeScript, Go and SQL scripts into workflows, UIs and cron jobs.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["Scripts", "AGPLv3"],
    },
    {
      name: "Node-RED",
      websiteUrl: "https://nodered.org",
      bestFor:
        "The OpenJS Foundation's flow-based tool for wiring devices, APIs and services, popular in IoT and home automation.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted, Linux, macOS, Windows, Raspberry Pi",
      tags: ["Apache-2.0", "IoT"],
    },
    {
      name: "Kestra",
      websiteUrl: "https://kestra.io",
      bestFor:
        "Declarative, YAML-defined orchestration for data pipelines, infrastructure and business workflows.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Self-hosted, Cloud",
      tags: ["Orchestration", "Apache-2.0"],
    },
  ],
}
