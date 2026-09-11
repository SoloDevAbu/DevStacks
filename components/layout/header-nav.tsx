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

  const isPricingActive = pathname === ROUTES.PRICING

  return (
    <nav className="flex items-center gap-6">
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

      <Link
        href={ROUTES.PRICING}
        className={cn(
          navbarNavLink,
          isPricingActive && navbarNavLinkActive
        )}
      >
        Pricing
      </Link>
    </nav>
  )
}

