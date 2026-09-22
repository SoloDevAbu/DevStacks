"use client"

import Link from "next/link"
import { PackageSearch, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty"
import { ROUTES } from "@/constants/routes"
import { ToolCard } from "@/components/shared/tool-card"
import type { DbTool } from "@/types/entities"

export type { DbTool }

export const ToolList = ({
  tools,
  showMedals = false,
  showTrendingBadge = false,
}: {
  tools: DbTool[]
  showMedals?: boolean
  showTrendingBadge?: boolean
}) => {
  if (tools.length === 0) {
    return (
      <Empty className="py-12">
        <EmptyMedia variant="icon">
          <PackageSearch className="size-5" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No tools found</EmptyTitle>
          <EmptyDescription>
            No developer tools found in this directory. List yours to be
            discovered by thousands of builders!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href={ROUTES.SUBMIT} />}>
            <PlusCircle className="mr-1.5 size-4" />
            Submit a Tool
          </Button>
        </EmptyContent>
      </Empty>
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
