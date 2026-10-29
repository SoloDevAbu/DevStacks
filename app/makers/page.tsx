import type { Metadata } from "next"
import Link from "next/link"
import { Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { heroStatPill } from "@/utils/styles"
import {
  getMakersDirectory,
  getMakersCount,
  type MakerDirectoryItem,
} from "@/db/queries/users/get-profile"
import { CrawlablePagination } from "@/components/shared/crawlable-pagination"
import { countryCodeToFlag, formatLocation } from "@/utils/country"
import { cn } from "@/lib/utils"

export const revalidate = 60

export const generateMetadata = async (props: {
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> => {
  const searchParams = await props.searchParams
  const pageStr = searchParams?.page
  const parsedPage = pageStr ? parseInt(pageStr, 10) : 1
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1

  const title = `Developers & Makers Directory${currentPage > 1 ? ` (Page ${currentPage})` : ""}`
  const description = `Discover developers, software engineers, and indie makers building tools, APIs, and products on ${SITE_CONFIG.name}. Explore maker tech stacks and launches.`
  const canonicalUrl =
    currentPage > 1
      ? `${SITE_CONFIG.url}/makers?page=${currentPage}`
      : `${SITE_CONFIG.url}/makers`

  return {
    title,
    description,
    keywords: [
      "developer directory",
      "software makers",
      "indie developers",
      "creator profiles",
      "tool builders",
      SITE_CONFIG.name,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: [SITE_CONFIG.ogImageUrl],
    },
  }
}

interface MakersPageProps {
  searchParams: Promise<{ page?: string }>
}

const MakersPage = async ({ searchParams }: MakersPageProps) => {
  const resolvedParams = await searchParams
  const pageStr = resolvedParams?.page
  const parsedPage = pageStr ? parseInt(pageStr, 10) : 1
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1
  const pageSize = 48

  const [makers, totalCount] = await Promise.all([
    getMakersDirectory(pageSize, currentPage).catch(
      () => [] as MakerDirectoryItem[]
    ),
    getMakersCount().catch(() => 0),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Makers", url: `${SITE_CONFIG.url}/makers` },
    ...(currentPage > 1
      ? [
          {
            name: `Page ${currentPage}`,
            url: `${SITE_CONFIG.url}/makers?page=${currentPage}`,
          },
        ]
      : []),
  ])

  const collectionJsonLd = collectionPageSchema({
    name: "Developers & Makers Directory",
    description: `Developers, software engineers, and indie makers creating tools and products on ${SITE_CONFIG.name}.`,
    url:
      currentPage > 1
        ? `${SITE_CONFIG.url}/makers?page=${currentPage}`
        : `${SITE_CONFIG.url}/makers`,
    items: makers.map((maker) => ({
      name: maker.name || `@${maker.username}`,
      url: `${SITE_CONFIG.url}/makers/${maker.username}`,
      description:
        maker.bio || maker.description || `Maker on ${SITE_CONFIG.name}`,
    })),
  })

  const unifiedJsonLd = buildEntityGraph([breadcrumbs, collectionJsonLd])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedJsonLd) }}
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
              <span className="font-bold text-slate-900">{totalCount}</span>
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
          {currentPage > 1 ? (
            <>
              <Link
                href={ROUTES.MAKERS}
                className="transition-colors hover:text-slate-900"
              >
                Makers
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-900">
                Page {currentPage}
              </span>
            </>
          ) : (
            <span className="font-semibold text-slate-900">Makers</span>
          )}
        </div>

        {/* Full-Width Two-Column Dashed Makers Grid */}
        <main className="w-full flex-1">
          {makers.length === 0 ? (
            <div className="flex w-full items-center justify-center border-b border-dashed border-border bg-white px-6 py-16 text-center text-xs text-slate-500">
              No makers listed yet.
            </div>
          ) : (
            <nav
              aria-label="Developers & Makers Directory"
              className="grid w-full grid-cols-1 bg-white md:grid-cols-2"
            >
              {makers.map((maker, idx) => {
                const displayName = maker.name || `@${maker.username}`
                const flag = countryCodeToFlag(maker.country)
                const location = formatLocation(maker.country, maker.state)
                const profileUrl = ROUTES.MAKER(maker.username || "")
                const avatarSrc = maker.avatarUrl || maker.image
                const isOdd = idx % 2 === 1
                const totalCreations = maker.toolsCount + maker.productsCount

                return (
                  <Link
                    key={maker.id}
                    href={profileUrl}
                    className={cn(
                      "group flex items-center justify-between border-b border-dashed border-border px-6 py-4.5 transition-colors hover:bg-slate-50/80 md:px-8",
                      !isOdd && "md:border-r md:border-dashed md:border-border"
                    )}
                  >
                    {/* Left: Maker Image, Name, and tools/products count */}
                    <div className="flex min-w-0 items-center gap-3.5">
                      <Avatar className="size-10 shrink-0 border border-border/80">
                        {avatarSrc && (
                          <AvatarImage
                            src={avatarSrc}
                            alt={displayName}
                          />
                        )}
                        <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
                          {displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex min-w-0 flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
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
                        <div className="text-xs font-normal text-slate-500">
                          {maker.toolsCount} {maker.toolsCount === 1 ? "tool" : "tools"}, {maker.productsCount} {maker.productsCount === 1 ? "product" : "products"}
                        </div>
                      </div>
                    </div>

                    {/* Right: Total Count */}
                    <div className="shrink-0 pl-3">
                      <span className="font-mono text-xs text-slate-500">
                        <strong className="font-semibold text-slate-800">
                          {totalCreations}
                        </strong>{" "}
                        <span>total</span>
                      </span>
                    </div>
                  </Link>
                )
              })}

              {makers.length % 2 === 1 && (
                <div className="hidden border-b border-dashed border-border md:block" />
              )}
            </nav>
          )}
        </main>

        <CrawlablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={ROUTES.MAKERS}
        />
      </div>
    </>
  )
}

export default MakersPage
