import type { Metadata } from "next"
import { BuiltWithContent } from "@/components/built-with/built-with-content"

export const metadata: Metadata = {
  title: "Built With",
  description:
    "Explore the best products built with modern developer tools, APIs, and infrastructure.",
}

export default function BuiltWithPage() {
  return <BuiltWithContent />
}
