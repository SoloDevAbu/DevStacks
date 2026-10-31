"use client"

import { useState } from "react"
import { ListCollapse, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BlogTocItem } from "@/lib/blog/headings"

export const BlogMobileToc = ({ items }: { items: BlogTocItem[] }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (items.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setIsOpen(false)
    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: "smooth" })
      history.pushState(null, "", `#${id}`)
    }
  }

  return (
    <div className="w-full lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-none border border-dashed border-border bg-slate-50/80 px-4 py-3 text-xs font-semibold text-slate-800 shadow-2xs"
      >
        <span className="flex items-center gap-2">
          <ListCollapse className="size-4 text-indigo-600" />
          <span>Table of Contents ({items.length} sections)</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-slate-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <nav className="mt-2 rounded-xl border border-dashed border-border bg-white p-3 shadow-sm">
          <ul className="flex flex-col gap-1 text-xs max-h-60 overflow-y-auto">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(item.level === 3 ? "pl-3" : "pl-0")}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className="block rounded-md px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="line-clamp-1">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

