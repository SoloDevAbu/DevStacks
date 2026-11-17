import { PRICING, type Pricing } from "@/constants/plans"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { toAbsoluteUrl } from "@/utils/urls"

export interface Faq {
  id?: string
  question: string
  answer: string
}

interface DerivedFaqInput {
  name: string
  pricing: Pricing
  isOpenSource: boolean
  githubUrl?: string | null
  slug: string
  alternativeNames: readonly string[]
  hasAlternativesPage: boolean
  builtWithNames: readonly string[]
  existingQuestions: readonly string[]
}

const MAX_LISTED_NAMES = 4

const listNames = (names: readonly string[]) => {
  const shown = names.slice(0, MAX_LISTED_NAMES)
  return shown.length > 1
    ? `${shown.slice(0, -1).join(", ")} and ${shown.at(-1)}`
    : (shown[0] ?? "")
}

const pricingAnswer = (name: string, pricing: Pricing): string => {
  switch (pricing) {
    case PRICING.FREE:
      return `Yes. ${name} is listed as free to use on ${SITE_CONFIG.name}.`
    case PRICING.OPEN_SOURCE:
      return `Yes. ${name} is open source, so you can use and self-host it for free. Any hosted or managed offering may be priced separately.`
    case PRICING.FREEMIUM:
      return `${name} has a free tier, with paid plans for more usage or features. Check the official pricing page for current limits.`
    case PRICING.PAID:
      return `No. ${name} is a paid product. Check the official website for current plans and any free trial.`
  }
}

// Short, factual answers built from listing fields, for the questions people search before choosing
// a tool. A topic the maker already answered in their own FAQs is skipped.
export const buildDerivedToolFaqs = ({
  name,
  pricing,
  isOpenSource,
  githubUrl,
  slug,
  alternativeNames,
  hasAlternativesPage,
  builtWithNames,
  existingQuestions,
}: DerivedFaqInput): Faq[] => {
  const asked = existingQuestions.join(" ").toLowerCase()
  const isAnswered = (topic: string) => asked.includes(topic)

  const candidates: Array<{ topic: string; faq: Faq | null }> = [
    {
      topic: "free",
      faq: {
        question: `Is ${name} free?`,
        answer: pricingAnswer(name, pricing),
      },
    },
    {
      topic: "open source",
      faq: isOpenSource
        ? {
            question: `Is ${name} open source?`,
            answer: githubUrl
              ? `Yes. ${name} is open source, and its source code is published at ${githubUrl}.`
              : `Yes. ${name} is open source.`,
          }
        : null,
    },
    {
      topic: "alternative",
      faq:
        alternativeNames.length > 0
          ? {
              question: `What are the best alternatives to ${name}?`,
              answer: `Popular alternatives to ${name} include ${listNames(alternativeNames)}.${
                hasAlternativesPage
                  ? ` Compare them side by side at ${toAbsoluteUrl(ROUTES.ALTERNATIVES(slug))}.`
                  : ""
              }`,
            }
          : null,
    },
    {
      topic: "built with",
      faq:
        builtWithNames.length > 0
          ? {
              question: `What is built with ${name}?`,
              answer: `Products listed on ${SITE_CONFIG.name} that are built with ${name} include ${listNames(builtWithNames)}. See the full list at ${toAbsoluteUrl(ROUTES.BUILT_WITH(slug))}.`,
            }
          : null,
    },
  ]

  return candidates.flatMap(({ topic, faq }) =>
    faq && !isAnswered(topic) ? [faq] : []
  )
}
