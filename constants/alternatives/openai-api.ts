import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const OPENAI_API_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "openai-api",
  toolName: "OpenAI API",
  intro:
    "The OpenAI API gives developers access to GPT models for text, vision, audio and embeddings. Alternatives offer other frontier models (Anthropic Claude, Google Gemini, Mistral AI), fast or cheap inference of open-weight models (Groq, Together AI), one API in front of many providers (OpenRouter), or models that run locally (Ollama).",
  stickWith: [
    "Your prompts, evals and tooling are tuned to OpenAI models.",
    "You use OpenAI-specific features such as its Assistants, Realtime or fine-tuning APIs.",
    "Your compliance review already covers OpenAI as a processor.",
  ],
  switchWhen: [
    "Another model scores better on your own evals or costs less per task (Claude, Gemini, Mistral).",
    "You want to avoid lock-in by routing across providers through one API (OpenRouter).",
    "Data must stay on your own hardware (Ollama) or you need very low latency (Groq).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Anthropic Claude API",
      websiteUrl: "https://www.anthropic.com/api",
      bestFor: "Claude models for coding, long documents and agentic tool use.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "API, AWS Bedrock, Google Vertex AI",
      tags: ["LLM", "Coding"],
    },
    {
      name: "Google Gemini API",
      websiteUrl: "https://ai.google.dev",
      bestFor:
        "Multimodal Gemini models with long context windows and a free tier for prototyping.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "API, Google Vertex AI",
      tags: ["Multimodal", "Long context"],
    },
    {
      name: "Mistral AI",
      websiteUrl: "https://mistral.ai",
      bestFor:
        "European models offered by API, several with open weights you can self-host.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "API, Self-hosted",
      tags: ["Open weights", "EU"],
    },
    {
      name: "OpenRouter",
      websiteUrl: "https://openrouter.ai",
      bestFor:
        "One OpenAI-compatible API in front of hundreds of models from many providers.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "API",
      tags: ["Model router", "OpenAI compatible"],
    },
    {
      name: "Groq",
      websiteUrl: "https://groq.com",
      bestFor:
        "Very low-latency inference of open-weight models on custom hardware.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "API",
      tags: ["Low latency", "Open models"],
    },
    {
      name: "Together AI",
      websiteUrl: "https://www.together.ai",
      bestFor:
        "Inference and fine-tuning of open-source models through an OpenAI-compatible API.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "API",
      tags: ["Open models", "Fine-tuning"],
    },
    {
      name: "Ollama",
      websiteUrl: "https://ollama.com",
      bestFor:
        "Running open-weight models locally with a simple CLI and an OpenAI-compatible endpoint.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "macOS, Windows, Linux",
      tags: ["Local", "Privacy"],
    },
  ],
}
