import type { Metadata } from "next"
import Link from "next/link"
import { Users, Wrench, Package, ArrowUpRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { heroStatPill } from "@/utils/styles"
import {
  getMakersDirectory,
  type MakerDirectoryItem,
} from "@/db/queries/users/get-profile"
import { countryCodeToFlag, formatLocation } from "@/utils/country"

export const revalidate = 60

export const metadata: Metadata = {
  title: `Developers & Makers Directory — ${SITE_CONFIG.name}`,
  description: `Discover developers, software engineers, and indie makers building tools, APIs, and products on ${SITE_CONFIG.name}. Explore maker tech stacks and launches.`,
  keywords: [
    "developer directory",
    "software makers",
    "indie developers",
    "creator profiles",
    "tool builders",
    SITE_CONFIG.name,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/makers`,
  },
  openGraph: {
    title: `Developers & Makers Directory | ${SITE_CONFIG.name}`,
    description: `Discover developers, software engineers, and indie makers building tools, APIs, and products on ${SITE_CONFIG.name}.`,
    type: "website",
    url: `${SITE_CONFIG.url}/makers`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Developers & Makers Directory | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Developers & Makers Directory | ${SITE_CONFIG.name}`,
    description: `Discover developers, software engineers, and indie makers building tools, APIs, and products on ${SITE_CONFIG.name}.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const MakersPage = async () => {
  const makers = await getMakersDirectory(120).catch(
    () => [] as MakerDirectoryItem[]
  )

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Makers", url: `${SITE_CONFIG.url}/makers` },
  ])

  const collectionJsonLd = collectionPageSchema({
    name: "Developers & Makers Directory",
    description: `Developers, software engineers, and indie makers creating tools and products on ${SITE_CONFIG.name}.`,
    url: `${SITE_CONFIG.url}/makers`,
    items: makers.map((maker) => ({
      name: maker.name || `@${maker.username}`,
      url: `${SITE_CONFIG.url}/makers/${maker.username}`,
      description:
        maker.bio || maker.description || `Maker on ${SITE_CONFIG.name}`,
    })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading="Developers & Makers"
          description={`Explore the creators, engineers, and indie makers building developer tools, software products, and open-source infrastructure on ${SITE_CONFIG.name}.`}
          aiPrompt={AI_PROMPTS.makers}
          variant="makers"
          metrics={
            <div className={heroStatPill}>
              <Users className="size-3.5 text-indigo-600" />
              <span className="font-bold text-slate-900">{makers.length}</span>
              <span className="text-slate-500">Makers Listed</span>
            </div>
          }
        />

        {/* Breadcrumb strip */}
        <div className="flex items-center gap-2 border-b border-dashed border-border bg-slate-50/40 px-6 py-2.5 text-xs text-slate-500 md:px-8">
          <Link
            href={ROUTES.HOME}
            className="transition-colors hover:text-slate-900"
          >
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">Makers</span>
        </div>

        {/* Directory Grid */}
        <div className="p-6 md:p-8">
          {makers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
              <Users className="mx-auto size-10 text-slate-400" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                No makers found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Be the first maker to publish your developer profile and tools.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {makers.map((maker) => {
                const displayName = maker.name || `@${maker.username}`
                const flag = countryCodeToFlag(maker.country)
                const location = formatLocation(maker.country, maker.state)
                const profileUrl = ROUTES.MAKER(maker.username || "")

                return (
                  <Link
                    key={maker.id}
                    href={profileUrl}
                    className="group block focus-visible:outline-none"
                  >
                    <Card className="h-full border border-dashed border-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                      <CardContent className="flex h-full flex-col justify-between p-5">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <Avatar className="size-11 shrink-0 border border-border/80">
                                {maker.avatarUrl && (
                                  <AvatarImage
                                    src={maker.avatarUrl}
                                    alt={displayName}
                                  />
                                )}
                                <AvatarFallback className="bg-slate-900 text-xs font-bold text-white">
                                  {displayName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                                    {displayName}
                                  </span>
                                  {flag && (
                                    <span
                                      className="shrink-0 text-xs select-none"
                                      title={location}
                                    >
                                      {flag}
                                    </span>
                                  )}
                                </div>
                                <p className="truncate text-xs text-slate-500">
                                  @{maker.username}
                                </p>
                              </div>
                            </div>

                            <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-600" />
                          </div>

                          {(maker.bio || maker.description) && (
                            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                              {maker.bio || maker.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-dashed border-border/70 pt-3 text-[11px] text-slate-500">
                          <div className="flex items-center gap-3">
                            {maker.toolsCount > 0 && (
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <Wrench className="size-3 text-indigo-500" />
                                {maker.toolsCount}{" "}
                                {maker.toolsCount === 1 ? "tool" : "tools"}
                              </span>
                            )}
                            {maker.productsCount > 0 && (
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <Package className="size-3 text-emerald-500" />
                                {maker.productsCount}{" "}
                                {maker.productsCount === 1
                                  ? "product"
                                  : "products"}
                              </span>
                            )}
                            {maker.toolsCount === 0 &&
                              maker.productsCount === 0 && (
                                <Badge
                                  variant="secondary"
                                  className="h-5 px-1.5 text-[10px] font-normal"
                                >
                                  Maker
                                </Badge>
                              )}
                          </div>

                          {location && (
                            <span className="max-w-30 truncate text-slate-400">
                              {location}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MakersPage
