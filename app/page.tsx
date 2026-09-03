import type { Metadata } from "next"
import { MainContent } from "@/components/home/main-content"
import { organizationSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "Home — Discover Developer Tools & Products",
  description:
    "Discover developer tools, APIs, and infrastructure products. Find what other developers are building and discover your next essential tool.",
  keywords: [
    "developer tools discovery",
    "find APIs",
    "developer products",
    "software marketplace",
    "developer infrastructure",
  ],
  openGraph: {
    title: "BuyMyNextLaunch — Discover Developer Tools & Products",
    description:
      "Discover developer tools, APIs, and infrastructure products.",
    type: "website",
  },
}

export default function Page() {
  const jsonLd = organizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MainContent />
    </>
  )
}
