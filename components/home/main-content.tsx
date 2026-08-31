import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductList, type Product } from "@/components/home/product-list"

const TRENDING_PRODUCTS: Product[] = [
  {
    id: "1",
    rank: 1,
    name: "MeetWave",
    tagline: "Privacy-first AI meeting recorder for Windows",
    comments: 24,
    tags: ["AI", "Productivity"],
    upvotes: 1245,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xl font-bold text-blue-400">
        |||
      </div>
    ),
  },
  {
    id: "2",
    rank: 2,
    name: "Dreamstate",
    tagline: "AI Head of Growth Agents Across Every Channel",
    comments: 18,
    tags: ["Marketing", "AI", "Productivity"],
    upvotes: 982,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-slate-800 font-bold text-teal-400">
        DS
      </div>
    ),
  },
  {
    id: "3",
    rank: 3,
    name: "Isometric Studio",
    tagline: "Create isometric illustrations fast",
    comments: 42,
    tags: ["Design Resources", "SaaS", "Other"],
    upvotes: 754,
    logo: (
      <div className="flex h-full w-full items-center justify-center border border-slate-200 bg-white font-bold text-slate-800">
        ISO
      </div>
    ),
  },
  {
    id: "4",
    rank: 4,
    name: "Distro",
    tagline:
      "AI distribution operator for content, conversations, outreach, and pipeline.",
    comments: 12,
    tags: ["Marketing", "SaaS", "SEO Tools"],
    upvotes: 412,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-indigo-500 font-bold text-white">
        D
      </div>
    ),
  },
]

export function MainContent() {
  return (
    <div className="relative flex h-full flex-col">
      {/* Background Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #8b5cf61a 1px, transparent 1px), linear-gradient(to bottom, #8b5cf61a 1px, transparent 1px)",
          backgroundSize: "3rem 3rem",
          maskImage: "linear-gradient(to bottom, white 40%, transparent 80%)",
        }}
      />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-24 pb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-[2.75rem]">
          Discover what you can build with
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600">
          Explore developer tools, infrastructure, APIs, and platforms — and
          discover the products people are already building with them
        </p>

        <div className="relative w-full max-w-2xl">
          <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-14 w-full rounded-none border-2 border-dashed border-slate-200 bg-white pr-28 pl-12"
            placeholder="Search products, categories, or builders..."
          />
          <Button className="absolute top-1/2 right-2 h-10 -translate-y-1/2 rounded-none bg-indigo-600 px-6 font-medium text-white hover:bg-indigo-700">
            Search
          </Button>
        </div>
      </div>

      <div className="border-t border-dashed border-border" />

      {/* Launches Section */}
      <div className="relative z-10 flex-1 bg-slate-50/50 px-8 py-10">
        <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Trending Launches
          </h2>
          <div className="flex items-center rounded-none border border-dashed border-slate-200 bg-white p-1 text-sm font-medium">
            <div className="border border-slate-200 bg-slate-100 px-4 py-1.5">
              Today
            </div>
            <div className="cursor-pointer px-4 py-1.5 text-muted-foreground transition-colors hover:text-foreground">
              This Week
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <ProductList products={TRENDING_PRODUCTS} />

          <Button
            variant="secondary"
            className="h-14 w-full rounded-none border border-dashed border-slate-300 bg-white text-base font-semibold text-indigo-700 hover:bg-slate-50"
          >
            Load More Launches
          </Button>
        </div>
      </div>
    </div>
  )
}
