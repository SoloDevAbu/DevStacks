import Link from "next/link"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { PageHeader } from "@/components/shared/page-header"
import { CategoryFaqSection } from "@/components/shared/category-faqs"
import { Badge } from "@/components/ui/badge"
import { GLOSSARY_UPDATED_ON } from "@/constants/glossary"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { GlossaryTerm } from "@/types/glossary"
import { formatFactsCheckedOn } from "@/utils/alternatives"
import { buildGlossaryQuestion } from "@/utils/glossary"
import {
  aboutSectionBlock,
  aboutSectionTitle,
  compareLinkList,
  compareLinkPill,
  bulletDot,
  bulletItem,
  bulletList,
  proseParagraph,
} from "@/utils/styles"

interface GlossaryTermViewProps {
  term: GlossaryTerm
  categoryLabel: string
  related: readonly GlossaryTerm[]
}

export const GlossaryTermView = ({
  term,
  categoryLabel,
  related,
}: GlossaryTermViewProps) => (
  <div className="flex min-h-full flex-col bg-white">
    <PageBreadcrumb
      items={[
        { name: "Home", href: ROUTES.HOME },
        { name: "Glossary", href: ROUTES.GLOSSARY },
        { name: term.term },
      ]}
    />
    <PageHeader
      heading={buildGlossaryQuestion(term)}
      description={`${term.shortDefinition} ${categoryLabel} glossary, updated ${formatFactsCheckedOn(GLOSSARY_UPDATED_ON)}.`}
    />

    <section className={aboutSectionBlock}>
      <h2 className={aboutSectionTitle}>{term.term} definition</h2>
      {term.definition.map((paragraph) => (
        <p key={paragraph} className={proseParagraph}>
          {paragraph}
        </p>
      ))}
      {term.aliases.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-500">
            Also known as
          </span>
          {term.aliases.map((alias) => (
            <Badge key={alias} variant="outline" className="text-[11px]">
              {alias}
            </Badge>
          ))}
        </div>
      )}
    </section>

    <section className={aboutSectionBlock}>
      <h2 className={aboutSectionTitle}>
        Why {term.term} {term.plural ? "matter" : "matters"}
      </h2>
      <ul className={bulletList}>
        {term.whyItMatters.map((point) => (
          <li key={point} className={bulletItem}>
            <span className={bulletDot} aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>

    <section className={aboutSectionBlock}>
      <h2 className={aboutSectionTitle}>
        {term.term} on {SITE_CONFIG.name}
      </h2>
      <p className={proseParagraph}>{term.onLaunchNests}</p>
      {term.relatedLinks.length > 0 && (
        <ul className={compareLinkList}>
          {term.relatedLinks.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className={compareLinkPill}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>

    {related.length > 0 && (
      <section className={aboutSectionBlock}>
        <h2 className={aboutSectionTitle}>Related terms</h2>
        <ul className={compareLinkList}>
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={ROUTES.GLOSSARY_TERM(item.slug)}
                className={compareLinkPill}
              >
                {item.term}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}

    <CategoryFaqSection
      title={`${term.term}: frequently asked questions`}
      description={`Common questions about ${term.term}.`}
      faqs={[...term.faqs]}
    />
  </div>
)
