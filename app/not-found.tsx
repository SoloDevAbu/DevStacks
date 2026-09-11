import type { Metadata } from "next"
import Link from "next/link"
import {
  Home,
  Wrench,
  Package,
  TrendingUp,
  PlusCircle,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const metadata: Metadata = {
  title: `Page Not Found | ${SITE_CONFIG.name}`,
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
}

const QUICK_EXPLORE_LINKS = [
  {
    title: "Tools Directory",
    description: "Explore developer APIs, infrastructure, SDKs, and databases.",
    href: ROUTES.TOOLS,
    icon: Wrench,
  },
  {
    title: "Products Showcase",
    description: "Discover verified software built by developers and indie teams.",
    href: ROUTES.PRODUCTS,
    icon: Package,
  },
  {
    title: "Trending Stacks",
    description: "Community-upvoted developer tools with algorithmic momentum.",
    href: ROUTES.TRENDING,
    icon: TrendingUp,
  },
  {
    title: "Showcase a Build",
    description: "Submit your developer tool or project to be discovered.",
    href: ROUTES.SHOWCASE,
    icon: PlusCircle,
  },
] as const

const NotFound = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      {/* Top Banner / Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden border-b border-dashed border-border bg-linear-to-b from-slate-50/80 via-white to-slate-50/40 px-6 py-16 text-center md:py-24">
        {/* Ambient Blur Accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl"
        />

        <Badge
          variant="outline"
          className="mb-5 inline-flex items-center gap-2 rounded-full border-slate-200 bg-white/90 px-3.5 py-1 font-mono text-[11px] text-slate-700 shadow-2xs backdrop-blur-xs"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
          </span>
          404 • ROUTE NOT FOUND
        </Badge>

        <h1 className="font-mono text-6xl font-black tracking-tight text-slate-900 sm:text-7xl md:text-8xl">
          4<span className="text-blue-600">0</span>4
        </h1>

        <p className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Lost in the Stack
        </p>

        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
          The page you are looking for does not exist, has been deleted, or may have moved to a different address.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href={ROUTES.HOME} />}
            className="h-9 gap-2 rounded-lg bg-slate-900 px-5 font-semibold text-white shadow-2xs hover:bg-slate-800"
          >
            <Home className="size-4" />
            Return to Home
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            size="lg"
            render={<Link href={ROUTES.PRODUCTS} />}
            className="h-9 gap-2 rounded-lg border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-950"
          >
            <Package className="size-4 text-slate-600" />
            Explore Products
          </Button>
        </div>
      </section>

      {/* Helpful Navigation Grid */}
      <section className="px-6 py-10 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <Compass className="size-4 text-slate-500" />
            <h2 className="font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
              Looking for something else?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {QUICK_EXPLORE_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative flex items-start gap-3.5 border border-dashed border-border bg-white p-4 transition-all hover:border-slate-300 hover:bg-slate-50/60 hover:shadow-2xs"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all group-hover:border-slate-300 group-hover:bg-white group-hover:text-slate-950 group-hover:shadow-2xs">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                      {link.title}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-2">
                      {link.description}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotFound
