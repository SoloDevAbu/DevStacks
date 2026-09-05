"use client"

import Link from "next/link"
import { Eye, Heart, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { useBuilds } from "@/hooks/builds/use-builds"
import { ROUTES } from "@/constants/routes"
import { sectionGridWrapper } from "@/utils/styles"

type BuildItem = {
  id: string
  name: string
  description: string
  logoText: string
  logoBg: string
  tier: "free" | "premium" | "premium+"
  viewsCount: number
  likesCount: number
  builtWith: { name: string; slug?: string }[]
}

export const DeveloperBuildsSection = () => {
  const { data, isLoading } = useBuilds({ limit: 4 })
  const builds: BuildItem[] = (data ?? []) as BuildItem[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="See what developers are building"
        subtitle="Real products built with the tools developers love"
        viewAllText="View all builds"
        viewAllHref={ROUTES.SHOWCASE}
      />
      <div
        className={cn(
          sectionGridWrapper,
          "md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"
        )}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="h-44 animate-pulse rounded-none border border-slate-200 bg-slate-50/50"
            />
          ))
        ) : builds.length === 0 ? (
          <div className="col-span-full py-8 text-center text-sm text-slate-400">
            No developer showcases available yet. Be the first to showcase your
            build!
          </div>
        ) : (
          builds.map((build) => (
            <Card
              key={build.id}
              className="group flex flex-col rounded-none bg-white transition-colors hover:border-slate-300"
            >
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                      build.logoBg || "bg-slate-900 text-white"
                    )}
                  >
                    {build.logoText}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <h3 className="truncate font-bold text-slate-900">
                      {build.name}
                    </h3>
                    <VerifiedBadge
                      tier={build.tier as "free" | "premium" | "premium+"}
                    />
                  </div>
                </div>
                <p className="line-clamp-2 text-sm font-medium text-slate-500">
                  {build.description}
                </p>
                <div className="mt-auto pt-2">
                  <p className="mb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                    Built with
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {build.builtWith?.map(
                      (tool: { name: string; slug?: string }) => {
                        const toolSlug =
                          tool.slug ||
                          tool.name.toLowerCase().replace(/\s+/g, "-")
                        return (
                          <Link
                            key={tool.name}
                            href={`/products/${toolSlug}`}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                          >
                            {tool.name}
                          </Link>
                        )
                      }
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-slate-400">
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3.5" /> {build.viewsCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="size-3.5" /> {build.likesCount ?? 0}
                    </span>
                  </div>
                  <Link
                    href={ROUTES.SHOWCASE}
                    aria-label={`View ${build.name} build details`}
                  >
                    <ExternalLink className="size-3.5 hover:text-slate-600" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  )
}
