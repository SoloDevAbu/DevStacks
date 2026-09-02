import { ProductList, type Product } from "@/components/home/product-list"
import { PageHeader } from "@/components/shared/page-header"
import { AI_PROMPTS } from "@/lib/prompts"

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
      <PageHeader 
        heading="Discover what you can build with" 
        description="Discover developer tools, APIs, and infrastructure, and the products people are already building with them" 
        aiPrompt={AI_PROMPTS.home}
      />

      {/* Product List Section (Full Width, No Gaps) */}
      <div className="flex w-full flex-1 flex-col">
        <ProductList products={TRENDING_PRODUCTS} />
      </div>
    </div>
  )
}
