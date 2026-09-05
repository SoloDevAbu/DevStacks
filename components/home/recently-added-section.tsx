"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { useRecentlyAdded } from "@/hooks/products/use-recently-added"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { sectionGridWrapper, discoveryCard } from "@/utils/styles"

type RecentItem = {
  id: string
  slug: string
  name: string
  desc: string
  category: string
  logo: string
  logoBg: string
  tier: "free" | "premium" | "premium+"
}

export const RecentlyAddedSection = () => {
  const { data, isLoading } = useRecentlyAdded({
    limit: HOMEPAGE_LIMITS.RECENTLY_ADDED,
  })

  const items: RecentItem[] = data
    ? data.map(
        (p: {
          id: string
          slug?: string
          name: string
          tagline: string
          category: string | null
          tier: string
        }) => ({
          id: p.id,
          slug: p.slug ?? p.name.toLowerCase().replace(/\s+/g, "-"),
          name: p.name,
          desc: p.tagline,
          category: p.category ?? "Product",
          logo: p.name.slice(0, 1).toUpperCase(),
          logoBg: "bg-slate-900 text-white",
          tier: (p.tier as "free" | "premium" | "premium+") ?? "free",
        })
      )
    : []

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Recently Added"
        subtitle="Latest products and tools added by the community"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER_RECENTLY_ADDED}
      />
      <div
        className={cn(
          sectionGridWrapper,
          "sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"
        )}
      >
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.RECENTLY_ADDED }).map((_, i) => (
            <Card
              key={i}
              className="h-20 animate-pulse rounded-none border border-slate-200 bg-slate-50/50"
            />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full py-8 text-center text-sm text-slate-400">
            No recently added products yet.
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="block"
            >
              <Card className={discoveryCard}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                      item.logoBg
                    )}
                  >
                    {item.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                        {item.name}
                      </h3>
                      <VerifiedBadge tier={item.tier} />
                    </div>
                    <p className="truncate text-xs font-medium text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                  <div className="shrink-0 rounded bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
                    {item.category}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}
