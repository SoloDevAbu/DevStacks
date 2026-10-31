"use client"

import { useState, useEffect } from "react"
import { ListCollapse, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BlogTocItem } from "@/lib/blog/headings"

export interface BlogTableOfContentsProps {
  items: BlogTocItem[]
}

export const BlogTableOfContents = ({ items }: BlogTableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "")

  useEffect(() => {
    if (items.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 130 // Header height offset + buffer

      let currentActive = items[0]?.id || ""

      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= scrollPosition) {
            currentActive = item.id
          } else {
            break
          }
        }
      }

      setActiveId(currentActive)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top, behavior: "smooth" })
      history.pushState(null, "", `#${id}`)
      setActiveId(id)
    }
  }

  if (items.length === 0) return null

  return (
    <aside
      className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 xl:w-72 shrink-0 flex-col overflow-y-auto bg-white p-4 sm:p-5 lg:flex scrollbar-thin"
      aria-label="Table of Contents"
    >
      <div className="flex flex-col gap-3.5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800">
            <ListCollapse className="size-3.5 text-indigo-600" />
            <span>Table of Contents</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            {items.length} sections
          </span>
        </div>

        {/* Navigation List */}
        <nav>
          <ul className="flex flex-col gap-1 text-xs">
            {items.map((item) => {
              const isActive = activeId === item.id
              const isSubHeading = item.level === 3

              return (
                <li
                  key={item.id}
                  className={cn(isSubHeading ? "pl-2.5" : "pl-0")}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2.5 py-1.5 transition-all text-left",
                      isActive
                        ? "bg-indigo-50 font-bold text-indigo-900 border-l-2 border-indigo-600 shadow-2xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    )}
                  >
                    <span className="line-clamp-1">{item.text}</span>
                    {isActive && (
                      <ChevronRight className="size-3 shrink-0 text-indigo-600 ml-1" />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
