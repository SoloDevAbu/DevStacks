import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const CURSOR_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "cursor",
  toolName: "Cursor",
  profile: {
    websiteUrl: "https://cursor.com",
    bestFor:
      "An AI-first code editor forked from VS Code, with agent mode, tab completion and a choice of frontier models.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "macOS, Windows, Linux",
  },
  intro:
    "Cursor is a VS Code fork with AI built into every part of the editor, sold as a free Hobby plan and usage-based paid plans. Alternatives either add AI to an editor you already use (GitHub Copilot, Cline, JetBrains AI), replace the editor with another AI-native one (Devin Desktop, formerly Windsurf, Zed, Kiro), or move the work into a terminal agent (Claude Code, OpenAI Codex).",
  stickWith: [
    "You want tab completion, inline edits and an agent in one VS Code-compatible editor.",
    "You switch between Anthropic, OpenAI and Google models and want them in one subscription.",
    "Your team already shares Cursor rules, background agents and Bugbot reviews.",
  ],
  switchWhen: [
    "You want to keep VS Code, JetBrains or Visual Studio and add AI to it (GitHub Copilot, Cline, JetBrains AI).",
    "You prefer a terminal agent that works across the whole repository (Claude Code, OpenAI Codex).",
    "You want a faster native editor or spec-driven development (Zed, Kiro).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "GitHub Copilot",
      websiteUrl: "https://github.com/features/copilot",
      toolSlug: "github-copilot",
      bestFor:
        "AI completions, chat and agent mode inside VS Code, JetBrains and Visual Studio, with a free plan.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "VS Code, JetBrains, Visual Studio, Xcode, CLI, Web",
      tags: ["IDE extension", "Free plan"],
    },
    {
      name: "Claude Code",
      websiteUrl: "https://www.claude.com/product/claude-code",
      toolSlug: "claude-code",
      bestFor:
        "Anthropic's terminal-first coding agent for large, multi-file changes, included in paid Claude plans.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "macOS, Linux, Windows, VS Code, JetBrains, Web",
      tags: ["Terminal agent", "Anthropic"],
    },
    {
      name: "Devin Desktop (formerly Windsurf)",
      websiteUrl: "https://devin.ai",
      bestFor:
        "Cognition's AI editor, renamed from Windsurf in June 2026, centred on managing coding agents.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["AI editor", "VS Code fork"],
    },
    {
      name: "Zed",
      websiteUrl: "https://zed.dev",
      bestFor:
        "A fast, open-source editor written in Rust with an agent panel, edit predictions and multiplayer editing.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Linux, Windows",
      tags: ["Native editor", "Rust"],
    },
    {
      name: "Kiro",
      websiteUrl: "https://kiro.dev",
      bestFor:
        "AWS's agentic IDE that turns prompts into specs, design docs and tasks before writing code.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS, Windows, Linux",
      tags: ["Spec-driven", "AWS"],
    },
    {
      name: "Cline",
      websiteUrl: "https://cline.bot",
      bestFor:
        "An open-source agent extension that brings Cursor-style agent mode to VS Code with your own API keys.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "VS Code, JetBrains, CLI",
      tags: ["IDE agent", "Bring your own key"],
    },
    {
      name: "JetBrains AI",
      websiteUrl: "https://www.jetbrains.com/ai",
      bestFor:
        "AI Assistant and the Junie coding agent inside IntelliJ IDEA, PyCharm, WebStorm and other JetBrains IDEs.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "JetBrains IDEs",
      tags: ["JetBrains", "Junie agent"],
    },
    {
      name: "OpenAI Codex",
      websiteUrl: "https://openai.com/codex",
      bestFor:
        "OpenAI's coding agent for the terminal, IDE and cloud, with an open-source CLI.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "macOS, Linux, Windows, VS Code, Web",
      tags: ["Terminal agent", "OpenAI"],
    },
  ],
}
