import type { ToolPairNotes } from "@/types/alternatives"

export const CLAUDE_CODE_PAIRS: ToolPairNotes = {
  "openai-codex": {
    verdict:
      "Claude Code and OpenAI Codex are both agentic coding tools that run in the terminal, the IDE and the cloud. Claude Code runs Anthropic's Claude models and is included in paid Claude plans. Codex runs OpenAI's models, comes with ChatGPT plans or an API key, and its CLI is open source under Apache-2.0.",
    chooseTool: [
      "Your team already pays for Claude Pro, Max, Team or Enterprise seats.",
      "You want hooks, subagents, skills and MCP servers to shape how the agent works.",
    ],
    chooseAlternative: [
      "Your team already pays for ChatGPT plans or prefers OpenAI models.",
      "You want an open-source CLI you can read, fork and audit.",
    ],
  },
  opencode: {
    verdict:
      "Claude Code is Anthropic's own agent, tuned for Claude models and sold through Claude plans. OpenCode is an MIT-licensed terminal agent that works with many model providers, including local models, so you choose and pay for the model separately.",
    chooseTool: [
      "You want the agent built by the same company as the model, with features that ship alongside new Claude models.",
      "You want a subscription with predictable usage limits instead of per-token API bills.",
    ],
    chooseAlternative: [
      "You want to switch between providers or run local models from one open-source tool.",
      "You need to self-host or modify the agent itself.",
    ],
  },
}

export const CURSOR_PAIRS: ToolPairNotes = {
  "claude-code": {
    verdict:
      "Cursor is an AI code editor, a VS Code fork with tab completion, inline edits and an agent. Claude Code is an agent first that works from the terminal, IDE extensions, a desktop app and the web, and leaves the editor to you. Many developers use both: Cursor for editing, Claude Code for long multi-file tasks.",
    chooseTool: [
      "You want AI completions and edits as you type inside one editor.",
      "You want to switch between Anthropic, OpenAI and Google models in one subscription.",
    ],
    chooseAlternative: [
      "You prefer the terminal or your existing editor and want the agent to drive whole tasks.",
      "You already pay for a Claude plan and want to use its included Claude Code usage.",
    ],
  },
  "github-copilot": {
    verdict:
      "GitHub Copilot is an extension for VS Code, JetBrains, Visual Studio and Xcode, tied into GitHub issues and pull requests. Cursor replaces your editor with a VS Code fork built around AI, with faster completions and a deeper agent mode.",
    chooseTool: [
      "You are happy to switch to a VS Code-based editor for the best in-editor AI experience.",
      "You want background agents, codebase indexing and rules shared across the team.",
    ],
    chooseAlternative: [
      "You need to stay in JetBrains, Visual Studio or Xcode.",
      "Your work is centred on GitHub and you want an agent that picks up issues and opens pull requests.",
    ],
  },
}

export const GITHUB_COPILOT_PAIRS: ToolPairNotes = {
  "claude-code": {
    verdict:
      "GitHub Copilot is an assistant that lives in your IDE and on github.com, with a free plan and a cloud agent that works from issues. Claude Code is Anthropic's agent for the terminal, IDE, desktop and web, built for long, multi-file tasks and included in paid Claude plans.",
    chooseTool: [
      "You want a free plan and completions in VS Code, JetBrains, Visual Studio or Xcode.",
      "Your organisation already manages GitHub Enterprise and wants Copilot policies in one place.",
    ],
    chooseAlternative: [
      "You want an agent that plans and executes large changes across a repository from the terminal.",
      "You prefer Claude models and want to extend the agent with hooks, subagents and MCP servers.",
    ],
  },
}

export const LOVABLE_PAIRS: ToolPairNotes = {
  replit: {
    verdict:
      "Lovable turns prompts into React web apps with a built-in backend and hosting, aimed at founders and designers. Replit is a full cloud IDE with an agent that builds apps in many languages, plus databases, hosting and mobile apps for building on the go.",
    chooseTool: [
      "You want a polished React web app from prompts without seeing a terminal.",
      "You want visual editing and GitHub sync so a developer can take over later.",
    ],
    chooseAlternative: [
      "You need languages, backends or app types beyond React web apps.",
      "You want an IDE where you can read, run and debug the code yourself.",
    ],
  },
  v0: {
    verdict:
      "v0 is Vercel's AI builder, strongest at Next.js and shadcn/ui interfaces that deploy straight to Vercel. Lovable builds the full app around a hosted backend with auth and a database, so it suits non-developers shipping complete products.",
    chooseTool: [
      "You want a complete app with auth, data and hosting handled for you.",
      "You are not a developer and want to stay out of deployment settings.",
    ],
    chooseAlternative: [
      "Your stack is Next.js on Vercel and you want generated code that fits it.",
      "You mainly need UI components and pages to hand to developers.",
    ],
  },
}

export const REPLIT_PAIRS: ToolPairNotes = {
  cursor: {
    verdict:
      "Replit runs everything in the cloud: editor, agent, database and hosting, reachable from a browser or phone. Cursor is a desktop AI editor for developers who keep the code on their own machine and deploy it wherever they like.",
    chooseTool: [
      "You want to build and deploy without installing anything or managing hosting.",
      "You build from different devices, including a phone or tablet.",
    ],
    chooseAlternative: [
      "You are a developer with an existing local codebase, toolchain and deployment pipeline.",
      "You want the best in-editor completions and full control of git and the file system.",
    ],
  },
}
