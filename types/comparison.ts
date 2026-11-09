export interface ComparisonDimension {
  key: string
  label: string
  competitorValue: string
  launchNestsValue: string
  description?: string
}

export interface PlatformProfile {
  name: string
  tagline: string
  websiteUrl: string
  primaryAudience: string
  discoveryLifespan: string
  pricingModel: string
  keyStrengths: string[]
  keyLimitations: string[]
}

export interface ComparisonScenario {
  id: string
  title: string
  badge: string
  badgeVariant?: "hot" | "new" | "neutral"
  recommendedFor: string
  explanation: string
  bulletPoints: string[]
}

export interface ComparisonDeepDive {
  id: string
  title: string
  subtitle: string
  competitorAngle: string
  launchNestsAngle: string
  practicalTakeaway: string
}

export interface ComparisonSource {
  label: string
  url: string
}

export interface RoundupEntry {
  name: string
  websiteUrl: string
  comparisonPath?: string
  bestFor: string
  verdict: string
  cost: string
  launchWindow: string
  freeLink: string
  strengths: readonly string[]
  limitations: readonly string[]
}

export interface ComparisonFaqItem {
  question: string
  answer: string
}

export interface PlatformComparison {
  slug: string
  routePath: string
  targetKeyword: string
  name: string
  comparedPlatformName: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  canonicalUrl: string
  factsCheckedOn: string
  sources: readonly ComparisonSource[]
  heroBadge: string
  heroTitle: string
  heroDescription: string
  comparedPlatformProfile: PlatformProfile
  launchNestsProfile: PlatformProfile
  quickComparisonDimensions: ComparisonDimension[]
  deepDives: ComparisonDeepDive[]
  scenarios: ComparisonScenario[]
  canYouUseBoth: {
    heading: string
    subheading: string
    description: string
    strategySteps: Array<{
      stepNumber: number
      title: string
      timing: string
      action: string
      outcome: string
    }>
    summary: string
  }
  faqs: ComparisonFaqItem[]
}
