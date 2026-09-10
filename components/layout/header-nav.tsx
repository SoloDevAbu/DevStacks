"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import {
  navbarSearchWrapper,
  navbarSearchInput,
  navbarNavLink,
  navbarNavLinkActive,
} from "@/utils/styles"

type NavLinkItem = {
  label: string
  href: string
  highlight?: boolean
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Tools", href: ROUTES.TOOLS },
  { label: "Products", href: ROUTES.PRODUCTS },
  { label: "Trending", href: ROUTES.TRENDING },
  { label: "Pricing", href: ROUTES.PRICING, highlight: true },
]


export const HeaderNav = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMac, setIsMac] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    router.push(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <nav className="flex w-full items-center justify-between gap-6">
      <form onSubmit={handleSearchSubmit} className={navbarSearchWrapper}>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={navbarSearchInput}
          placeholder="Search tools, APIs, products..."
        />
        <Kbd className="pointer-events-none absolute top-1/2 right-2.5 h-4.5 -translate-y-1/2 border border-slate-200 bg-white px-1 font-mono text-[10px] text-slate-400 shadow-2xs">
          {isMac ? "⌘K" : "Ctrl+K"}
        </Kbd>
      </form>

      <div className="flex items-center gap-5">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                navbarNavLink,
                isActive && navbarNavLinkActive,
                link.highlight &&
                  "inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
              )}
            >
              {link.highlight && <Sparkles className="size-3 text-indigo-500" />}
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

