"use client"

import { ToolList, type DbTool } from "@/components/shared/product-list"
import { useTools } from "@/hooks/tools/use-tools"
import { Loader2 } from "lucide-react"

export const ToolsDirectoryContent = ({
  initialCategory,
  initialQuery,
}: {
  initialCategory?: string
  initialQuery?: string
}) => {
  const { data, isLoading } = useTools({
    category: initialCategory,
    q: initialQuery,
    limit: 30,
  })

  const tools = (data ?? []) as DbTool[]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading directory tools...
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col pt-2 pb-8">
      <ToolList
        tools={tools}
        showMedals={false}
        showTrendingBadge={false}
      />
    </div>
  )
}
