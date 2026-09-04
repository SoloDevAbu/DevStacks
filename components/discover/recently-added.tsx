"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { useRecentlyAdded } from "@/hooks/products/use-recently-added"
import { RECENTLY_ADDED } from "@/constants/products"
import { ROUTES } from "@/constants/routes"

type RecentItem = {
  name: string
  desc: string
  category: string
  logo: string
  logoBg: string
  tier: "free" | "premium" | "premium+"
}

export const RecentlyAdded = () => {
  const { data } = useRecentlyAdded(6)

  const items = data
    ? data.map((p: { id: string; name: string; tagline: string; category: string | null; tier: string }) => ({
        id: p.id,
        name: p.name,
        desc: p.tagline,
        category: p.category ?? "Product",
        logo: p.name.slice(0, 1).toUpperCase(),
        logoBg: "bg-slate-900 text-white",
        tier: p.tier as "free" | "premium" | "premium+",
      }))
    : RECENTLY_ADDED

  return (
    <section>
      <SectionHeader
        title="Recently added"
        subtitle="Fresh tools and products added by the community"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {(items as RecentItem[]).map((item) => {
          const slug = item.name.toLowerCase().replace(/\s+/g, "-")
          return (
            <Link key={item.name} href={`/products/${slug}`} className="block">
              <Card className="group cursor-pointer rounded-none bg-white transition-colors hover:border-slate-300">
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
                      <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
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
          )
        })}
      </div>
    </section>
  )
}
