import type { Metadata } from "next"
import { DiscoverContent } from "@/components/discover/discover-content"
import { organizationSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "Discover Products",
  description:
    "Find new developer tools, APIs, and infrastructure products. Filter by category, pricing, and tier to discover your next essential tool.",
  keywords: [
    "discover developer tools",
    "find APIs",
    "developer infrastructure",
    "SaaS tools",
    "developer products",
  ],
  openGraph: {
    title: "Discover Developer Tools & Products | BuyMyNextLaunch",
    description:
      "Find new developer tools, APIs, and infrastructure products.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Developer Tools & Products | BuyMyNextLaunch",
    description: "Find new developer tools, APIs, and infrastructure products.",
  },
}

export default function DiscoverPage() {
  const jsonLd = organizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DiscoverContent />
    </>
  )
}
