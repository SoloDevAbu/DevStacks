import type { Metadata } from "next"
import { BuiltWithContent } from "@/components/built-with/built-with-content"
import { organizationSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "Built With — Developer Products Directory",
  description:
    "Explore developer tools and APIs ranked by how many projects have been built with them. Find the most battle-tested tools in the ecosystem.",
  keywords: [
    "built with",
    "developer tools ranking",
    "most used APIs",
    "popular infrastructure",
    "developer ecosystem",
  ],
  openGraph: {
    title: "Built With — Developer Products Directory | BuyMyNextLaunch",
    description:
      "Developer tools ranked by number of projects built with them.",
    type: "website",
  },
}

export default function BuiltWithPage() {
  const jsonLd = organizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BuiltWithContent />
    </>
  )
}
