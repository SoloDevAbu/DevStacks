import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const JIRA_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "jira",
  toolName: "Jira",
  profile: {
    websiteUrl: "https://www.atlassian.com/software/jira",
    bestFor:
      "Atlassian's issue and project tracker for software teams, with Scrum and Kanban boards, workflows and automation.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Web, macOS, Windows, iOS, Android",
  },
  intro:
    "Jira is the default tracker in many engineering organisations, free for up to 10 users and priced per user above that. Alternatives are either faster, opinionated trackers for product teams (Linear, Shortcut), tools that keep issues next to the code (GitHub Issues and Projects), open-source trackers you can self-host (Plane, OpenProject), or wider work management tools for non-engineering teams (ClickUp, Asana, YouTrack).",
  stickWith: [
    "You need custom workflows, permission schemes and reporting across many teams.",
    "You rely on Confluence, Jira Service Management or the Atlassian Marketplace.",
    "Compliance and audit needs favour an established enterprise vendor.",
  ],
  switchWhen: [
    "Your team wants a fast, keyboard-driven tracker with sensible defaults (Linear, Shortcut).",
    "Your issues and code already live on GitHub (GitHub Issues and Projects).",
    "You want to self-host an open-source tracker (Plane, OpenProject).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Linear",
      websiteUrl: "https://linear.app",
      toolSlug: "linear",
      bestFor:
        "A fast, keyboard-first issue tracker with cycles, projects and triage built for product engineering teams.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, macOS, Windows, iOS, Android",
      tags: ["Speed", "Product teams"],
    },
    {
      name: "GitHub Issues and Projects",
      websiteUrl: "https://github.com/features/issues",
      toolSlug: "github",
      bestFor:
        "Issues, sub-issues and project boards that sit next to your repositories and pull requests.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, macOS, Windows, iOS, Android",
      tags: ["Next to code", "GitHub"],
    },
    {
      name: "YouTrack",
      websiteUrl: "https://www.jetbrains.com/youtrack",
      bestFor:
        "JetBrains' tracker with agile boards, a knowledge base and helpdesk, free for up to 10 users in the cloud or self-hosted.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, Self-hosted",
      tags: ["Self-hosted option", "Helpdesk"],
    },
    {
      name: "Plane",
      websiteUrl: "https://plane.so",
      bestFor:
        "An AGPL open-source tracker with cycles, modules and pages that you can self-host or use in the cloud.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, Self-hosted",
      tags: ["Open source", "Self-hosted"],
    },
    {
      name: "Shortcut",
      websiteUrl: "https://www.shortcut.com",
      bestFor:
        "A tracker for software teams with stories, epics, iterations and docs, simpler to run than Jira.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["Software teams", "Simple setup"],
    },
    {
      name: "ClickUp",
      websiteUrl: "https://clickup.com",
      bestFor:
        "An all-in-one workspace for tasks, docs, goals and sprints across engineering and business teams.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, macOS, Windows, Linux, iOS, Android",
      tags: ["All-in-one", "Cross-team"],
    },
    {
      name: "Asana",
      websiteUrl: "https://asana.com",
      bestFor:
        "Work management for cross-functional projects, portfolios and goals, strongest outside engineering.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, macOS, Windows, iOS, Android",
      tags: ["Work management", "Business teams"],
    },
    {
      name: "OpenProject",
      websiteUrl: "https://www.openproject.org",
      bestFor:
        "GPLv3 project management with Gantt charts, agile boards and time tracking, free to self-host.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, Self-hosted",
      tags: ["Gantt", "Self-hosted"],
    },
  ],
}
