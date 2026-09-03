import type { Metadata } from "next"
import { SubmitContent } from "@/components/submit/submit-content"

export const metadata: Metadata = {
  title: "Submit Product",
  description: "Submit a new developer tool, API, or infrastructure product.",
}

export default function SubmitPage() {
  return <SubmitContent />
}
