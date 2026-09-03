import type { Metadata } from "next"
import { MainContent } from "@/components/home/main-content"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover developer tools, APIs, and infrastructure, and the products people are already building with them.",
}

export default function Page() {
  return <MainContent />
}
