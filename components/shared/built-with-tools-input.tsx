"use client"

import { useState, useRef, useEffect } from "react"
import { useTools } from "@/hooks/tools/use-tools"
import { useDebounce } from "@/hooks/shared/use-debounce"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { HoverOutline } from "@/components/shared/hover-outline"
import { Wrench, Link2, Plus, X, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DbTool } from "@/types/entities"

export interface BuiltWithToolItem {
  name: string
  toolSlug?: string
  toolId?: string
}

interface BuiltWithToolsInputProps {
  value: BuiltWithToolItem[]
  onChange: (tools: BuiltWithToolItem[]) => void
  placeholder?: string
  label?: string
  description?: string
}

export const BuiltWithToolsInput = ({
  value = [],
  onChange,
  placeholder = "Search DevStacks tools to link, or type custom tool name...",
  label = "Built With Tools & Tech Stack",
  description = "Link tools from DevStacks to cross-feature your product on tool pages, or add unlinked custom technologies.",
}: BuiltWithToolsInputProps) => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query.trim(), 250)
  const hasSearchQuery = debouncedQuery.length > 0

  const { data: searchResults = [], isFetching: isSearching } = useTools(
    { q: debouncedQuery, limit: 15 },
    { enabled: hasSearchQuery }
  )

  const { data: popularToolsData = [] } = useTools(
    { sortBy: "builds", limit: 8 },
    { enabled: !hasSearchQuery }
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const trimmedQuery = query.trim()
  const lowerQuery = trimmedQuery.toLowerCase()
  const isDebouncingOrSearching =
    hasSearchQuery && (query.trim() !== debouncedQuery || isSearching)

  const matchingTools = (hasSearchQuery ? (searchResults as DbTool[]) : [])
    .slice()
    .sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      if (aName === lowerQuery && bName !== lowerQuery) return -1
      if (bName === lowerQuery && aName !== lowerQuery) return 1
      if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery))
        return -1
      if (bName.startsWith(lowerQuery) && !aName.startsWith(lowerQuery))
        return 1
      return 0
    })

  const isAlreadySelected = value.some(
    (item) => item.name.toLowerCase() === lowerQuery
  )

  const exactDevStacksMatch = matchingTools.find(
    (tool: DbTool) => tool.name.toLowerCase() === lowerQuery
  )

  const addLinkedTool = (
    tool: { id: string; name: string; slug: string } | DbTool
  ) => {
    if (
      value.some((item) => item.name.toLowerCase() === tool.name.toLowerCase())
    ) {
      setQuery("")
      setIsOpen(false)
      return
    }

    onChange([
      ...value,
      {
        name: tool.name,
        toolSlug: tool.slug,
        toolId: tool.id,
      },
    ])
    setQuery("")
    setIsOpen(false)
  }

  const addUnlinkedTool = (name: string) => {
    const cleanName = name.trim()
    if (!cleanName) return

    const matched =
      matchingTools.find(
        (t) => t.name.toLowerCase() === cleanName.toLowerCase()
      ) ??
      (popularToolsData as DbTool[]).find(
        (t) => t.name.toLowerCase() === cleanName.toLowerCase()
      )

    if (matched) {
      addLinkedTool(matched)
      return
    }

    if (
      value.some((item) => item.name.toLowerCase() === cleanName.toLowerCase())
    ) {
      setQuery("")
      setIsOpen(false)
      return
    }

    onChange([...value, { name: cleanName }])
    setQuery("")
    setIsOpen(false)
  }

  const removeTool = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (exactDevStacksMatch) {
        addLinkedTool(exactDevStacksMatch)
      } else if (matchingTools.length > 0 && trimmedQuery) {
        addLinkedTool(matchingTools[0])
      } else if (trimmedQuery) {
        addUnlinkedTool(trimmedQuery)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const popularTools: DbTool[] = (popularToolsData as DbTool[]).slice(0, 8)

  return (
    <div className="flex flex-col gap-3" ref={containerRef}>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-800">{label}</label>
        {description && (
          <p className="text-[11px] text-slate-400">{description}</p>
        )}
      </div>

      {/* Selected Tools Pills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, idx) => {
            const isLinked = Boolean(item.toolSlug || item.toolId)
            return (
              <div
                key={`${item.name}-${idx}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  isLinked
                    ? "border border-indigo-200/80 bg-indigo-50/80 text-indigo-900 shadow-2xs"
                    : "border border-slate-200 bg-slate-100 text-slate-700"
                )}
              >
                {isLinked ? (
                  <Link2 className="size-3 shrink-0 text-indigo-600" />
                ) : (
                  <Wrench className="size-3 shrink-0 text-slate-400" />
                )}
                <span>{item.name}</span>
                <span
                  className={cn(
                    "py-0.2 rounded px-1 font-mono text-[10px]",
                    isLinked
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-200/80 text-slate-600"
                  )}
                >
                  {isLinked ? "Linked" : "Unlinked"}
                </span>
                <button
                  type="button"
                  onClick={() => removeTool(idx)}
                  className="ml-0.5 inline-flex size-4 items-center justify-center rounded-sm text-slate-400 hover:bg-slate-200/50 hover:text-red-600"
                  title="Remove tool"
                >
                  <X className="size-3" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Input Field with Dropdown */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pr-24 pl-9 text-xs"
          />
          {trimmedQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addUnlinkedTool(trimmedQuery)}
              className="absolute top-1 right-1 h-7 px-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="mr-1 size-3" />
              Add
            </Button>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            {trimmedQuery ? (
              <div className="flex flex-col gap-1">
                {isDebouncingOrSearching && (
                  <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-slate-500">
                    <Spinner className="size-3.5 text-indigo-600" />
                    <span>Searching DevStacks tools...</span>
                  </div>
                )}

                {/* Matching DevStacks Tools */}
                {matchingTools.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="px-2 py-1 font-mono text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                      DevStacks Tools (Linked)
                    </div>
                    {matchingTools.slice(0, 6).map((tool: DbTool) => {
                      const selected = value.some(
                        (i) => i.name.toLowerCase() === tool.name.toLowerCase()
                      )
                      return (
                        <div
                          key={tool.id}
                          className="group/btn relative flex w-full"
                        >
                          <button
                            type="button"
                            disabled={selected}
                            onClick={() => addLinkedTool(tool)}
                            className={cn(
                              "relative z-10 flex w-full items-center justify-between rounded-md border border-transparent px-2.5 py-1.5 text-left text-xs transition-colors",
                              selected
                                ? "cursor-not-allowed bg-slate-50 opacity-50"
                                : "cursor-pointer hover:border-slate-200/80 hover:bg-indigo-50/70 hover:text-indigo-900"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Link2 className="size-3.5 shrink-0 text-indigo-600" />
                              <span className="font-semibold text-slate-900">
                                {tool.name}
                              </span>
                              {tool.tagline && (
                                <span className="max-w-xs truncate text-[11px] text-slate-400">
                                  — {tool.tagline}
                                </span>
                              )}
                            </div>
                            {selected ? (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                                <Check className="size-3" /> Added
                              </span>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-indigo-200 bg-indigo-50 text-[10px] font-normal text-indigo-700"
                              >
                                Link to tool
                              </Badge>
                            )}
                          </button>
                          {!selected && <HoverOutline className="-inset-0.5" />}
                        </div>
                      )
                    })}
                  </div>
                )}

                {!isDebouncingOrSearching && matchingTools.length === 0 && (
                  <div className="px-2.5 py-2 text-xs text-slate-400">
                    No matching DevStacks tool found for &quot;{trimmedQuery}
                    &quot;.
                  </div>
                )}

                {/* Option to Add as Unlinked Custom Tool */}
                {!isAlreadySelected && (
                  <div className="mt-1 border-t border-dashed border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => addUnlinkedTool(trimmedQuery)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <Plus className="size-3.5 text-slate-500" />
                      <span>
                        Add &quot;<strong>{trimmedQuery}</strong>&quot; as
                        unlinked custom tool
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Popular DevStacks Tools
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Click to link
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5 p-1.5">
                  {popularTools.map((tool: DbTool) => {
                    const selected = value.some(
                      (i) => i.name.toLowerCase() === tool.name.toLowerCase()
                    )
                    return (
                      <div
                        key={tool.id}
                        className="group/btn relative inline-flex"
                      >
                        <button
                          type="button"
                          disabled={selected}
                          onClick={() => addLinkedTool(tool)}
                          className={cn(
                            "relative z-10 inline-flex items-center gap-1.5 rounded-md border bg-white px-2.5 py-1 text-xs transition-colors",
                            selected
                              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                              : "cursor-pointer border-slate-200/80 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-900"
                          )}
                        >
                          <Link2 className="size-3 text-indigo-600" />
                          <span>{tool.name}</span>
                          {selected && (
                            <Check className="size-3 text-emerald-600" />
                          )}
                        </button>
                        {!selected && <HoverOutline />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
