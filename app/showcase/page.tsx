import type { Metadata } from "next"
import { ShowcaseContent } from "@/components/showcase/showcase-content"

export const metadata: Metadata = {
  title: "Showcase Your Build",
  description: "Share what you've built and the tools you used to build it.",
}

export default function ShowcasePage() {
  return <ShowcaseContent />
}
