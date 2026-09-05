"use client"

import Link from "next/link"
import { Loader2, Sparkles, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useBuilds } from "@/hooks/builds/use-builds"
import { BuildCard, type DbBuildItem } from "@/components/shared/build-card"

export const BuiltWithList = ({
  showMedals = false,
  sortBy = "recent",
}: {
  showMedals?: boolean
  sortBy?: "recent" | "likes" | "views"
}) => {
  const { data, isLoading } = useBuilds({ sortBy, limit: 30 })
  const builds = (data ?? []) as DbBuildItem[]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading developer builds...
        </p>
      </div>
    )
  }

  if (builds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
          <Sparkles className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          No builds showcased yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Be the first to share what you built with developer tools and APIs!
        </p>
        <div className="mt-4">
          <Button render={<Link href={ROUTES.SHOWCASE} />}>
            <PlusCircle className="mr-1.5 size-4" />
            Showcase a Build
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-8">
      {builds.map((build, index) => (
        <BuildCard
          key={build.id}
          build={build}
          index={index}
          showMedals={showMedals}
        />
      ))}
    </div>
  )
}
