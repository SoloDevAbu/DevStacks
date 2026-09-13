"use client"

import { useState, useRef, useEffect } from "react"
import { useTools } from "@/hooks/tools/use-tools"
import { useDebounce } from "@/hooks/shared/use-debounce"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Link2, Plus, X, Search, Check, Sparkles } from "lucide-react"
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

  const debouncedQuery = useDebounce(query, 200)
  const { data: allTools = [], isLoading } = useTools({ limit: 100 })

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

  // Filter DevStacks tools matching the query
  const matchingTools = (allTools as DbTool[]).filter(
    (tool: DbTool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.slug.toLowerCase().includes(lowerQuery)
  )

  // Check if current query already exists in selected list
  const isAlreadySelected = value.some(
    (item) => item.name.toLowerCase() === lowerQuery
  )

  // Check if an exact match exists in DevStacks
  const exactDevStacksMatch = (allTools as DbTool[]).find(
    (tool: DbTool) => tool.name.toLowerCase() === lowerQuery
  )

  const addLinkedTool = (tool: { id: string; name: string; slug: string } | DbTool) => {
    if (value.some((item) => item.name.toLowerCase() === tool.name.toLowerCase())) {
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

    // If matches a DevStacks tool, link it instead
    const matched = (allTools as DbTool[]).find(
      (t: DbTool) => t.name.toLowerCase() === cleanName.toLowerCase()
    )
    if (matched) {
      addLinkedTool(matched)
      return
    }

    if (value.some((item) => item.name.toLowerCase() === cleanName.toLowerCase())) {
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
      } else if (matchingTools.length > 0 && query.trim()) {
        addLinkedTool(matchingTools[0])
      } else if (trimmedQuery) {
        addUnlinkedTool(trimmedQuery)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  // Popular tools suggestions
  const popularTools: DbTool[] = (allTools as DbTool[]).slice(0, 6)

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
                  <Link2 className="size-3 text-indigo-600 shrink-0" />
                ) : (
                  <Wrench className="size-3 text-slate-400 shrink-0" />
                )}
                <span>{item.name}</span>
                <span
                  className={cn(
                    "text-[10px] font-mono px-1 py-0.2 rounded",
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
                  className="size-4 ml-0.5 inline-flex items-center justify-center rounded-sm text-slate-400 hover:text-red-600 hover:bg-slate-200/50"
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
            className="pl-9 pr-24 text-xs"
          />
          {trimmedQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addUnlinkedTool(trimmedQuery)}
              className="absolute right-1 top-1 h-7 px-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="size-3 mr-1" />
              Add
            </Button>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            {trimmedQuery ? (
              <div className="flex flex-col gap-1">
                {/* Matching DevStacks Tools */}
                {matchingTools.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">
                      DevStacks Tools (Linked)
                    </div>
                    {matchingTools.slice(0, 5).map((tool: DbTool) => {
                      const selected = value.some(
                        (i) => i.name.toLowerCase() === tool.name.toLowerCase()
                      )
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          disabled={selected}
                          onClick={() => addLinkedTool(tool)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                            selected
                              ? "opacity-50 cursor-not-allowed bg-slate-50"
                              : "hover:bg-indigo-50/70 hover:text-indigo-900 cursor-pointer"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Link2 className="size-3.5 text-indigo-600 shrink-0" />
                            <span className="font-semibold text-slate-900">
                              {tool.name}
                            </span>
                            {tool.tagline && (
                              <span className="text-[11px] text-slate-400 truncate max-w-xs">
                                — {tool.tagline}
                              </span>
                            )}
                          </div>
                          {selected ? (
                            <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                              <Check className="size-3" /> Added
                            </span>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-indigo-200 bg-indigo-50 text-[10px] text-indigo-700 font-normal"
                            >
                              Link to tool
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Option to Add as Unlinked Custom Tool */}
                {!isAlreadySelected && (
                  <div className="border-t border-dashed border-slate-100 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => addUnlinkedTool(trimmedQuery)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100 transition-colors"
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
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Popular DevStacks Tools
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Click to link
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularTools.map((tool: DbTool) => {
                    const selected = value.some(
                      (i) => i.name.toLowerCase() === tool.name.toLowerCase()
                    )
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        disabled={selected}
                        onClick={() => addLinkedTool(tool)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors",
                          selected
                            ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-900 cursor-pointer"
                        )}
                      >
                        <Link2 className="size-3 text-indigo-600" />
                        <span>{tool.name}</span>
                        {selected && <Check className="size-3 text-emerald-600" />}
                      </button>
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
