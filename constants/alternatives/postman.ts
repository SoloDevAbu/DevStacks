import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const POSTMAN_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "postman",
  toolName: "Postman",
  profile: {
    websiteUrl: "https://www.postman.com",
    bestFor:
      "An API platform for sending requests, writing tests, sharing collections and mocking and monitoring APIs.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Windows, macOS, Linux, Web",
  },
  intro:
    "Postman is an API platform for designing, testing, documenting and monitoring APIs, with cloud workspaces for teams. Developers usually switch for an offline, git-friendly client (Bruno), an open-source web client (Hoppscotch), a lighter desktop app (Insomnia) or tooling that lives in the editor or terminal (Thunder Client, HTTPie, curl).",
  stickWith: [
    "Your team shares collections, environments and mocks in Postman workspaces.",
    "You use its monitors, API governance or documentation publishing.",
    "Non-developers on your team test APIs through its UI.",
  ],
  switchWhen: [
    "You want collections stored as plain files in your git repo (Bruno).",
    "You need a free, open-source or self-hosted client (Hoppscotch, Insomnia).",
    "You prefer testing APIs from VS Code or the terminal (Thunder Client, HTTPie, curl).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Bruno",
      websiteUrl: "https://www.usebruno.com",
      bestFor:
        "An offline API client that stores collections as plain-text files in your repo.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["Git-friendly", "Offline"],
    },
    {
      name: "Hoppscotch",
      websiteUrl: "https://hoppscotch.io",
      bestFor:
        "A fast, open-source API client in the browser, with a self-hosted option.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Web, Desktop, Self-hosted",
      tags: ["Web client", "Self-hosted"],
    },
    {
      name: "Insomnia",
      websiteUrl: "https://insomnia.rest",
      bestFor:
        "A desktop client for REST, GraphQL, gRPC and WebSockets, with local or git storage.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["GraphQL", "gRPC"],
    },
    {
      name: "Thunder Client",
      websiteUrl: "https://www.thunderclient.com",
      bestFor: "A lightweight REST client inside VS Code.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "VS Code",
      tags: ["VS Code", "Lightweight"],
    },
    {
      name: "HTTPie",
      websiteUrl: "https://httpie.io",
      bestFor:
        "A human-friendly HTTP client for the terminal, plus desktop and web apps.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "CLI, Desktop, Web",
      tags: ["CLI", "Terminal"],
    },
    {
      name: "curl",
      websiteUrl: "https://curl.se",
      bestFor:
        "Scriptable HTTP requests from any shell or CI job, available almost everywhere.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "CLI",
      tags: ["CLI", "Scripting"],
    },
  ],
}
