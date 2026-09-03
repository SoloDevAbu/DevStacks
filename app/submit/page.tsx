import type { Metadata } from "next"
import { SubmitContent } from "@/components/submit/submit-content"

export const metadata: Metadata = {
  title: "Submit a Developer Product",
  description:
    "List your developer tool, API, or infrastructure product for the community to discover. Add SEO, AEO, GEO, and ASO data to maximize visibility.",
  keywords: [
    "submit product",
    "list developer tool",
    "submit API",
    "developer product directory",
  ],
  openGraph: {
    title: "Submit a Developer Product | BuyMyNextLaunch",
    description: "List your developer tool for the community to discover.",
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SubmitPage() {
  return <SubmitContent />
}
