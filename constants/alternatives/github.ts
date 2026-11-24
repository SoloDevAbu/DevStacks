import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const GITHUB_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "github",
  toolName: "GitHub",
  profile: {
    websiteUrl: "https://github.com",
    bestFor:
      "The largest Git hosting platform, with pull requests, Actions CI/CD, Packages, Codespaces and Copilot.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Web, Cloud, Enterprise Server",
  },
  intro:
    "GitHub is the largest Git hosting platform, with pull requests, Actions CI, Packages and Copilot. Alternatives either offer a full DevSecOps suite you can self-host (GitLab), integrate with Atlassian tools (Bitbucket), or give you a lightweight, community-run forge (Gitea, Forgejo, Codeberg).",
  stickWith: [
    "Your open-source project depends on GitHub's network effects and discoverability.",
    "You use GitHub Actions, Codespaces or Copilot heavily.",
    "Your integrations and bots already assume the GitHub API.",
  ],
  switchWhen: [
    "You must self-host your code and CI (GitLab, Gitea, Forgejo).",
    "Your team already works in Jira and Confluence (Bitbucket).",
    "You want a non-profit or minimalist host for open-source work (Codeberg, SourceHut).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "GitLab",
      websiteUrl: "https://about.gitlab.com",
      bestFor:
        "One DevSecOps platform for repos, CI/CD, security scanning and planning, cloud or self-managed.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["CI/CD", "Self-hosted"],
    },
    {
      name: "Bitbucket",
      websiteUrl: "https://bitbucket.org",
      bestFor:
        "Git hosting with Pipelines CI and tight integration with Jira and Confluence.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud",
      tags: ["Atlassian", "Pipelines"],
    },
    {
      name: "Gitea",
      websiteUrl: "https://about.gitea.com",
      bestFor:
        "A lightweight, self-hosted Git service written in Go that runs on small servers.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted",
      tags: ["Self-hosted", "Lightweight"],
    },
    {
      name: "Forgejo",
      websiteUrl: "https://forgejo.org",
      bestFor:
        "A community-governed fork of Gitea with built-in Actions-compatible CI.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted",
      tags: ["Community governed", "Self-hosted"],
    },
    {
      name: "Codeberg",
      websiteUrl: "https://codeberg.org",
      bestFor:
        "Free, non-profit hosting for open-source projects, powered by Forgejo.",
      license: "Open Source",
      pricing: PRICING.FREE,
      platforms: "Cloud",
      tags: ["Non-profit", "Open source projects"],
    },
    {
      name: "Azure DevOps",
      websiteUrl: "https://azure.microsoft.com/products/devops",
      bestFor:
        "Repos, Pipelines, Boards and test plans for teams standardised on Microsoft tooling.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["Microsoft", "Pipelines"],
    },
    {
      name: "SourceHut",
      websiteUrl: "https://sourcehut.org",
      bestFor:
        "A minimalist, email-driven software forge with no JavaScript required.",
      license: "Open Source",
      pricing: PRICING.PAID,
      platforms: "Cloud, Self-hosted",
      tags: ["Minimalist", "Mailing lists"],
    },
  ],
}
