"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  CreditCard,
  Database,
  Shield,
  Cloud,
  Webhook,
  Layers,
  ChevronDown,
  X,
  type LucideIcon,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
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
import { ROUTES } from "@/constants/routes"

interface FeaturedCategory {
  name: string
  icon: LucideIcon
  color: string
}

const FEATURED_CATEGORIES: FeaturedCategory[] = [
  { name: "AI", icon: Sparkles, color: "text-purple-500" },
  { name: "Database", icon: Database, color: "text-emerald-500" },
  { name: "Auth", icon: Shield, color: "text-blue-500" },
  { name: "Payments", icon: CreditCard, color: "text-orange-500" },
  { name: "Infra", icon: Cloud, color: "text-cyan-500" },
  { name: "APIs", icon: Webhook, color: "text-indigo-500" },
]

interface CategoriesSearchProps {
  baseRoute?: string
  selectedCategory?: string
}

export const CategoriesSearch = ({
  baseRoute = ROUTES.PRODUCTS,
  selectedCategory,
}: CategoriesSearchProps) => {
  const router = useRouter()
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

  const handleSelectCategory = (catName: string | null) => {
    setOpen(false)
    setSearch("")
    if (!catName || catName.toLowerCase() === "all") {
      router.push(baseRoute)
    } else {
      router.push(`${baseRoute}?category=${encodeURIComponent(catName)}`)
    }
  }

  const isCustomSelected =
    Boolean(selectedCategory) &&
    !FEATURED_CATEGORIES.some(
      (c) => c.name.toLowerCase() === selectedCategory?.toLowerCase()
    )

  return (
    <>
      <div className="border-b border-dashed border-border bg-white px-6 py-2.5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Featured quick pills - wraps smoothly with zero horizontal scrollbar */}
          <div className="flex flex-wrap items-center gap-2">
            {FEATURED_CATEGORIES.map((cat) => {
              const isSelected =
                selectedCategory?.toLowerCase() === cat.name.toLowerCase()
              return (
                <div key={cat.name} className="group/btn relative inline-flex">
                  <Button
                    variant="outline"
                    onClick={() =>
                      isSelected
                        ? handleSelectCategory(null)
                        : handleSelectCategory(cat.name)
                    }
                    className={cn(
                      "relative z-10 gap-2 rounded-lg border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50",
                      isSelected &&
                        "border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100/70"
                    )}
                  >
                    <cat.icon className={cn("size-3.5", cat.color)} />
                    {cat.name}
                    {isSelected && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectCategory(null)
                        }}
                        className="ml-0.5 rounded-full p-0.5 text-indigo-600 hover:bg-indigo-200/80"
                        title="Clear category filter"
                      >
                        <X className="size-3" />
                      </span>
                    )}
                  </Button>
                  <HoverOutline />
                </div>
              )
            })}

            {/* If a category outside featured is selected (e.g. Marketing, Productivity), show it dynamically */}
            {isCustomSelected && selectedCategory && (
              <div className="group/btn relative inline-flex">
                <Button
                  variant="outline"
                  onClick={() => handleSelectCategory(null)}
                  className="relative z-10 gap-2 rounded-lg border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100/70"
                >
                  <Layers className="size-3.5 text-indigo-600" />
                  {selectedCategory}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectCategory(null)
                    }}
                    className="ml-0.5 rounded-full p-0.5 text-indigo-600 hover:bg-indigo-200/80"
                    title="Clear category filter"
                  >
                    <X className="size-3" />
                  </span>
                </Button>
                <HoverOutline />
              </div>
            )}
          </div>

          {/* Database Command Palette Trigger */}
          <div className="group/btn relative inline-flex">
            <Button
              variant="outline"
              onClick={() => setOpen(true)}
              className="relative z-10 h-auto gap-2 rounded-lg border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
            >
              <Layers className="size-3.5 text-slate-500" />
              <span>All Categories</span>
              <div className="hidden items-center gap-1 sm:flex ml-1">
                <Kbd className="h-4.5 px-1.5 text-[10px] font-semibold text-slate-500 border border-slate-200 bg-slate-50">
                  {isMac ? "⌘F" : "Ctrl+F"}
                </Kbd>
              </div>
              <ChevronDown className="size-3 text-slate-400" />
            </Button>
            <HoverOutline />
          </div>
        </div>
      </div>

      {/* Category Command Dialog */}
      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setSearch("")
        }}
        title="Search Categories"
        description="Search and filter by category from database"
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
                    data-checked={!selectedCategory ? "true" : undefined}
                    onSelect={() => handleSelectCategory(null)}
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
                        onSelect={() => handleSelectCategory(cat.name)}
                        className="cursor-pointer"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="ml-auto mr-3 text-[10px] text-muted-foreground">
                          {cat.count} {cat.count === 1 ? "item" : "items"}
                        </span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>

          {/* Dashed line and keyboard shortcut footer */}
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
