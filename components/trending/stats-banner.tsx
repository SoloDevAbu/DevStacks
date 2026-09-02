import { Box, Flame, Sparkles, TrendingUp } from "lucide-react"

export function StatsBanner() {
  return (
    <div className="grid grid-cols-2 gap-px border-b border-dashed border-border bg-slate-100 sm:grid-cols-4">
      {/* Stat 1 */}
      <div className="flex flex-col items-center justify-center gap-3 bg-white px-6 py-8 md:flex-row md:justify-start md:px-8">
        <div className="flex size-10 shrink-0 items-center justify-center text-indigo-600">
          <Box className="size-6" />
        </div>
        <div className="flex flex-col text-center md:text-left">
          <span className="text-xl font-bold text-slate-900">3,217</span>
          <span className="text-xs font-medium text-slate-500">
            Products built today
          </span>
        </div>
      </div>

      {/* Stat 2 */}
      <div className="flex flex-col items-center justify-center gap-3 bg-white px-6 py-8 md:flex-row md:justify-start md:px-8">
        <div className="flex size-10 shrink-0 items-center justify-center text-emerald-500">
          <TrendingUp className="size-6" />
        </div>
        <div className="flex flex-col text-center md:text-left">
          <span className="text-xl font-bold text-slate-900">24%</span>
          <span className="text-xs font-medium text-slate-500">
            Vs yesterday
          </span>
        </div>
      </div>

      {/* Stat 3 */}
      <div className="flex flex-col items-center justify-center gap-3 bg-white px-6 py-8 md:flex-row md:justify-start md:px-8">
        <div className="flex size-10 shrink-0 items-center justify-center text-orange-500">
          <Flame className="size-6" />
        </div>
        <div className="flex flex-col text-center md:text-left">
          <span className="text-xl font-bold text-slate-900">56</span>
          <span className="text-xs font-medium text-slate-500">
            Products trending
          </span>
        </div>
      </div>

      {/* Stat 4 */}
      <div className="flex flex-col items-center justify-center gap-3 bg-white px-6 py-8 md:flex-row md:justify-start md:px-8">
        <div className="flex size-10 shrink-0 items-center justify-center text-purple-600">
          <Sparkles className="size-6" />
        </div>
        <div className="flex flex-col text-center md:text-left">
          <span className="text-xl font-bold text-slate-900">128</span>
          <span className="text-xs font-medium text-slate-500">New today</span>
        </div>
      </div>
    </div>
  )
}
