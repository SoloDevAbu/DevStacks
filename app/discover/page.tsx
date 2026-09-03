import type { Metadata } from "next"
import { DiscoverContent } from "@/components/discover/discover-content"

export const metadata: Metadata = {
  title: "Discover Products",
  description:
    "Find new tools, APIs, and infrastructure to build your next big idea.",
}

export default function DiscoverPage() {
  return <DiscoverContent />
}
