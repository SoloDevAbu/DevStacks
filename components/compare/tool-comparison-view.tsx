import Link from "next/link"
import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { ComparisonLinkGrid } from "@/components/shared/comparison-link-grid"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { COMPARISON_AUTHOR_LABEL } from "@/constants/comparisons"
import type { FaqItem } from "@/constants/faqs"
import { ROUTES } from "@/constants/routes"
import { formatFactsCheckedOn } from "@/utils/alternatives"
import { NOFOLLOW_LINK_REL, getFaviconUrl, getOutboundUrl } from "@/utils/urls"
import {
  getComparisonTitle,
  type ComparisonSide,
  type ToolComparison,
} from "@/utils/tool-comparisons"
import {
  bulletDot,
  bulletItem,
  bulletList,
  comparisonCategoryPill,
  comparisonH1,
  comparisonHeroWrapper,
  comparisonInlineLink,
  comparisonLeadParagraph,
  comparisonPageContainer,
  comparisonSectionSubtitle,
  comparisonSectionTitle,
  comparisonTableCard,
  comparisonTrustBar,
  dashedCellTitle,
  dashedFrame,
  dashedFrameRow,
  dashedGrid2,
  dashedGridCell,
} from "@/utils/styles"

interface ToolComparisonViewProps {
  comparison: ToolComparison
  related: readonly ToolComparison[]
  faqs: FaqItem[]
  year: number
}

const FACT_ROWS: ReadonlyArray<{
  label: string
  value: (side: ComparisonSide) => string
}> = [
  { label: "Best for", value: (side) => side.bestFor },
  { label: "License", value: (side) => side.license },
  { label: "Pricing", value: (side) => side.pricing },
  { label: "Platforms", value: (side) => side.platforms },
]

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => (
  <div>
    <h2 className={comparisonSectionTitle}>{title}</h2>
    <p className={comparisonSectionSubtitle}>{subtitle}</p>
  </div>
)

const SideLogo = ({ side }: { side: ComparisonSide }) => (
  <Avatar className="size-10 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
    <AvatarImage
      src={getFaviconUrl(side.websiteUrl) ?? ""}
      alt={side.name}
      className="object-contain"
    />
    <AvatarFallback className="rounded-lg font-mono text-xs font-bold text-slate-700">
      {side.name.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
)

const SideProfile = ({ side }: { side: ComparisonSide }) => (
  <div className={dashedGridCell}>
    <CornerBrackets />
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-border pb-4">
      <div className="flex min-w-0 items-center gap-3">
        <SideLogo side={side} />
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            {side.name}
          </h3>
          <p className="font-mono text-xs text-slate-500">
            {side.license} · {side.pricing}
          </p>
        </div>
      </div>
      <a
        href={getOutboundUrl(side.websiteUrl)}
        target="_blank"
        rel={NOFOLLOW_LINK_REL}
        className={comparisonInlineLink}
      >
        Visit ↗
      </a>
    </div>
    <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
      {side.bestFor}
    </p>
    {side.tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {side.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="font-mono text-[10px]">
            {tag}
          </Badge>
        ))}
      </div>
    )}
    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-dashed border-border pt-3">
      {side.catalogSlug && (
        <Link
          href={ROUTES.TOOL(side.catalogSlug)}
          className={comparisonInlineLink}
        >
          {side.name} on LaunchNests →
        </Link>
      )}
      {side.alternativesSlug && (
        <Link
          href={ROUTES.ALTERNATIVES(side.alternativesSlug)}
          className={comparisonInlineLink}
        >
          {side.name} alternatives →
        </Link>
      )}
    </div>
  </div>
)

export const ToolComparisonView = ({
  comparison,
  related,
  faqs,
  year,
}: ToolComparisonViewProps) => {
  const { a, b, verdict, chooseA, chooseB, factsCheckedOn } = comparison
  const title = getComparisonTitle(comparison)
  const alternativesSides = [a, b].filter((side) => side.alternativesSlug)

  return (
    <div className="flex w-full flex-col overflow-x-clip bg-white">
      <PageBreadcrumb
        items={[
          { name: "Home", href: ROUTES.HOME },
          { name: "Compare", href: ROUTES.COMPARE_HUB },
          { name: title },
        ]}
      />

      <div className={comparisonPageContainer}>
        <header className={comparisonHeroWrapper}>
          <span className={comparisonCategoryPill}>
            Developer tool comparison
          </span>
          <h1 className={comparisonH1}>
            {title} ({year})
          </h1>
          <p className={comparisonLeadParagraph}>{verdict}</p>

          <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
            {alternativesSides.map((side, index) => (
              <Button
                key={side.slug}
                variant={index === 0 ? "default" : "outline"}
                nativeButton={false}
                render={
                  <Link href={ROUTES.ALTERNATIVES(side.alternativesSlug!)} />
                }
                className="w-full text-xs font-semibold sm:w-auto"
              >
                All {side.name} alternatives →
              </Button>
            ))}
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={ROUTES.COMPARE_HUB} />}
              className="w-full text-xs font-semibold text-slate-700 sm:w-auto"
            >
              More tool comparisons
            </Button>
          </div>

          <div className={comparisonTrustBar}>
            <span>{COMPARISON_AUTHOR_LABEL}</span>
            <span aria-hidden="true">·</span>
            <span>Facts checked {formatFactsCheckedOn(factsCheckedOn)}</span>
          </div>

          <div className="mt-3 w-full max-w-xl">
            <AskAiBar
              prompt={`Compare ${a.name} and ${b.name} in ${year}. What are the key differences and which should I choose?`}
              label="ASK AI ABOUT THIS COMPARISON"
              align="center"
            />
          </div>
        </header>

        <section id="at-a-glance" className="flex flex-col gap-4">
          <SectionHeading
            title={`${title}: at a glance`}
            subtitle="License, pricing and platform facts, checked against each project's own site and docs."
          />
          <div className={comparisonTableCard}>
            <Table aria-label={`${title} comparison table`}>
              <TableHeader>
                <TableRow className="border-b border-dashed border-border bg-slate-50/80">
                  <TableHead className="w-1/4 px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Fact
                  </TableHead>
                  {[a, b].map((side) => (
                    <TableHead
                      key={side.slug}
                      className="w-3/8 px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-900 uppercase"
                    >
                      {side.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {FACT_ROWS.map((row) => (
                  <TableRow
                    key={row.label}
                    className="border-b border-dashed border-border last:border-b-0"
                  >
                    <TableCell className="px-4 py-4 align-top text-xs font-semibold whitespace-normal text-slate-900">
                      {row.label}
                    </TableCell>
                    {[a, b].map((side) => (
                      <TableCell
                        key={side.slug}
                        className="px-4 py-4 align-top text-xs leading-relaxed whitespace-normal text-slate-700 sm:text-sm"
                      >
                        {row.value(side)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section id="profiles" className="flex flex-col gap-4">
          <SectionHeading
            title={`What ${a.name} and ${b.name} do`}
            subtitle="Who each tool is built for, with links to its site, its LaunchNests listing and its alternatives."
          />
          <div className={dashedGrid2}>
            <SideProfile side={a} />
            <SideProfile side={b} />
          </div>
        </section>

        <section id="which-to-choose" className="flex flex-col gap-4">
          <SectionHeading
            title={`${a.name} or ${b.name}: which should you choose?`}
            subtitle="The situations where each tool is the better fit."
          />
          <div className={dashedGrid2}>
            {[
              { side: a, reasons: chooseA },
              { side: b, reasons: chooseB },
            ].map(({ side, reasons }) => (
              <div key={side.slug} className={dashedGridCell}>
                <CornerBrackets />
                <h3 className={dashedCellTitle}>Choose {side.name} if</h3>
                <ul className={bulletList}>
                  {reasons.map((reason) => (
                    <li key={reason} className={bulletItem}>
                      <span className={bulletDot} aria-hidden="true" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="faqs" className="flex flex-col gap-4">
          <SectionHeading
            title="Frequently asked questions"
            subtitle={`Straight answers to common questions about ${a.name} and ${b.name}.`}
          />
          <div className={dashedFrame}>
            {faqs.map((faq) => (
              <div key={faq.question} className={dashedFrameRow}>
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                  {faq.question}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section id="more-comparisons" className="flex flex-col gap-4">
            <SectionHeading
              title="More comparisons"
              subtitle={`Other head-to-head comparisons involving ${a.name} or ${b.name}.`}
            />
            <ComparisonLinkGrid comparisons={related} />
          </section>
        )}
      </div>
    </div>
  )
}
