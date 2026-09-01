import {
  Home,
  Package,
  TrendingUp,
  Grid,
  Calendar,
  Blocks,
  PlusCircle,
} from "lucide-react"

export function LeftSidebar() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Discover */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Discover
        </h3>
        <nav className="mt-2 flex flex-col gap-2 text-sm font-medium">
          <a
            href="#"
            className="flex items-center gap-3 py-1.5 hover:text-foreground"
          >
            <Home className="size-4" /> Home
          </a>
          <a
            href="#"
            className="flex items-center gap-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            <Package className="size-4" /> Products
          </a>
          <a
            href="#"
            className="flex items-center gap-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            <TrendingUp className="size-4" /> Trending
          </a>
          <a
            href="#"
            className="flex items-center gap-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            <Grid className="size-4" /> Categories
          </a>
        </nav>
      </div>

      {/* Recaps */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Recaps
        </h3>
        <nav className="mt-2 flex flex-col gap-2 text-sm font-medium text-muted-foreground">
          <a
            href="#"
            className="flex items-center gap-3 py-1.5 hover:text-foreground"
          >
            <Calendar className="size-4" /> Recaps
          </a>
        </nav>
      </div>

      {/* Ecosystem */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Ecosystem
        </h3>
        <nav className="mt-2 flex flex-col gap-2 text-sm font-medium text-muted-foreground">
          <a
            href="#"
            className="flex items-center gap-3 py-1.5 hover:text-foreground"
          >
            <Blocks className="size-4" /> Built With
          </a>
        </nav>
      </div>

      {/* Community */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Community
        </h3>
        <nav className="mt-2 flex flex-col gap-2 text-sm font-medium text-muted-foreground">
          <a
            href="#"
            className="flex items-center gap-3 py-1.5 hover:text-foreground"
          >
            <PlusCircle className="size-4" /> Showcase a Build
          </a>
        </nav>
      </div>
    </div>
  )
}
