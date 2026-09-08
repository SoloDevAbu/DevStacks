import { Box, Flame, Sparkles, TrendingUp } from "lucide-react"
import type { Stat } from "@/constants/types"

const STATS: Stat[] = [
  {
    label: "Products built today",
    value: "3,217",
    icon: Box,
    color: "text-indigo-600",
  },
  {
    label: "Vs yesterday",
    value: "24%",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
  {
    label: "Products trending",
    value: "56",
    icon: Flame,
    color: "text-orange-500",
  },
  {
    label: "New today",
    value: "128",
    icon: Sparkles,
    color: "text-purple-600",
  },
]

export const StatsBanner = () => {
  return (
    <div className="grid grid-cols-2 gap-px border-b border-dashed border-border bg-slate-100 sm:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-3 bg-white px-6 py-8 md:flex-row md:justify-start md:px-8"
        >
          <div
            className={`flex size-10 shrink-0 items-center justify-center ${stat.color}`}
          >
            <stat.icon className="size-6" />
          </div>
          <div className="flex flex-col text-center md:text-left">
            <span className="text-xl font-bold text-slate-900">
              {stat.value}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
