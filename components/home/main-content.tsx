import Image from "next/image"
import { ProductList, type Product } from "@/components/home/product-list"

export const TRENDING_PRODUCTS: Product[] = [
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
  {
    id: "5",
    rank: 5,
    name: "Supernova",
    tagline: "Design system manager for scaling UI components.",
    comments: 38,
    tags: ["Design Tools", "SaaS"],
    upvotes: 389,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-pink-500 font-bold text-white">
        SN
      </div>
    ),
  },
  {
    id: "6",
    rank: 6,
    name: "Orbit",
    tagline: "Community growth platform for DevRel teams.",
    comments: 21,
    tags: ["Marketing", "DevTools"],
    upvotes: 310,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-purple-600 font-bold text-white">
        O
      </div>
    ),
  },
  {
    id: "7",
    rank: 7,
    name: "FluxAI",
    tagline: "Generative AI for fast PCB design and engineering.",
    comments: 54,
    tags: ["AI", "Engineering"],
    upvotes: 295,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-emerald-500 font-bold text-slate-900">
        FX
      </div>
    ),
  },
  {
    id: "8",
    rank: 8,
    name: "CodeSense",
    tagline: "Context-aware code review assistant.",
    comments: 47,
    tags: ["Developer Tools", "AI"],
    upvotes: 278,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 font-bold text-sky-400">
        CS
      </div>
    ),
  },
  {
    id: "9",
    rank: 9,
    name: "Synthetix",
    tagline: "Generate synthetic user data for safe testing.",
    comments: 15,
    tags: ["Data", "Privacy"],
    upvotes: 241,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-orange-500 font-bold text-white">
        SY
      </div>
    ),
  },
  {
    id: "10",
    rank: 10,
    name: "Velocity",
    tagline: "High-performance edge caching for Next.js.",
    comments: 32,
    tags: ["Infrastructure", "Performance"],
    upvotes: 210,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-blue-600 font-bold text-white">
        V
      </div>
    ),
  },
  {
    id: "11",
    rank: 11,
    name: "Loomis",
    tagline: "AI-powered video translation and dubbing.",
    comments: 63,
    tags: ["Video", "AI"],
    upvotes: 198,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-rose-500 font-bold text-white">
        LM
      </div>
    ),
  },
  {
    id: "12",
    rank: 12,
    name: "Sentinel",
    tagline: "Automated cloud security posture management.",
    comments: 11,
    tags: ["Security", "Cloud"],
    upvotes: 185,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-slate-800 font-bold text-amber-400">
        ST
      </div>
    ),
  },
  {
    id: "13",
    rank: 13,
    name: "Nexus",
    tagline: "Unified API for all your SaaS integrations.",
    comments: 42,
    tags: ["API", "Infrastructure"],
    upvotes: 164,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-cyan-600 font-bold text-white">
        NX
      </div>
    ),
  },
  {
    id: "14",
    rank: 14,
    name: "Prism",
    tagline: "Beautiful analytics dashboards for Stripe.",
    comments: 29,
    tags: ["Analytics", "Finance"],
    upvotes: 142,
    logo: (
      <div className="flex h-full w-full items-center justify-center bg-violet-600 font-bold text-white">
        PR
      </div>
    ),
  },
]

export function MainContent() {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      {/* Header & Controls Section */}
      <div className="flex flex-col justify-between gap-6 border-b border-dashed border-border bg-white px-6 pt-8 pb-6 md:px-8 lg:flex-row lg:items-start">
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
        <div className="flex w-full max-w-[320px] flex-col gap-3 lg:max-w-100 lg:items-end">
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
                "What can you tell me about BuyMyNextLaunch, a platform to discover developer tools, APIs, and infrastructure, and the products people are already building with them?"
              return (
                <a
                  key={ai.id}
                  href={`${ai.url}${encodeURIComponent(prompt)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-1.5 transition-colors"
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
              )
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
