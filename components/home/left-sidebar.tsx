import { Bot, CreditCard, Code, Megaphone } from "lucide-react"

export function LeftSidebar() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Filter by Type */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-sm">Filter by Type</h3>
        <nav className="flex flex-col gap-2 mt-2 text-sm text-muted-foreground font-medium">
          <a href="#" className="flex items-center gap-3 py-1.5 hover:text-foreground">
            <Bot className="size-4" /> AI Tools
          </a>
          <a href="#" className="flex items-center gap-3 py-1.5 hover:text-foreground">
            <CreditCard className="size-4" /> Payments
          </a>
          <a href="#" className="flex items-center gap-3 py-1.5 hover:text-foreground">
            <Code className="size-4" /> Developer Tools
          </a>
          <a href="#" className="flex items-center gap-3 py-1.5 hover:text-foreground">
            <Megaphone className="size-4" /> Marketing
          </a>
        </nav>
      </div>

      <div className="border-t border-dashed border-border" />

      {/* Trending */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-sm">Trending</h3>
        <nav className="flex flex-col gap-3 mt-2 text-sm font-medium">
          <a href="#" className="flex items-center gap-3 py-1.5">
            <span className="flex size-6 items-center justify-center rounded bg-indigo-100 text-xs font-semibold text-indigo-700">1</span>
            NextFlow AI
          </a>
          <a href="#" className="flex items-center gap-3 py-1.5">
            <span className="flex size-6 items-center justify-center rounded bg-indigo-100 text-xs font-semibold text-indigo-700">2</span>
            CloudScale Pro
          </a>
        </nav>
      </div>
    </div>
  )
}
