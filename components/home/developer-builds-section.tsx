"use client"

import { DeveloperBuilds } from "@/components/discover/developer-builds"
import { sectionWrapper } from "@/utils/styles"

export const DeveloperBuildsSection = () => {
  return (
    <div className={sectionWrapper}>
      <DeveloperBuilds />
    </div>
  )
}
