import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const CLAUDE_CODE_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "claude-code",
  toolName: "Claude Code",
  profile: {
    websiteUrl: "https://www.claude.com/product/claude-code",
    bestFor:
      "Anthropic's agentic coding tool that reads a codebase, edits files and runs commands from the terminal, IDE, desktop app or web.",
    license: "Commercial",
    pricing: PRICING.PAID,
    platforms: "macOS, Linux, Windows, VS Code, JetBrains, Web",
  },
  intro:
    "Claude Code is an agent first: it plans, edits many files and runs your tests and commands, and it is included with paid Claude plans or billed through the API. Alternatives split into other terminal agents (OpenAI Codex, OpenCode, Aider), AI editors built around an agent (Cursor, Google Antigravity) and assistants inside the editor you already use (GitHub Copilot, Cline).",
  stickWith: [
    "You want an agent that works across a whole repository from the terminal, with hooks, subagents and MCP servers.",
    "Your team already pays for Claude Pro, Max, Team or Enterprise seats, which include Claude Code.",
    "You rely on Claude models for long, multi-step refactors and code review.",
  ],
  switchWhen: [
    "You want a full AI editor with tab completion as well as an agent (Cursor, Google Antigravity).",
    "You want an open-source agent that works with any model provider or local models (OpenCode, Aider, Cline).",
    "Your company standardises on GitHub or OpenAI subscriptions (GitHub Copilot, OpenAI Codex).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "OpenAI Codex",
      websiteUrl: "https://openai.com/codex",
      bestFor:
        "OpenAI's coding agent, with an open-source CLI plus IDE and cloud versions that run on a ChatGPT plan or an API key.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "macOS, Linux, Windows, VS Code, Web",
      tags: ["Terminal agent", "Apache-2.0 CLI"],
    },
    {
      name: "Cursor",
      websiteUrl: "https://cursor.com",
      toolSlug: "cursor",
      bestFor:
        "An AI-first code editor forked from VS Code, with agent mode, tab completion and a choice of frontier models.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["AI editor", "VS Code fork"],
    },
    {
      name: "GitHub Copilot",
      websiteUrl: "https://github.com/features/copilot",
      toolSlug: "github-copilot",
      bestFor:
        "GitHub's assistant for completions, chat, agent mode and a cloud coding agent that opens pull requests.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "VS Code, JetBrains, Visual Studio, Xcode, CLI, Web",
      tags: ["IDE extension", "Pull request agent"],
    },
    {
      name: "Google Antigravity",
      websiteUrl: "https://antigravity.google",
      bestFor:
        "Google's agent-first development platform with a desktop app, AI editor and CLI that replaced Gemini CLI for individuals.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["Gemini", "Agent platform"],
    },
    {
      name: "OpenCode",
      websiteUrl: "https://opencode.ai",
      bestFor:
        "An open-source terminal coding agent that works with Anthropic, OpenAI, Google and local models.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "macOS, Linux, Windows",
      tags: ["Terminal agent", "Any model"],
    },
    {
      name: "Aider",
      websiteUrl: "https://aider.chat",
      bestFor:
        "A long-running open-source pair programmer in the terminal that commits each change to git.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "macOS, Linux, Windows",
      tags: ["Terminal agent", "Git-native"],
    },
    {
      name: "Cline",
      websiteUrl: "https://cline.bot",
      bestFor:
        "An open-source coding agent for VS Code that plans, edits and runs commands with your own API keys.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "VS Code, JetBrains, CLI",
      tags: ["IDE agent", "Bring your own key"],
    },
  ],
}
