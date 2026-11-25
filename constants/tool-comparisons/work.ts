import type { ToolPairNotes } from "@/types/alternatives"

export const N8N_PAIRS: ToolPairNotes = {
  zapier: {
    verdict:
      "Zapier is a hosted no-code platform with the largest app catalogue and per-task pricing. n8n is fair-code and free to self-host for your own team, with code nodes and AI agents, so heavy workflows cost far less, but you run the servers or pay for n8n Cloud.",
    chooseTool: [
      "You run many executions and want to self-host without per-task fees.",
      "Your team is technical and wants JavaScript or Python inside workflows.",
    ],
    chooseAlternative: [
      "Non-technical teammates build automations and need the widest set of ready-made integrations.",
      "You do not want to host or maintain anything.",
    ],
  },
  make: {
    verdict:
      "Make is a hosted visual builder with routers, iterators and credit-based pricing. n8n offers a similar canvas but can be self-hosted for free under its Sustainable Use License and lets you drop into code at any step.",
    chooseTool: [
      "You need to self-host for data control or to avoid usage-based bills.",
      "You build AI agents and want code steps alongside visual nodes.",
    ],
    chooseAlternative: [
      "You want a hosted builder with a very visual editor and no servers to run.",
      "Your team is mostly non-technical.",
    ],
  },
}

export const ZAPIER_PAIRS: ToolPairNotes = {
  make: {
    verdict:
      "Zapier is the simplest way to connect apps, with linear Zaps and the largest integration catalogue. Make uses a visual canvas with routers, iterators and detailed error handling, and its credit pricing is usually cheaper for multi-step, high-volume scenarios.",
    chooseTool: [
      "You want the fastest setup and the broadest app coverage for simple workflows.",
      "You also want Tables, Forms and AI agents from the same vendor.",
    ],
    chooseAlternative: [
      "Your workflows branch, loop over data and need fine-grained error handling.",
      "Per-task costs on Zapier are getting expensive at your volume.",
    ],
  },
}

export const JIRA_PAIRS: ToolPairNotes = {
  linear: {
    verdict:
      "Jira is highly configurable, with custom workflows, fields and permissions that scale to large organisations and the Atlassian ecosystem. Linear is opinionated and fast, with cycles, triage and a keyboard-first interface that most product engineering teams adopt without configuration.",
    chooseTool: [
      "You need custom workflows, permission schemes and cross-team reporting.",
      "You rely on Confluence, Jira Service Management or Marketplace apps.",
    ],
    chooseAlternative: [
      "Your team wants speed and sensible defaults over configuration.",
      "You are a startup or product team that wants issues, projects and roadmaps in one fast tool.",
    ],
  },
  clickup: {
    verdict:
      "Jira is built for software teams, with sprints, backlogs and developer integrations at its core. ClickUp is an all-in-one workspace for tasks, docs, goals and whiteboards that engineering and business teams can share.",
    chooseTool: [
      "Your main users are software engineers running Scrum or Kanban.",
      "You need deep integrations with Bitbucket, GitHub and CI tools.",
    ],
    chooseAlternative: [
      "You want one workspace for engineering, marketing and operations.",
      "You want docs, goals and task management without separate tools.",
    ],
  },
}
