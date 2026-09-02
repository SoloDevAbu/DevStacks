import Image from "next/image"
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
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      {/* Header & Controls Section */}
      <div className="sticky top-0 z-10 flex flex-col justify-between gap-6 border-b border-dashed border-border bg-white px-6 pt-8 pb-6 md:px-8 lg:flex-row lg:items-start">
        {/* Left: Hero Texts */}
        <div className="flex max-w-2xl flex-col">
          <h1 className="mb-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Discover what you can build with
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Discover developer tools, APIs, and infrastructure, and the products
            people are already building with them
          </p>
        </div>
        {/* Right: Controls */}
        <div className="flex w-full max-w-[320px] flex-col gap-3 lg:max-w-[400px] lg:items-end">
          <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
            ASK AI ABOUT US
          </p>
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            {[
              {
                id: "chatgpt",
                name: "ChatGPT",
                icon: "/ai-logos/chatgpt.png",
                url: "https://chatgpt.com/?q=",
              },
              {
                id: "claude",
                name: "Claude",
                icon: "/ai-logos/claude-color.png",
                url: "https://claude.ai/new?q=",
              },
              {
                id: "gemini",
                name: "Gemini",
                icon: "/ai-logos/gemini-color.png",
                url: "https://gemini.google.com/app?q=",
              },
              {
                id: "grok",
                name: "Grok",
                icon: "/ai-logos/grok.png",
                url: "https://x.com/i/grok?text=",
              },
              {
                id: "perplexity",
                name: "Perplexity",
                icon: "/ai-logos/perplexity-color.png",
                url: "https://www.perplexity.ai/search?q=",
              },
            ].map((ai) => {
              const prompt =
                "What can you tell me about BuyMyNextLaunch, a platform to discover developer tools, APIs, and infrastructure, and the products people are already building with them?";
              return (
                <a
                  key={ai.id}
                  href={`${ai.url}${encodeURIComponent(prompt)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 justify-center transition-colors"
                  title={`Ask ${ai.name}`}
                >
                  <Image
                    src={ai.icon}
                    alt={ai.name}
                    width={14}
                    height={14}
                    className="object-contain mix-blend-multiply"
                  />
                  <span className="text-xs font-medium text-slate-600 transition-colors group-hover:text-slate-900">
                    {ai.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product List Section (Full Width, No Gaps) */}
      <div className="flex w-full flex-1 flex-col">
        <ProductList products={TRENDING_PRODUCTS} />
      </div>
    </div>
  )
}
