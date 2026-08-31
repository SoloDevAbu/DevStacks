import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Award } from "lucide-react"

export function RightSidebar() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-sm">Promote</h3>
        <Card className="bg-slate-50/80 p-8 text-center flex flex-col items-center justify-center gap-2">
          <Megaphone className="size-6 text-muted-foreground" />
          <div className="font-semibold">Your ad here</div>
          <div className="text-xs text-muted-foreground">From $29 per 1,000 views</div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="p-0 border-dashed">
          <div className="pb-3 pt-5 px-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Award className="size-4" /> LAST WEEK'S BEST
            </div>
          </div>
          <CardContent className="px-5 pb-5 flex items-start gap-3">
             <div className="flex size-10 items-center justify-center bg-indigo-100 text-lg font-bold text-indigo-700 shrink-0 border border-indigo-200">
              P
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-sm">ProductRank Pro</div>
              <div className="text-xs text-muted-foreground leading-snug">Instant SEO audits and ranking insights for your landing page.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
