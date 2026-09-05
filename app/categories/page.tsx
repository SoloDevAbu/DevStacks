import type { Metadata } from "next"
import Link from "next/link"
import {
  Sparkles,
  CreditCard,
  Database,
  LineChart,
  Shield,
  Cloud,
  Mail,
  Webhook,
  Boxes,
  Cpu,
  Terminal,
  Layers,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { discoveryCard } from "@/utils/styles"

export const metadata: Metadata = {
  title: "Explore Developer Tool Categories",
  description:
    `Browse developer tools, APIs, and infrastructure by category on ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/categories`,
  },
}

const CATEGORY_ITEMS = [
  {
    name: "AI & Machine Learning",
    slug: "AI",
    description: "LLMs, embeddings, agents, and local-first AI runtimes",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    name: "Payments & Billing",
    slug: "Payments",
    description: "Checkout APIs, merchants of record, subscription engines",
    icon: CreditCard,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    name: "Databases & Storage",
    slug: "Database",
    description: "Postgres, vector databases, local stores, caching",
    icon: Database,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    name: "Analytics & Telemetry",
    slug: "Analytics",
    description: "Session replay, product telemetry, feature flags",
    icon: LineChart,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    name: "Auth & Security",
    slug: "Auth",
    description: "OAuth, session management, 2FA, identity providers",
    icon: Shield,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    name: "Cloud & Infrastructure",
    slug: "Infra",
    description: "Serverless compute, edge networks, hosting platforms",
    icon: Cloud,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
  },
  {
    name: "Email & Messaging",
    slug: "Email",
    description: "Transactional email, push notifications, webhooks",
    icon: Mail,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    name: "APIs & Integrations",
    slug: "APIs",
    description: "REST, GraphQL, real-time sync, external integrations",
    icon: Webhook,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    name: "Productivity & DevTools",
    slug: "Productivity",
    description: "Command-line utilities, IDE extensions, debuggers",
    icon: Terminal,
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
  {
    name: "Frameworks & Runtimes",
    slug: "Frameworks",
    description: "Full-stack frameworks, microservices, Edge runtimes",
    icon: Layers,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    name: "Desktop & Local",
    slug: "Desktop",
    description: "Native applications, local-first workflows, offline tools",
    icon: Cpu,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    name: "All Tools",
    slug: "",
    description: "Browse the complete catalog of verified tools",
    icon: Boxes,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
]

export default function CategoriesPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Categories", url: `${SITE_CONFIG.url}/categories` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading="Tool & Product Categories"
          description="Explore developer tools and building blocks categorized by technical responsibility."
          aiPrompt={AI_PROMPTS.categories}
        />

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_ITEMS.map((cat) => {
              const href = cat.slug
                ? `${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.slug)}`
                : ROUTES.PRODUCTS
              return (
                <Link key={cat.name} href={href} className="block">
                  <Card className={discoveryCard}>
                    <CardContent className="flex items-start gap-4 p-5">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${cat.bg}`}
                      >
                        <cat.icon className={`size-5 ${cat.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">
                          {cat.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
