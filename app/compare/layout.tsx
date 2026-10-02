import React from "react"
import type { Metadata } from "next"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_CONFIG.name} Comparisons`,
    default: `Platform Comparisons & Alternatives | ${SITE_CONFIG.name}`,
  },
}

const CompareLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white">
      {children}
    </div>
  )
}

export default CompareLayout
