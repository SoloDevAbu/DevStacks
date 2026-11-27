import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const GITHUB_COPILOT_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "github-copilot",
  toolName: "GitHub Copilot",
  profile: {
    websiteUrl: "https://github.com/features/copilot",
    bestFor:
      "GitHub's AI assistant for completions, chat, agent mode, code review and a cloud agent that opens pull requests.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "VS Code, JetBrains, Visual Studio, Xcode, CLI, Web",
  },
  intro:
    "GitHub Copilot lives inside the editor you already use and ties into GitHub issues and pull requests, with a free plan and usage-based paid plans since June 2026. Alternatives either replace the editor (Cursor, Google Antigravity), move the work into a terminal agent (Claude Code, OpenAI Codex), or keep you in your IDE with a different vendor or an open-source agent (JetBrains AI, Cline).",
  stickWith: [
    "Your code, issues and pull requests already live on GitHub and you want the agent to work there.",
    "You need one assistant across VS Code, JetBrains, Visual Studio and Xcode.",
    "Your organisation already manages Copilot Business or Enterprise seats and policies.",
  ],
  switchWhen: [
    "You want an editor designed around AI rather than an extension (Cursor, Google Antigravity).",
    "You want an agent that handles long, multi-file tasks from the terminal (Claude Code, OpenAI Codex).",
    "You want to pick any model or run local models with your own keys (Cline, Zed).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Cursor",
      websiteUrl: "https://cursor.com",
      toolSlug: "cursor",
      bestFor:
        "An AI-first VS Code fork with agent mode, fast tab completion and models from several providers.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["AI editor", "VS Code fork"],
    },
    {
      name: "Claude Code",
      websiteUrl: "https://www.claude.com/product/claude-code",
      toolSlug: "claude-code",
      bestFor:
        "Anthropic's agentic coding tool for the terminal, IDE, desktop and web, included in paid Claude plans.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "macOS, Linux, Windows, VS Code, JetBrains, Web",
      tags: ["Terminal agent", "Anthropic"],
    },
    {
      name: "OpenAI Codex",
      websiteUrl: "https://openai.com/codex",
      bestFor:
        "OpenAI's coding agent with an open-source CLI, an IDE extension and cloud tasks that run in parallel.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "macOS, Linux, Windows, VS Code, Web",
      tags: ["Terminal agent", "OpenAI"],
    },
    {
      name: "Google Antigravity",
      websiteUrl: "https://antigravity.google",
      bestFor:
        "Google's agent-first IDE, desktop app and CLI with a free individual plan and Gemini models.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["Gemini", "Agent platform"],
    },
    {
      name: "JetBrains AI",
      websiteUrl: "https://www.jetbrains.com/ai",
      bestFor:
        "AI Assistant and the Junie agent built into JetBrains IDEs, with a free tier included in IDE licences.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "JetBrains IDEs",
      tags: ["JetBrains", "Junie agent"],
    },
    {
      name: "Cline",
      websiteUrl: "https://cline.bot",
      bestFor:
        "An open-source VS Code agent that uses your own API keys or local models instead of a subscription.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "VS Code, JetBrains, CLI",
      tags: ["IDE agent", "Bring your own key"],
    },
    {
      name: "Zed",
      websiteUrl: "https://zed.dev",
      bestFor:
        "A fast open-source editor with built-in edit predictions and an agent panel that can host external agents.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Linux, Windows",
      tags: ["Native editor", "Rust"],
    },
  ],
}
