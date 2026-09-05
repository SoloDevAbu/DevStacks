"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { useRecentlyAdded } from "@/hooks/products/use-recently-added"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { discoveryCard } from "@/utils/styles"

type RecentItem = {
  id: string
  slug: string
  name: string
  desc: string
  category: string
  logo: string
  logoBg: string
  tier: "free" | "premium" | "premium+"
  createdAt?: string
}

export const RecentlyAddedContent = () => {
  const { data, isLoading } = useRecentlyAdded({ limit: 30 })

  const items: RecentItem[] = data
    ? data.map(
        (p: {
          id: string
          slug?: string
          name: string
          tagline: string
          category: string | null
          tier: string
          createdAt?: string
        }) => ({
          id: p.id,
          slug: p.slug ?? p.name.toLowerCase().replace(/\s+/g, "-"),
          name: p.name,
          desc: p.tagline,
          category: p.category ?? "Product",
          logo: p.name.slice(0, 1).toUpperCase(),
          logoBg: "bg-slate-900 text-white",
          tier: (p.tier as "free" | "premium" | "premium+") ?? "free",
          createdAt: p.createdAt,
        })
      )
    : []

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading recently added products...
        </p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        No recently added products available yet.
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.id} href={`/products/${item.slug}`} className="block">
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
        ))}
      </div>
    </div>
  )
}
