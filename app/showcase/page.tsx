import type { Metadata } from "next"
import { ShowcaseContent } from "@/components/showcase/showcase-content"

export const metadata: Metadata = {
  title: "Showcase Your Build",
  description:
    "Share what you've built with developer tools and APIs. Inspire other developers by showing your tech stack and how you used it.",
  keywords: [
    "showcase build",
    "developer showcase",
    "built with developer tools",
    "share project",
  ],
  openGraph: {
    title: "Showcase Your Build | BuyMyNextLaunch",
    description:
      "Share what you've built with developer tools and APIs.",
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ShowcasePage() {
  return <ShowcaseContent />
}
