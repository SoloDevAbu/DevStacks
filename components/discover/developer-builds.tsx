"use client"

import Link from "next/link"
import { Eye, Heart, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { useBuilds } from "@/hooks/builds/use-builds"
import { DEVELOPER_BUILDS } from "@/constants/products"
import { ROUTES } from "@/constants/routes"

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

export const DeveloperBuilds = () => {
  const { data } = useBuilds({ limit: 4 })

  const builds = data ?? DEVELOPER_BUILDS.map((b) => ({
    id: b.name,
    name: b.name,
    description: b.desc,
    logoText: b.logo,
    logoBg: b.logoBg,
    tier: b.tier,
    viewsCount: b.views,
    likesCount: b.likes,
    builtWith: b.builtWith.map((name: string) => ({ name, slug: "" })),
  }))

  return (
    <section>
      <SectionHeader
        title="See what developers are building"
        subtitle="Real products built with the tools developers love"
        viewAllText="View all builds"
        viewAllHref={ROUTES.SHOWCASE}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {(builds as BuildItem[]).map((build) => (
          <Card
            key={build.id}
            className="group flex flex-col rounded-none bg-white transition-colors hover:border-slate-300"
          >
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                    build.logoBg
                  )}
                >
                  {build.logoText}
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <h3 className="truncate font-bold text-slate-900">
                    {build.name}
                  </h3>
                  <VerifiedBadge tier={build.tier as "free" | "premium" | "premium+"} />
                </div>
              </div>
              <p className="line-clamp-2 text-sm font-medium text-slate-500">
                {build.description}
              </p>
              <div className="mt-auto pt-2">
                <p className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Built with
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {build.builtWith.map((tool: { name: string }) => {
                    const toolSlug = tool.name.toLowerCase().replace(/\s+/g, "-")
                    return (
                      <Link
                        key={tool.name}
                        href={`/products/${toolSlug}`}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                      >
                        {tool.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-slate-400">
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" /> {build.viewsCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5" /> {build.likesCount}
                  </span>
                </div>
                <Link href={ROUTES.SHOWCASE} aria-label={`View ${build.name} build details`}>
                  <ExternalLink className="size-3.5 hover:text-slate-600" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
