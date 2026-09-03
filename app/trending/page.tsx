import type { Metadata } from "next"
import { TrendingContent } from "@/components/trending/trending-content"

export const metadata: Metadata = {
  title: "Trending Products",
  description:
    "Discover the most popular products and developer tools gaining traction right now.",
}

export default function TrendingPage() {
  return <TrendingContent />
}
