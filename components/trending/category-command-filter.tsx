"use client"

import { useState, useEffect } from "react"
import { Layers, ChevronDown, X } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { HoverOutline } from "@/components/shared/hover-outline"
import { useCategories } from "@/hooks/categories/use-categories"
import { useDebounce } from "@/hooks/shared/use-debounce"
import { cn } from "@/lib/utils"

interface CategoryCommandFilterProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export const CategoryCommandFilter = ({
  selectedCategory,
  onSelectCategory,
}: CategoryCommandFilterProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isMac, setIsMac] = useState(false)

  const debouncedSearch = useDebounce(search, 250)
  const { data: categories = [], isLoading } = useCategories(debouncedSearch)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isPlatformMac =
        navigator.platform?.toUpperCase().indexOf("MAC") >= 0 ||
        navigator.userAgent?.toUpperCase().indexOf("MAC") >= 0
      setIsMac(isPlatformMac)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTargetInput = (e.target as HTMLElement)?.matches(
        "input, textarea, [contenteditable]"
      )

      if (
        (e.key.toLowerCase() === "f" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !isTargetInput)
      ) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = (catName: string | null) => {
    onSelectCategory(catName)
    setOpen(false)
    setSearch("")
  }

  const isAllSelected = !selectedCategory || selectedCategory === "all"

  return (
    <>
      <div className="group/btn relative inline-flex">
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn(
            "relative z-10 h-auto gap-2 rounded-lg border-slate-200 bg-white px-3 py-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-slate-50",
            !isAllSelected &&
              "border-indigo-200 bg-indigo-50/60 text-indigo-700 hover:bg-indigo-100/70"
          )}
        >
          <Layers
            className={cn(
              "size-3.5",
              !isAllSelected ? "text-indigo-600" : "text-slate-500"
            )}
          />
          <span className="max-w-[140px] truncate sm:max-w-[180px]">
            {isAllSelected ? "All Categories" : selectedCategory}
          </span>

          {!isAllSelected && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(null)
              }}
              className="ml-0.5 rounded-full p-0.5 text-indigo-600 hover:bg-indigo-200/80"
              title="Clear category filter"
            >
              <X className="size-3" />
            </span>
          )}

          <div className="ml-1.5 hidden items-center gap-1 sm:flex">
            <Kbd className="h-5 border border-slate-200 bg-slate-50 px-1.5 text-[10px] font-semibold text-slate-500">
              {isMac ? "⌘F" : "Ctrl+F"}
            </Kbd>
          </div>

          <ChevronDown className="size-3.5 text-slate-400" />
        </Button>
        <HoverOutline />
      </div>

      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setSearch("")
        }}
        title="Filter by Category"
        description="Search and filter trending developer tools and products by category"
      >
        <Command shouldFilter={false} className="rounded-none">
          <CommandInput
            placeholder="Search category from database..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-64 overflow-y-auto p-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-6 text-xs text-muted-foreground">
                <Spinner className="mr-2 size-4 text-slate-400" />
                Searching categories...
              </div>
            ) : (
              <>
                <CommandEmpty>No categories found in database.</CommandEmpty>
                <CommandGroup heading="Database Categories">
                  <CommandItem
                    key="all"
                    value="all"
                    data-checked={isAllSelected ? "true" : undefined}
                    onSelect={() => handleSelect(null)}
                    className="cursor-pointer"
                  >
                    <Layers className="size-3.5 text-slate-500" />
                    <span className="font-medium">All Categories</span>
                  </CommandItem>

                  {categories.map((cat) => {
                    const isSelected =
                      selectedCategory?.toLowerCase() === cat.name.toLowerCase()
                    return (
                      <CommandItem
                        key={cat.name}
                        value={cat.name}
                        data-checked={isSelected ? "true" : undefined}
                        onSelect={() => handleSelect(cat.name)}
                        className="cursor-pointer"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="mr-3 ml-auto text-[10px] text-muted-foreground">
                          {cat.count} {cat.count === 1 ? "item" : "items"}
                        </span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>

          {/* Dashed line and keyboard hint footer */}
          <div className="flex items-center justify-between border-t border-dashed border-border bg-slate-50/70 px-3.5 py-2 text-[11px] text-muted-foreground select-none">
            <div className="flex items-center gap-3.5">
              <span className="inline-flex items-center gap-1.5">
                <KbdGroup>
                  <Kbd className="h-4.5 min-w-4.5 border border-border/70 bg-white px-1 text-[10px] font-medium text-slate-600 shadow-2xs">
                    ↑
                  </Kbd>
                  <Kbd className="h-4.5 min-w-4.5 border border-border/70 bg-white px-1 text-[10px] font-medium text-slate-600 shadow-2xs">
                    ↓
                  </Kbd>
                </KbdGroup>
                <span className="text-slate-500">Navigation</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Kbd className="h-4.5 min-w-4.5 border border-border/70 bg-white px-1.5 text-[10px] font-medium text-slate-600 shadow-2xs">
                  ↵
                </Kbd>
                <span className="text-slate-500">Select</span>
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5">
              <Kbd className="h-4.5 min-w-4.5 border border-border/70 bg-white px-1.5 text-[10px] font-medium text-slate-600 shadow-2xs">
                Esc
              </Kbd>
              <span className="text-slate-500">to close</span>
            </span>
          </div>
        </Command>
      </CommandDialog>
    </>
  )
}
