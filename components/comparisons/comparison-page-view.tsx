import React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Bot,
  Zap,
  ShieldCheck,
  Scale,
  Compass,
  PlusCircle,
  Flame,
  Clock,
  Globe,
} from "lucide-react"
import type { PlatformComparison } from "@/types/comparison"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { getFaviconUrl } from "@/utils/urls"
import { GaAlternativeViewTracker } from "@/components/shared/ga-alternative-view-tracker"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { getAllComparisons } from "@/constants/comparisons"
import { AI_PROMPTS } from "@/lib/prompts"
import {
  breadcrumbSchema,
  faqSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import {
  comparisonPageContainer,
  comparisonHeroWrapper,
  comparisonCategoryPill,
  comparisonH1,
  comparisonLeadParagraph,
  comparisonTrustBar,
  comparisonSectionTitle,
  comparisonSectionSubtitle,
  comparisonTableCard,
  comparisonProfileGrid,
  comparisonProfileColumn,
  comparisonDeepDiveContainer,
  comparisonDeepDiveRow,
  comparisonScenarioGrid,
  comparisonScenarioColumn,
  comparisonStepNumber,
  comparisonCtaCard,
} from "@/utils/styles"

interface ComparisonPageViewProps {
  comparison: PlatformComparison
}

export const ComparisonPageView = ({
  comparison,
}: ComparisonPageViewProps) => {
  const currentYear = new Date().getFullYear()
  const otherComparisons = getAllComparisons().filter(
    (c) => c.slug !== comparison.slug
  )

  const breadcrumbsJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: comparison.name, url: comparison.canonicalUrl },
  ])

  const faqJsonLd = faqSchema(comparison.faqs)

  const competitorProfile = (comparison.comparedPlatformProfile ??
    comparison.productHuntProfile)!

  const webPageJsonLd = {
    "@type": "WebPage",
    "@id": `${comparison.canonicalUrl}#webpage`,
    url: comparison.canonicalUrl,
    name: comparison.metaTitle,
    description: comparison.metaDescription,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    about: [
      {
        "@type": "Organization",
        name: comparison.comparedPlatformName,
        url: competitorProfile.websiteUrl,
      },
      {
        "@type": "Organization",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
    ],
  }

  const unifiedJsonLd = buildEntityGraph([
    breadcrumbsJsonLd,
    faqJsonLd,
    webPageJsonLd,
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedJsonLd) }}
      />

      <GaAlternativeViewTracker
        alternativeSlug={comparison.slug}
        itemName={comparison.name}
        category={comparison.targetKeyword}
      />

      <div className="flex w-full flex-col bg-white">
        {/* Breadcrumb Strip */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-dashed border-border bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-500 sm:px-6 md:px-8"
        >
          <div className="mx-auto flex max-w-6xl items-center gap-2">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-1 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="size-3" />
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" aria-hidden="true" />
            <span className="font-semibold text-slate-900" aria-current="page">
              {comparison.name}
            </span>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className={comparisonPageContainer}>
          {/* Hero Section */}
          <header className={comparisonHeroWrapper}>
            <div className={comparisonCategoryPill}>
              <Scale className="size-3.5" />
              <span>{comparison.heroBadge}</span>
            </div>

            <h1 className={comparisonH1}>{comparison.heroTitle}</h1>

            <p className={comparisonLeadParagraph}>
              {comparison.heroDescription}
            </p>

            {/* Direct Action CTAs */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT} />}
                className="gap-2 text-xs font-semibold"
              >
                <PlusCircle className="size-4" />
                Submit Your Project — Free
              </Button>
              <Button
                variant="outline"
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.TOOLS} />}
                className="gap-2 text-xs font-semibold text-slate-700"
              >
                <Compass className="size-4 text-slate-500" />
                Explore Developer Tools
              </Button>
            </div>

            {/* Trust and Verification Bar */}
            <div className={comparisonTrustBar}>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Verified Research
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5 text-blue-600" />
                Updated {comparison.lastVerifiedDate}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Layers className="size-3.5 text-indigo-600" />
                No Sponsored Bias
              </span>
            </div>

            {/* Interactive Ask AI Assistant Bar */}
            <div className="mt-3 w-full max-w-xl">
              <AskAiBar
                prompt={`Compare ${comparison.comparedPlatformName} and LaunchNests for launching a developer tool or software product in ${currentYear}. What are the key differences?`}
                label="ASK AI ABOUT THIS COMPARISON"
                align="center"
              />
            </div>
          </header>

          {/* Quick Comparison Matrix Table */}
          <section id="comparison-matrix" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Comparison at a Glance: {comparison.comparedPlatformName} vs{" "}
                {SITE_CONFIG.name}
              </h2>
              <p className={comparisonSectionSubtitle}>
                A verifiable comparison across key operational, architectural,
                and discovery dimensions.
              </p>
            </div>

            <div className={comparisonTableCard}>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-dashed border-border bg-slate-50/80">
                    <TableHead className="w-1/4 px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Dimension
                    </TableHead>
                    <TableHead className="w-3/8 px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-amber-900 uppercase">
                      {comparison.comparedPlatformName}
                    </TableHead>
                    <TableHead className="w-3/8 px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-indigo-900 uppercase">
                      {SITE_CONFIG.name}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparison.quickComparisonDimensions.map((dim) => (
                    <TableRow
                      key={dim.key}
                      className="border-b border-dashed border-border transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className="px-4 py-4 align-top font-semibold text-slate-900">
                        <div className="flex flex-col gap-0.5">
                          <span>{dim.label}</span>
                          {dim.description && (
                            <span className="text-[11px] font-normal text-slate-500">
                              {dim.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 align-top text-xs leading-relaxed text-slate-600 sm:text-sm">
                        <span className="whitespace-normal">
                          {dim.competitorValue ?? dim.productHuntValue}
                        </span>
                      </TableCell>
                      <TableCell className="bg-indigo-50/20 px-4 py-4 align-top text-xs font-medium leading-relaxed text-slate-800 sm:text-sm">
                        <span className="whitespace-normal">
                          {dim.launchNestsValue}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Platform Profiles: About Competitor vs About LaunchNests */}
          <section id="platform-profiles" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>Platform Profiles</h2>
              <p className={comparisonSectionSubtitle}>
                Understanding the founding philosophy, primary use cases, and
                audience for both services.
              </p>
            </div>

            <div className={comparisonProfileGrid}>
              {/* Competitor Column */}
              <div className={comparisonProfileColumn}>
                <CornerBrackets />
                <div>
                  <div className="flex items-center justify-between border-b border-dashed border-border pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
                        <AvatarImage
                          src={getFaviconUrl(competitorProfile.websiteUrl) ?? ""}
                          alt={competitorProfile.name}
                          className="object-contain"
                        />
                        <AvatarFallback className="rounded-lg font-mono text-xs font-bold text-amber-800 bg-amber-50">
                          {comparison.comparedPlatformName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                          {competitorProfile.name}
                        </h3>
                        <p className="font-mono text-xs text-slate-500">
                          {competitorProfile.tagline}
                        </p>
                      </div>
                    </div>
                    <a
                      href={competitorProfile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
                    >
                      Visit
                      <ExternalLink className="size-3" />
                    </a>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {competitorProfile.primaryAudience}
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <span className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">
                      Documented Strengths
                    </span>
                    <ul className="flex flex-col gap-2 text-xs text-slate-600 sm:text-sm">
                      {competitorProfile.keyStrengths.map(
                        (str, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                            <span>{str}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <span className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">
                      Documented Limitations
                    </span>
                    <ul className="flex flex-col gap-2 text-xs text-slate-600 sm:text-sm">
                      {competitorProfile.keyLimitations.map(
                        (lim, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <XCircle className="mt-0.5 size-4 shrink-0 text-rose-500" />
                            <span>{lim}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* LaunchNests Column */}
              <div className={comparisonProfileColumn}>
                <CornerBrackets />
                <div>
                  <div className="flex items-center justify-between border-b border-dashed border-border pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
                        <AvatarImage
                          src={getFaviconUrl(SITE_CONFIG.url) ?? ""}
                          alt={SITE_CONFIG.name}
                          className="object-contain"
                        />
                        <AvatarFallback className="rounded-lg font-mono text-xs font-bold text-indigo-800 bg-indigo-50">
                          LN
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                            {comparison.launchNestsProfile.name}
                          </h3>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            DEVELOPER DIRECTORY
                          </Badge>
                        </div>
                        <p className="font-mono text-xs text-slate-500">
                          {comparison.launchNestsProfile.tagline}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={ROUTES.HOME}
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
                    >
                      Explore
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {comparison.launchNestsProfile.primaryAudience}
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <span className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">
                      Core Platform Capabilities
                    </span>
                    <ul className="flex flex-col gap-2 text-xs text-slate-700 sm:text-sm">
                      {comparison.launchNestsProfile.keyStrengths.map(
                        (str, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                            <span>{str}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <span className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">
                      Known Scope & Boundaries
                    </span>
                    <ul className="flex flex-col gap-2 text-xs text-slate-600 sm:text-sm">
                      {comparison.launchNestsProfile.keyLimitations.map(
                        (lim, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <XCircle className="mt-0.5 size-4 shrink-0 text-slate-400" />
                            <span>{lim}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed In-Depth Comparison Sections */}
          <section id="detailed-comparison" className="flex flex-col gap-6">
            <div>
              <h2 className={comparisonSectionTitle}>Detailed Breakdown</h2>
              <p className={comparisonSectionSubtitle}>
                A deep dive into the practical differences that impact founders,
                engineers, and early-stage products.
              </p>
            </div>

            <div className={comparisonDeepDiveContainer}>
              {comparison.deepDives.map((deep, idx) => (
                <div key={deep.id} className={comparisonDeepDiveRow}>
                  <CornerBrackets />

                  <div className="flex flex-col gap-1 border-b border-dashed border-border pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
                        Dimension 0{idx + 1}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-[11px] text-slate-500 uppercase">
                        {deep.subtitle}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                      {deep.title}
                    </h3>
                  </div>

                  {/* Inner 2-column comparative grid with corner brackets and dashed separation */}
                  <div className="relative grid grid-cols-1 divide-y divide-dashed divide-border border border-dashed border-border bg-white md:grid-cols-2 md:divide-y-0 md:divide-x">
                    {/* Competitor Approach */}
                    <div className="group/item relative flex flex-col gap-2.5 p-5 transition-colors hover:bg-amber-50/20 md:p-6">
                      <CornerBrackets />
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5 rounded-sm border border-slate-200 bg-white p-0.5">
                          <AvatarImage
                            src={getFaviconUrl(competitorProfile.websiteUrl) ?? ""}
                            alt={comparison.comparedPlatformName}
                            className="object-contain"
                          />
                          <AvatarFallback className="font-mono text-[9px] font-bold">
                            {comparison.comparedPlatformName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-mono text-xs font-bold tracking-wider text-amber-900 uppercase">
                          {comparison.comparedPlatformName} Approach
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                        {deep.competitorAngle ?? deep.productHuntAngle}
                      </p>
                    </div>

                    {/* LaunchNests Approach */}
                    <div className="group/item relative flex flex-col gap-2.5 p-5 transition-colors hover:bg-indigo-50/20 md:p-6">
                      <CornerBrackets />
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5 rounded-sm border border-slate-200 bg-white p-0.5">
                          <AvatarImage
                            src={getFaviconUrl(SITE_CONFIG.url) ?? ""}
                            alt={SITE_CONFIG.name}
                            className="object-contain"
                          />
                          <AvatarFallback className="font-mono text-[9px] font-bold">LN</AvatarFallback>
                        </Avatar>
                        <span className="font-mono text-xs font-bold tracking-wider text-indigo-900 uppercase">
                          LaunchNests Approach
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                        {deep.launchNestsAngle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-l-2 border-slate-900 bg-slate-50/80 px-4 py-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
                    <strong className="shrink-0 font-mono text-xs font-bold uppercase text-slate-900">
                      Practical Takeaway:
                    </strong>
                    <span>{deep.practicalTakeaway}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Who Should Choose Which Platform? (Scenarios) */}
          <section id="scenarios" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Which Platform Should You Choose?
              </h2>
              <p className={comparisonSectionSubtitle}>
                Evaluate realistic use cases based on product stage, audience,
                and growth objectives.
              </p>
            </div>

            <div className={comparisonScenarioGrid}>
              {comparison.scenarios.map((scenario) => (
                <div key={scenario.id} className={comparisonScenarioColumn}>
                  <CornerBrackets />
                  <div>
                    <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                        {scenario.title}
                      </h3>
                      <Badge
                        variant={
                          scenario.badgeVariant === "hot"
                            ? "destructive"
                            : "outline"
                        }
                        className="font-mono text-[10px] uppercase"
                      >
                        {scenario.badge}
                      </Badge>
                    </div>

                    <p className="mt-3 text-xs font-bold text-slate-900 sm:text-sm">
                      {scenario.recommendedFor}
                    </p>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {scenario.explanation}
                    </p>

                    <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-600 sm:text-sm">
                      {scenario.bulletPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-900" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Can You Use Both Platforms Together? */}
          <section
            id="use-both"
            className="flex flex-col gap-5 rounded-2xl border border-dashed border-border bg-slate-50/50 p-6 sm:p-8 md:p-10"
          >
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-indigo-600 uppercase">
                <Zap className="size-3.5" />
                <span>Complementary Distribution</span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {comparison.canYouUseBoth.heading}
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {comparison.canYouUseBoth.subheading}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
              {comparison.canYouUseBoth.description}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {comparison.canYouUseBoth.strategySteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex flex-col gap-2.5 rounded-xl border border-dashed border-border bg-white p-5 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={comparisonStepNumber}>
                      {step.stepNumber}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-500 uppercase">
                      {step.timing}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {step.action}
                  </p>
                  <div className="mt-auto border-t border-dashed border-slate-100 pt-2 text-[11px] text-slate-500">
                    <strong className="font-semibold text-slate-700">
                      Outcome:{" "}
                    </strong>
                    {step.outcome}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs font-medium text-slate-600 italic">
              {comparison.canYouUseBoth.summary}
            </p>
          </section>

          {/* Frequently Asked Questions */}
          <section id="faqs" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Frequently Asked Questions
              </h2>
              <p className={comparisonSectionSubtitle}>
                Straightforward answers to the most common questions about{" "}
                {comparison.comparedPlatformName} and {SITE_CONFIG.name}.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-dashed divide-border rounded-xl border border-dashed border-border bg-white shadow-2xs">
              {comparison.faqs.map((faq, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-5 sm:p-6">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="pl-6.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* More Launch Platform Comparisons */}
          {otherComparisons.length > 0 && (
            <section id="other-comparisons" className="flex flex-col gap-4">
              <div>
                <h2 className={comparisonSectionTitle}>
                  More Launch Platform Comparisons
                </h2>
                <p className={comparisonSectionSubtitle}>
                  Explore objective breakdowns of other popular directories,
                  launchpads, and developer discovery ecosystems.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {otherComparisons.map((other) => {
                  const otherProf =
                    other.comparedPlatformProfile ?? other.productHuntProfile
                  return (
                    <Link
                      key={other.slug}
                      href={other.routePath}
                      className="group relative flex flex-col justify-between rounded-xl border border-dashed border-border bg-white p-5 shadow-2xs transition-all hover:border-slate-400 hover:shadow-xs"
                    >
                      <CornerBrackets />
                      <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8 rounded-md border border-slate-200 bg-white p-0.5">
                            <AvatarImage
                              src={
                                getFaviconUrl(otherProf?.websiteUrl ?? "") ?? ""
                              }
                              alt={other.comparedPlatformName}
                              className="object-contain"
                            />
                            <AvatarFallback className="font-mono text-xs font-bold text-slate-700">
                              {other.comparedPlatformName
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                              {other.comparedPlatformName} vs {SITE_CONFIG.name}
                            </h3>
                            <p className="font-mono text-[11px] text-slate-500">
                              {other.name}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                      </div>
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                        {other.heroDescription}
                      </p>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Closing Call to Action */}
          <section className={comparisonCtaCard}>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-2xs">
              <Sparkles className="size-6" />
            </div>

            <div className="flex max-w-xl flex-col gap-2 text-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Ready to Showcase Your Developer Tool or Product?
              </h2>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                Get permanent directory indexing, map your technical stack, and
                make your software discoverable by human engineers and
                autonomous AI search agents.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT} />}
                className="text-xs font-semibold"
              >
                Submit Your Product — 100% Free
              </Button>
              <Button
                variant="outline"
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.PRODUCTS} />}
                className="text-xs font-semibold text-slate-700"
              >
                Browse Product Directory
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
