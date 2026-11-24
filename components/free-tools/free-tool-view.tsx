import Link from "next/link"
import type { ComponentType } from "react"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { PageHeader } from "@/components/shared/page-header"
import { CategoryFaqSection } from "@/components/shared/category-faqs"
import { AiReadinessChecker } from "@/components/free-tools/ai-readiness-checker"
import { BulkDomainRatingChecker } from "@/components/free-tools/bulk-domain-rating-checker"
import { DomainRatingChecker } from "@/components/free-tools/domain-rating-checker"
import { FREE_TOOLS } from "@/constants/free-tools"
import { ROUTES } from "@/constants/routes"
import type { FreeTool, FreeToolSlug } from "@/types/free-tools"
import {
  aboutSectionBlock,
  aboutSectionTitle,
  compareLinkList,
  compareLinkPill,
  freeToolStepList,
  freeToolWidget,
  proseParagraph,
} from "@/utils/styles"

const TOOL_WIDGETS: Record<FreeToolSlug, ComponentType> = {
  "domain-rating-checker": DomainRatingChecker,
  "bulk-domain-rating-checker": BulkDomainRatingChecker,
  "ai-readiness-checker": AiReadinessChecker,
}

const NEXT_STEP_LINKS = [
  { label: "Launch directory database", href: ROUTES.DIRECTORIES },
  {
    label: "Directory link check report",
    href: ROUTES.DIRECTORIES_LINK_CHECK_REPORT,
  },
  { label: "Launch & SEO glossary", href: ROUTES.GLOSSARY },
  { label: "Launch your product", href: ROUTES.SUBMIT },
] as const

export const FreeToolView = ({ tool }: { tool: FreeTool }) => {
  const Widget = TOOL_WIDGETS[tool.slug]
  const otherTools = FREE_TOOLS.filter(({ slug }) => slug !== tool.slug)

  return (
    <div className="flex min-h-full flex-col bg-white">
      <PageBreadcrumb
        items={[
          { name: "Home", href: ROUTES.HOME },
          { name: "Free Tools", href: ROUTES.FREE_TOOLS },
          { name: tool.name },
        ]}
      />
      <PageHeader heading={tool.name} description={tool.tagline} />

      <section className={freeToolWidget} aria-label={tool.name}>
        <Widget />
      </section>

      <section className={aboutSectionBlock}>
        <h2 className={aboutSectionTitle}>How to use the {tool.name}</h2>
        <ol className={freeToolStepList}>
          {tool.howTo.map((step) => (
            <li key={step.name}>
              <span className="font-semibold text-slate-800">{step.name}.</span>{" "}
              {step.text}
            </li>
          ))}
        </ol>
      </section>

      {tool.guide.map((section) => (
        <section key={section.heading} className={aboutSectionBlock}>
          <h2 className={aboutSectionTitle}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className={proseParagraph}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <section className={aboutSectionBlock}>
        <h2 className={aboutSectionTitle}>More free tools and resources</h2>
        <ul className={compareLinkList}>
          {[
            ...otherTools.map(({ slug, name }) => ({
              label: name,
              href: ROUTES.FREE_TOOL(slug),
            })),
            ...NEXT_STEP_LINKS,
          ].map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className={compareLinkPill}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CategoryFaqSection
        title={`${tool.name}: frequently asked questions`}
        description={`Common questions about the ${tool.name}.`}
        faqs={[...tool.faqs]}
      />
    </div>
  )
}
