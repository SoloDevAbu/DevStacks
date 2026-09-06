"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/shared/section-header"
import { BuildCard, type DbBuildItem } from "@/components/shared/build-card"
import { useBuilds } from "@/hooks/builds/use-builds"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"

export const DeveloperBuildsSection = () => {
  const { data, isLoading } = useBuilds({
    limit: HOMEPAGE_LIMITS.DEVELOPER_BUILDS,
  })
  const builds = (data ?? []) as DbBuildItem[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="See what developers are building"
        subtitle="Real products built with the tools developers love"
        viewAllText="View all builds"
        viewAllHref={ROUTES.BUILT_WITH}
      />
      <div className="-mt-px flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.DEVELOPER_BUILDS }).map(
            (_, i) => (
              <Card
                key={i}
                className={cn(
                  "h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50",
                  i > 0 && "-mt-px"
                )}
              />
            )
          )
        ) : builds.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
            No developer showcases available yet. Be the first to showcase your
            build!
          </div>
        ) : (
          builds.map((build, index) => (
            <BuildCard key={build.id} build={build} index={index} />
          ))
        )}
      </div>
    </section>
  )
}
