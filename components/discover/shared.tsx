import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function HoverOutline() {
  return (
    <div className="pointer-events-none absolute -inset-[6px] z-0 opacity-0 transition-opacity group-hover/btn:opacity-100">
      <div className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-slate-500" />
      <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-slate-500" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-slate-500" />
      <div className="absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-slate-500" />
    </div>
  )
}

export function VerifiedBadge({ tier }: { tier: string }) {
  if (tier === "free") return null
  return (
    <BadgeCheck
      className={cn(
        "size-4 shrink-0 text-white",
        tier === "premium+" ? "fill-amber-500" : "fill-blue-500"
      )}
    />
  )
}

export function SectionHeader({
  title,
  subtitle,
  viewAllText,
}: {
  title: string
  subtitle: string
  viewAllText: string
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
      <a
        href="#"
        className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        {viewAllText} <span className="text-slate-400">→</span>
      </a>
    </div>
  )
}
