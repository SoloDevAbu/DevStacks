"use client"

import Link from "next/link"
import { PackageSearch, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { ToolCard } from "@/components/shared/tool-card"
import type { DbTool } from "@/types/entities"

export type { DbTool }

export const ToolList = ({
  tools,
  showMedals = false,
  showTrendingBadge = true,
}: {
  tools: DbTool[]
  showMedals?: boolean
  showTrendingBadge?: boolean
}) => {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
          <PackageSearch className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          No tools found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No developer tools found in this directory. List yours to be
          discovered by thousands of builders!
        </p>
        <div className="mt-4">
          <Button nativeButton={false} render={<Link href={ROUTES.SUBMIT} />}>
            <PlusCircle className="mr-1.5 size-4" />
            Submit a Tool
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {tools.map((tool, index) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          index={index}
          showMedals={showMedals}
          showTrendingBadge={showTrendingBadge}
        />
      ))}
    </div>
  )
}
