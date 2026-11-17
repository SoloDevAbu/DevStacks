import type { Pricing } from "@/constants/plans"

export type AlternativeLicense =
  "Open Source" | "Source Available" | "Commercial"

export interface CuratedAlternative {
  name: string
  websiteUrl: string
  // Set when the alternative is also listed on LaunchNests, so its catalog card is shown instead.
  toolSlug?: string
  bestFor: string
  license: AlternativeLicense
  pricing: Pricing
  platforms: string
  tags: string[]
}

export interface CuratedAlternatives {
  toolSlug: string
  toolName: string
  intro: string
  stickWith: string[]
  switchWhen: string[]
  factsCheckedOn: string
  alternatives: CuratedAlternative[]
}
