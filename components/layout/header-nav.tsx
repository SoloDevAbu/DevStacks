"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants/routes"

export const HeaderNav = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    router.push(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <nav className="flex w-full items-center justify-around gap-6 text-sm font-medium text-muted-foreground">
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full rounded-none border border-dashed border-slate-200 bg-slate-50 pr-4 pl-9 focus-visible:border-slate-400 focus-visible:ring-0"
          placeholder="Search developer products..."
        />
      </form>
      <Link
        href={ROUTES.PRICING}
        className="shrink-0 font-semibold text-slate-900 hover:text-foreground transition-colors"
      >
        Pricing
      </Link>
    </nav>
  )
}
