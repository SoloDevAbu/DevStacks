import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import {
  Globe,
  Sparkles,
  Layers,
  Cpu,
  Package,
  Wrench,
  Search,
  CheckCircle2,
  Share2,
  Code2,
} from "lucide-react"

export interface SubmissionBenefit {
  icon: typeof Globe
  title: string
  description: string
}

export interface LaunchTrackInfo {
  id: "product" | "tool"
  title: string
  shortTitle: string
  badge: string
  description: string
  forWhom: string
  icon: typeof Package
  accentColor: string
  keyFeatures: string[]
  fields: string[]
  seoBenefit: string
}

export interface SubmissionStep {
  step: number
  title: string
  description: string
  icon: typeof Search
}

export interface SubmissionFaq {
  question: string
  answer: string
}

export const SUBMISSION_BENEFITS: SubmissionBenefit[] = [
  {
    icon: Globe,
    title: "High-Authority Organic SEO",
    description:
      "Permanent directory listing with verified meta tags, structured SoftwareApplication & Product schema, and high-crawl category indexes.",
  },
  {
    icon: Sparkles,
    title: "AEO & GEO Optimization",
    description:
      "Automatic inclusion in /llms.txt and /llms-full.txt, ensuring ChatGPT, Claude, and Perplexity understand and recommend your product or tool.",
  },
  {
    icon: Layers,
    title: "Bidirectional Tech-Stack Graph",
    description:
      "Products showcase their underlying building blocks; developer tools showcase live real-world applications built with their software.",
  },
  {
    icon: Cpu,
    title: "This Week's Launches",
    description:
      "Every new submission features in This Week's Launches on the homepage, ranked directly by verified community votes.",
  },
]

export const LAUNCH_TRACKS: Record<"product" | "tool", LaunchTrackInfo> = {
  product: {
    id: "product",
    title: "Software Products & SaaS",
    shortTitle: "Launch a Product",
    badge: "SaaS & Applications",
    description:
      "For SaaS founders, indie hackers, and software makers building web apps, mobile apps, or digital platforms.",
    forWhom:
      "SaaS platforms, AI copilots, mobile apps (iOS & Android), browser extensions, web apps, and developer-built products.",
    icon: Package,
    accentColor: "border-blue-500/20 bg-blue-50/40 text-blue-700",
    keyFeatures: [
      "Connect with underlying tools via the 'Built With' tech-stack graph",
      "Showcase App Store, Google Play, and Chrome Web Store distribution links",
      "Architectural deep dive: problem statement, solution, and demo video",
      "Featured in This Week's Launches with community likes and feedback",
    ],
    fields: [
      "Product Name & Punchy Tagline",
      "Official Website URL & Pricing Model",
      "Built-With Tech Stack Dependencies",
      "App Store & Chrome Web Store Badges",
      "Architecture Deep Dive & Demo Video",
      "Screenshots & Media Gallery",
      "AEO, GEO & Machine AI Context",
    ],
    seoBenefit:
      "Gains permanent backlinks, cross-traffic from developer tool detail pages, and direct citation by AI search engines.",
  },
  tool: {
    id: "tool",
    title: "Developer Tools & APIs",
    shortTitle: "Launch a Dev Tool",
    badge: "APIs, SDKs & Infrastructure",
    description:
      "For devtools creators, open-source maintainers, and infrastructure builders creating foundational software for engineers.",
    forWhom:
      "APIs, SDKs, developer libraries, databases, DevOps tools, CLI utilities, and developer platforms.",
    icon: Wrench,
    accentColor: "border-indigo-500/20 bg-indigo-50/40 text-indigo-700",
    keyFeatures: [
      "Dedicated listing in the developer tools catalog categorized by engineering domain",
      "Highlight GitHub repository, documentation URL, and supported programming languages",
      "Automatic reverse discovery on every product profile that declares your tool in its stack",
      "Permanent inclusion in /llms.txt and machine-readable feeds for AI coding assistants",
    ],
    fields: [
      "Tool Name & Developer Tagline",
      "Official Website & Documentation URLs",
      "GitHub Repository & Open-Source Details",
      "Developer Category & Tech Taxonomy",
      "Supported Languages & Platforms",
      "Pricing Model (Free, Freemium, Paid, Open Source)",
      "Technical Problem & Solution Architecture",
    ],
    seoBenefit:
      "Indexes in developer infrastructure search rankings, generates developer mindshare, and feeds AI assistant recommendation engines.",
  },
}

export const SUBMISSION_STEPS: SubmissionStep[] = [
  {
    step: 1,
    title: "Select Your Launch Track",
    description:
      "Choose whether you are launching a Software Product (SaaS, app) or a Developer Tool (API, library, infra).",
    icon: Layers,
  },
  {
    step: 2,
    title: "Provide Core Information",
    description:
      "Fill in your project name, tagline, official URL, description, pricing model, and choose your launch week.",
    icon: CheckCircle2,
  },
  {
    step: 3,
    title: "Detail Architecture & Media",
    description:
      "Add 'Built With' tools or GitHub/documentation links, problem/solution breakdown, demo videos, and store badges.",
    icon: Code2,
  },
  {
    step: 4,
    title: "Configure AI & SEO Metadata",
    description:
      "Provide targeted search keywords, target audience, regional geo-targeting (GEO), and an AI Context prompt for LLMs.",
    icon: Share2,
  },
]

export const SUBMISSION_FAQS: SubmissionFaq[] = [
  {
    question: `How do I list my product or developer tool on ${SITE_CONFIG.name}?`,
    answer: `Sign in with your Google account, navigate to ${ROUTES.SUBMIT}, select whether you are launching a Product or a Developer Tool, complete the submission form detailing your problem statement, solution, target audience, and launch week schedule, then submit for review.`,
  },
  {
    question: `What is the difference between launching a Product vs. a Developer Tool?`,
    answer: `Developer Tools are foundational building blocks, APIs, libraries, SDKs, databases, and developer infrastructure that other developers build with (e.g. Supabase, Stripe, Docker, Prisma). Products are end-user software applications, SaaS platforms, mobile apps, desktop tools, and web applications built using those underlying tools. Submitting a product lets you declare your tech stack, while submitting a tool gives you a dedicated listing in the devtools directory and tracks every product built with your tool.`,
  },
  {
    question: `How does the "Built With" tech-stack graph benefit both products and tools?`,
    answer: `The tech-stack graph creates high-intent bidirectional discovery: product pages showcase an interactive architectural blueprint of the developer tools used to build them, while tool pages feature real-world products built with their software. This provides authentic social proof for tools and discoverability for products.`,
  },
  {
    question: `What are the discoverability benefits of launching on ${SITE_CONFIG.name}?`,
    answer: `Listings receive permanent directory indexing, inclusion in /llms.txt and /llms-full.txt for generative AI engines (ChatGPT, Claude, Perplexity), structured SoftwareApplication and Product JSON-LD, high-authority dofollow backlinks, and placement in This Week's Launches on the homepage ranked by verified community votes.`,
  },
  {
    question: `What metadata is collected for AEO and GEO optimization?`,
    answer: `Submissions collect targeted search keywords, audience personas, regional geo-targeting (GEO), directory categories (ASO), SERP meta tags, and an AI Context prompt. This machine-readable metadata feeds directly into search crawlers and AI answer engines, allowing models like ChatGPT, Claude, and Perplexity to accurately cite and recommend your product or tool.`,
  },
  {
    question: `Is listing on ${SITE_CONFIG.name} free?`,
    answer: `Yes, listing on ${SITE_CONFIG.name} is 100% free for open-source projects, indie hackers, and software companies. Every approved listing receives permanent indexing, rich snippets, and inclusion in AI crawler feeds. As part of our launch promotion, new submissions also receive an automatic upgrade to Verified Premium status upon approval.`,
  },
  {
    question: `How do launch weeks and community voting work?`,
    answer: `When submitting, you pick an upcoming launch week (or the next available week). During that week, your launch is prominently featured on the homepage in "This Week's Launches", where community members vote and comment. Listings are ranked fairly by genuine community votes, giving your launch organic reach and feedback.`,
  },
]
