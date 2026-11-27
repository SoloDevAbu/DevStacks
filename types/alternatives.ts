import type { Pricing } from "@/constants/plans"

export type AlternativeLicense =
  "Open Source" | "Source Available" | "Commercial"

// Facts shared by a curated tool and each of its alternatives.
export interface ToolFacts {
  websiteUrl: string
  bestFor: string
  license: AlternativeLicense
  pricing: Pricing
  platforms: string
}

export interface CuratedAlternative extends ToolFacts {
  name: string
  // Set when the alternative is also listed on LaunchNests, so its catalog card is shown instead.
  toolSlug?: string
  tags: string[]
}

export interface CuratedAlternatives {
  toolSlug: string
  toolName: string
  // The name people search with, when it differs from the product name ("OpenAI" for the OpenAI API).
  searchName?: string
  profile: ToolFacts
  intro: string
  stickWith: string[]
  switchWhen: string[]
  factsCheckedOn: string
  alternatives: CuratedAlternative[]
}

// A hand-written head-to-head between a curated tool and one of its alternatives.
export interface ToolPairNote {
  verdict: string
  chooseTool: string[]
  chooseAlternative: string[]
}

// Keyed by the alternative's comparison slug (see `getAlternativeSlug`).
export type ToolPairNotes = Readonly<Record<string, ToolPairNote>>
