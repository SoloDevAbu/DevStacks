import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Globe,
  Calendar,
  Layers,
  Sparkles,
  Wrench,
  Package,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToolCard } from "@/components/shared/tool-card"
import { ProductCard } from "@/components/shared/product-card"
import { XIcon, LinkedInIcon, GithubIcon } from "@/components/shared/icons"
import { HoverOutline } from "@/components/shared/hover-outline"
import { getMakerProfile } from "@/db/queries/users/get-profile"
import { countryCodeToFlag, formatLocation } from "@/utils/country"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { AI_PROMPTS } from "@/lib/prompts"
import { footerAiButton } from "@/utils/styles"
import {
  profilePageSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/schema"

interface MakerPageProps {
  params: Promise<{ username: string }>
}

export const generateMetadata = async ({
  params,
}: MakerPageProps): Promise<Metadata> => {
  const { username } = await params
  const maker = await getMakerProfile(username)

  if (!maker) {
    return {
      title: "Maker Not Found — DevStacks",
    }
  }

  const displayName = maker.name || `@${maker.username}`
  const flag = countryCodeToFlag(maker.country)
  const locationText = formatLocation(maker.country, maker.state)
  const title = `${displayName} ${flag} — Maker & Developer on ${SITE_CONFIG.name}`
  const description =
    maker.bio ||
    maker.description?.slice(0, 160) ||
    `Explore developer tools and applications built by ${displayName} on ${SITE_CONFIG.name}.`

  const profileUrl = `${SITE_CONFIG.url}/makers/${maker.username}`

  return {
    title,
    description,
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: profileUrl,
      images: [
        {
          url: maker.avatarUrl || `${SITE_CONFIG.url}/opengraph-image`,
          width: 800,
          height: 800,
          alt: displayName,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [maker.avatarUrl || `${SITE_CONFIG.url}/twitter-image`],
    },
  }
}

export default async function MakerPage({ params }: MakerPageProps) {
  const { username } = await params
  const maker = await getMakerProfile(username)

  if (!maker) {
    notFound()
  }

  const displayName = maker.name || `@${maker.username}`
  const flag = countryCodeToFlag(maker.country)
  const locationText = formatLocation(maker.country, maker.state)
  const siteUrl = SITE_CONFIG.url
  const profileUrl = `${siteUrl}/makers/${maker.username}`

  const joinedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(maker.createdAt))

  const aiPrompt = AI_PROMPTS.maker(displayName, maker.username, maker.bio)

  const socials: string[] = []
  if (maker.websiteUrl) socials.push(maker.websiteUrl)
  if (maker.githubUrl) socials.push(maker.githubUrl)
  if (maker.twitterUrl) socials.push(maker.twitterUrl)
  if (maker.linkedinUrl) socials.push(maker.linkedinUrl)

  const profileJsonLd = profilePageSchema({
    name: `${displayName}'s Developer Profile`,
    url: profileUrl,
    person: {
      name: displayName,
      username: maker.username,
      url: profileUrl,
      image: maker.avatarUrl,
      description: maker.bio || maker.description,
      country: maker.country,
      sameAs: socials,
    },
  })

  const breadcrumbsJsonLd = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Makers", url: `${siteUrl}/makers` },
    { name: displayName, url: profileUrl },
  ])

  const faqJsonLd =
    maker.faqs.length > 0
      ? faqSchema(
          maker.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          }))
        )
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="flex min-h-screen flex-col">
        {/* Breadcrumb strip */}
        <div className="flex items-center gap-2 border-b border-dashed border-border bg-slate-50/40 px-6 py-2.5 text-xs text-slate-500 md:px-8">
          <Link
            href={ROUTES.HOME}
            className="transition-colors hover:text-slate-900"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-400">Makers</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">
            @{maker.username}
          </span>
        </div>

        {/* Hero Section */}
        <div className="border-b border-dashed border-border bg-linear-to-b from-slate-50/70 via-white to-white px-6 py-8 md:px-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-20 border-2 border-border shadow-xs sm:size-24">
                {maker.avatarUrl && (
                  <AvatarImage src={maker.avatarUrl} alt={displayName} />
                )}
                <AvatarFallback className="bg-slate-900 text-xl font-bold text-white">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                    {displayName}
                  </h1>
                  {flag && (
                    <span className="text-2xl select-none" title={locationText}>
                      {flag}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                  <span className="font-mono text-slate-400">
                    @{maker.username}
                  </span>
                  {locationText && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-slate-600">
                        {locationText}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="size-3" />
                    Joined {joinedDate}
                  </span>
                </div>

                {maker.bio && (
                  <p className="mt-1 max-w-2xl text-sm font-medium text-slate-700">
                    {maker.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="flex items-center gap-2 sm:self-start">
              <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-white px-4 py-2 text-center">
                <span className="font-mono text-lg font-bold text-slate-900">
                  {maker.toolsCount}
                </span>
                <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Tools
                </span>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-white px-4 py-2 text-center">
                <span className="font-mono text-lg font-bold text-slate-900">
                  {maker.productsCount}
                </span>
                <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Products
                </span>
              </div>
            </div>
          </div>

          {/* Sub-tray: Left = Icon-only socials, Right = Ask AI about Maker */}
          <div className="-mx-6 mt-8 -mb-8 flex flex-col gap-4 border-t border-dashed border-border bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:-mx-8 md:-mb-12 md:px-8">
            {/* Left: Icon-only social links */}
            <div className="flex items-center gap-2">
              {maker.websiteUrl && (
                <a
                  href={maker.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50"
                  title="Personal Website / Portfolio"
                  aria-label="Website"
                >
                  <Image
                    src="/social-logo/world-wide-web.png"
                    alt="Website"
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                </a>
              )}
              {maker.githubUrl && (
                <a
                  href={maker.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50"
                  title="GitHub Profile"
                  aria-label="GitHub"
                >
                  <Image
                    src="/social-logo/github.png"
                    alt="GitHub"
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                </a>
              )}
              {maker.twitterUrl && (
                <a
                  href={maker.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50"
                  title="Twitter / X Profile"
                  aria-label="Twitter / X"
                >
                  <Image
                    src="/social-logo/twitter.png"
                    alt="X (Twitter)"
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                </a>
              )}
              {maker.linkedinUrl && (
                <a
                  href={maker.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn"
                >
                  <Image
                    src="/social-logo/linkedin.png"
                    alt="LinkedIn"
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                </a>
              )}
              {!maker.websiteUrl &&
                !maker.githubUrl &&
                !maker.twitterUrl &&
                !maker.linkedinUrl && (
                  <span className="text-xs font-medium text-slate-400">
                    No social links provided
                  </span>
                )}
            </div>

            {/* Right: Ask AI about Maker */}
            <div className="flex flex-col gap-2 sm:items-end">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                  ASK AI ABOUT {displayName.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {AI_PROVIDERS.map((ai) => (
                  <div key={ai.id} className="group/btn relative inline-flex">
                    <a
                      href={`${ai.url}${encodeURIComponent(aiPrompt)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerAiButton}
                      title={`Ask ${ai.name} about ${displayName}`}
                    >
                      <Image
                        src={ai.icon}
                        alt={ai.name}
                        width={14}
                        height={14}
                        className="object-contain mix-blend-multiply"
                      />
                      <span className="text-xs font-medium text-slate-700 transition-colors group-hover/btn:text-slate-950">
                        {ai.name}
                      </span>
                    </a>
                    <HoverOutline />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description / About */}
        {maker.description && (
          <section className="border-b border-dashed border-border px-6 py-8 md:px-8">
            <h2 className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
              About the Maker
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
              {maker.description}
            </p>
          </section>
        )}

        {/* Maker FAQs Section */}
        {maker.faqs.length > 0 && (
          <section className="border-b border-dashed border-border px-6 py-8 md:px-8">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500">
                Direct answers from {displayName} regarding their stack,
                process, and tools.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-dashed divide-border border border-dashed border-border bg-white">
              {maker.faqs.map((faq, idx) => (
                <div
                  key={faq.id || idx}
                  className="flex flex-col gap-1.5 p-4 md:p-5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="pt-0.5 font-mono text-xs font-bold text-slate-400 select-none">
                      Q{idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="pl-6 text-xs leading-relaxed whitespace-pre-wrap text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Submitted Tools Section */}
        <section className="border-b border-dashed border-border px-6 py-8 md:px-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Wrench className="size-4 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Submitted Developer Tools
                </h2>
                <Badge variant="secondary" className="text-[11px]">
                  {maker.toolsCount}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Infrastructure, libraries, and dev tools listed by {displayName}
                .
              </p>
            </div>
          </div>

          {maker.tools.length > 0 ? (
            <div className="flex flex-col divide-y divide-dashed divide-border border border-dashed border-border bg-white">
              {maker.tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/40 py-10 text-center">
              <p className="text-xs text-slate-500">
                No developer tools submitted yet.
              </p>
            </div>
          )}
        </section>

        {/* Submitted Products Section */}
        <section className="px-6 py-8 md:px-8 md:py-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package className="size-4 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Built Products & Projects
                </h2>
                <Badge variant="secondary" className="text-[11px]">
                  {maker.productsCount}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Live web applications, software, and platforms created by{" "}
                {displayName}.
              </p>
            </div>
          </div>

          {maker.products.length > 0 ? (
            <div className="flex flex-col divide-y divide-dashed divide-border border border-dashed border-border bg-white">
              {maker.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/40 py-10 text-center">
              <p className="text-xs text-slate-500">
                No products submitted yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
