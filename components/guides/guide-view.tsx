import Link from "next/link"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { PageHeader } from "@/components/shared/page-header"
import { CategoryFaqSection } from "@/components/shared/category-faqs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { ROUTES } from "@/constants/routes"
import type { Guide } from "@/types/guides"
import { buildGuideByline } from "@/utils/guides"
import {
  aboutSectionBlock,
  aboutSectionTitle,
  bulletDot,
  bulletItem,
  bulletList,
  compareLinkList,
  compareLinkPill,
  monoLabel,
} from "@/utils/styles"

interface GuideViewProps {
  guide: Guide
}

export const GuideView = ({ guide }: GuideViewProps) => (
  <div className="flex min-h-full flex-col bg-white">
    <PageBreadcrumb
      items={[
        { name: "Home", href: ROUTES.HOME },
        { name: "Guides", href: ROUTES.GUIDES },
        { name: guide.title },
      ]}
    />
    <PageHeader heading={guide.title} description={guide.description} />

    <section className={aboutSectionBlock} aria-labelledby="key-takeaways">
      <p className={monoLabel}>{buildGuideByline(guide)}</p>
      <h2 id="key-takeaways" className={aboutSectionTitle}>
        Key takeaways
      </h2>
      <ul className={bulletList}>
        {guide.keyTakeaways.map((point) => (
          <li key={point} className={bulletItem}>
            <span className={bulletDot} aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>

    {guide.sections.map(({ heading, body }) => (
      <section key={heading} className={aboutSectionBlock}>
        <MarkdownContent markdown={`# ${heading}\n\n${body}`} />
      </section>
    ))}

    {guide.relatedLinks.length > 0 && (
      <section className={aboutSectionBlock}>
        <h2 className={aboutSectionTitle}>Related</h2>
        <ul className={compareLinkList}>
          {guide.relatedLinks.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className={compareLinkPill}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}

    <CategoryFaqSection
      title="Frequently asked questions"
      description={`Short answers about ${guide.keywords[0]}.`}
      faqs={[...guide.faqs]}
    />
  </div>
)
