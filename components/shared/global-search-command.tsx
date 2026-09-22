"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Wrench,
  Package,
  TrendingUp,
  CreditCard,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import { ProductLogo } from "@/components/shared/product-logo"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ItemTypeBadge } from "@/components/shared/item-type-badge"
import { useProducts } from "@/hooks/products/use-products"
import { useTools } from "@/hooks/tools/use-tools"
import { useDebounce } from "@/hooks/shared/use-debounce"
import { ROUTES } from "@/constants/routes"
import { ITEM_KIND } from "@/constants/items"
import {
  pricingBadgeColor,
  navbarSearchButton,
  commandFooter,
} from "@/utils/styles"
import type { Tier, Pricing } from "@/constants/plans"
import { cn } from "@/lib/utils"

export interface GlobalSearchCommandProps {
  className?: string
}

export const GlobalSearchCommand = ({ className }: GlobalSearchCommandProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isMac, setIsMac] = useState(false)

  const debouncedSearch = useDebounce(search.trim(), 200)

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
        (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !isTargetInput)
      ) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const hasQuery = debouncedSearch.length > 0

  const { data: tools = [], isLoading: isToolsLoading } = useTools(
    { q: debouncedSearch, limit: 5 },
    { enabled: hasQuery }
  )

  const { data: products = [], isLoading: isProductsLoading } = useProducts(
    { q: debouncedSearch, limit: 5 },
    { enabled: hasQuery }
  )

  const isLoading = hasQuery && (isToolsLoading || isProductsLoading)

  const handleSelect = (url: string) => {
    setOpen(false)
    setSearch("")
    router.push(url)
  }

  const hasResults = tools.length > 0 || products.length > 0

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(navbarSearchButton, className)}
        aria-label="Search tools, products, APIs"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="size-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-slate-600" />
          <span className="truncate text-slate-400 transition-colors group-hover:text-slate-600">
            Search tools, APIs, products...
          </span>
        </div>
        <Kbd className="shrink-0 border border-slate-200 bg-white px-1 font-mono text-[10px] text-slate-400 shadow-2xs">
          {isMac ? "⌘K" : "Ctrl+K"}
        </Kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setSearch("")
        }}
        title="Search"
        description="Search developer tools, products, and categories"
      >
        <Command shouldFilter={false} className="rounded-none">
          <CommandInput
            placeholder="Search tools, APIs, products..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-80 overflow-y-auto p-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-6 text-xs text-muted-foreground">
                <Spinner className="mr-2 size-4 text-slate-400" />
                Searching tools and products...
              </div>
            ) : hasQuery && !hasResults ? (
              <CommandEmpty>
                No tools or products found matching &ldquo;{debouncedSearch}&rdquo;.
              </CommandEmpty>
            ) : null}

            {hasQuery && !isLoading && (
              <>
                {tools.length > 0 && (
                  <CommandGroup heading="Developer Tools">
                    {tools.map((tool) => (
                      <CommandItem
                        key={`tool-${tool.id}`}
                        value={`tool-${tool.slug}`}
                        onSelect={() => handleSelect(ROUTES.TOOL(tool.slug))}
                        className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2"
                      >
                        <ProductLogo
                          text={tool.name.slice(0, 2).toUpperCase()}
                          imageUrl={tool.logoUrl}
                          websiteUrl={tool.websiteUrl}
                          alt={tool.name}
                          className="size-7 shrink-0 rounded-md border border-slate-200 text-xs shadow-2xs"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-semibold text-slate-900">
                              {tool.name}
                            </span>
                            <VerifiedBadge tier={tool.tier as Tier} className="size-3.5" />
                            {tool.pricing && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "px-1 py-0 text-[10px]",
                                  pricingBadgeColor(tool.pricing as Pricing)
                                )}
                              >
                                {tool.pricing}
                              </Badge>
                            )}
                          </div>
                          {tool.tagline && (
                            <p className="truncate text-[11px] text-muted-foreground">
                              {tool.tagline}
                            </p>
                          )}
                        </div>
                        <ItemTypeBadge kind={ITEM_KIND.TOOL} className="shrink-0 text-[10px]" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {products.length > 0 && (
                  <CommandGroup heading="Products">
                    {products.map((product) => (
                      <CommandItem
                        key={`prod-${product.id}`}
                        value={`prod-${product.slug}`}
                        onSelect={() => handleSelect(ROUTES.PRODUCT(product.slug))}
                        className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2"
                      >
                        <ProductLogo
                          text={product.name.slice(0, 2).toUpperCase()}
                          imageUrl={product.logoUrl}
                          websiteUrl={product.websiteUrl}
                          alt={product.name}
                          className="size-7 shrink-0 rounded-md border border-slate-200 text-xs shadow-2xs"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-semibold text-slate-900">
                              {product.name}
                            </span>
                            <VerifiedBadge tier={product.tier as Tier} className="size-3.5" />
                            {product.pricing && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "px-1 py-0 text-[10px]",
                                  pricingBadgeColor(product.pricing as Pricing)
                                )}
                              >
                                {product.pricing}
                              </Badge>
                            )}
                          </div>
                          {product.tagline && (
                            <p className="truncate text-[11px] text-muted-foreground">
                              {product.tagline}
                            </p>
                          )}
                        </div>
                        <ItemTypeBadge kind={ITEM_KIND.PRODUCT} className="shrink-0 text-[10px]" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                <CommandSeparator />

                <CommandGroup heading="Search Directory">
                  <CommandItem
                    value={`search-all-tools-${debouncedSearch}`}
                    onSelect={() =>
                      handleSelect(
                        `${ROUTES.TOOLS}?q=${encodeURIComponent(debouncedSearch)}`
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 px-2.5 py-2"
                  >
                    <Wrench className="size-3.5 text-slate-500" />
                    <span>View all tools matching &ldquo;{debouncedSearch}&rdquo;</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      Tools
                    </span>
                  </CommandItem>
                  <CommandItem
                    value={`search-all-products-${debouncedSearch}`}
                    onSelect={() =>
                      handleSelect(
                        `${ROUTES.PRODUCTS}?q=${encodeURIComponent(debouncedSearch)}`
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 px-2.5 py-2"
                  >
                    <Package className="size-3.5 text-slate-500" />
                    <span>View all products matching &ldquo;{debouncedSearch}&rdquo;</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      Products
                    </span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}

            {!hasQuery && (
              <CommandGroup heading="Quick Navigation">
                <CommandItem
                  value="quick-nav-tools"
                  onSelect={() => handleSelect(ROUTES.TOOLS)}
                  className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2"
                >
                  <Wrench className="size-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Developer Tools</span>
                    <span className="text-[11px] text-muted-foreground">
                      Browse developer tools, APIs & SDKs
                    </span>
                  </div>
                </CommandItem>
                <CommandItem
                  value="quick-nav-products"
                  onSelect={() => handleSelect(ROUTES.PRODUCTS)}
                  className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2"
                >
                  <Package className="size-4 text-indigo-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Products & Launches</span>
                    <span className="text-[11px] text-muted-foreground">
                      Explore newly launched projects & software
                    </span>
                  </div>
                </CommandItem>
                <CommandItem
                  value="quick-nav-trending"
                  onSelect={() => handleSelect(ROUTES.TRENDING)}
                  className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2"
                >
                  <TrendingUp className="size-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Trending</span>
                    <span className="text-[11px] text-muted-foreground">
                      Top upvoted tools & products today
                    </span>
                  </div>
                </CommandItem>
                <CommandItem
                  value="quick-nav-pricing"
                  onSelect={() => handleSelect(ROUTES.PRICING)}
                  className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2"
                >
                  <CreditCard className="size-4 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Pricing & Premium</span>
                    <span className="text-[11px] text-muted-foreground">
                      Upgrade tiers, get verified & boost visibility
                    </span>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>

          <div className={commandFooter}>
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
