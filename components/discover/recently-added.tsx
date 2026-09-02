import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VerifiedBadge, SectionHeader } from "./shared"

const RECENTLY_ADDED = [
  { name: "BetterAuth", desc: "Auth that just works for modern apps", category: "Auth", logo: "A", logoBg: "bg-black text-white", tier: "premium" },
  { name: "QStash", desc: "Serverless message queues", category: "Infra", logo: "Q", logoBg: "bg-sky-100 text-sky-500", tier: "premium+" },
  { name: "TinyBase", desc: "Local-first, open source database", category: "Database", logo: "T", logoBg: "bg-orange-100 text-orange-500", tier: "free" },
  { name: "Uploadthing", desc: "File uploads for the modern web", category: "Dev Tools", logo: "U", logoBg: "bg-purple-100 text-purple-500", tier: "free" },
  { name: "Mailsend", desc: "Developer friendly email API", category: "Email", logo: "M", logoBg: "bg-orange-500 text-white", tier: "free" },
  { name: "PGlite", desc: "SQLite for Postgres developers", category: "Database", logo: "P", logoBg: "bg-slate-100 text-slate-500", tier: "free" },
]

export function RecentlyAdded() {
  return (
    <section>
      <SectionHeader
        title="Recently added"
        subtitle="Fresh tools and products added by the community"
        viewAllText="View all"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {RECENTLY_ADDED.map((item) => (
          <Card
            key={item.name}
            className="group cursor-pointer rounded-none bg-white transition-colors hover:border-slate-300"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold", item.logoBg)}>
                {item.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-bold text-slate-900">{item.name}</h3>
                  <VerifiedBadge tier={item.tier} />
                </div>
                <p className="truncate text-xs font-medium text-slate-500">{item.desc}</p>
              </div>
              <div className="shrink-0 rounded bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
                {item.category}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
